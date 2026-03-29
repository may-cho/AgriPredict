from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FarmerDecision,CropCycle,CropStage
from rest_framework.decorators import api_view

from datetime import datetime, timedelta
# မင်းရဲ့ project structure အလိုက် import များကို ပြန်စစ်ပါ
from .serializers import PredictionRequestSerializer
from .utils import predictor
from .constants import MYANMAR_REGION_COORDS
from .nasa_service import get_nasa_monthly_weather,get_nasa_weather

def get_coords_from_region(region_name):
    """Region အမည်မှ Lat/Lon ကို ရှာပေးရန် (Default: Yangon)"""
    return MYANMAR_REGION_COORDS.get(region_name, MYANMAR_REGION_COORDS["Yangon"])


def generate_recommendations(crop, avg_rain, avg_temp):
    recommendations = []
    
    # ၁။ ရေလောင်းရန် လိုမလို စစ်ဆေးခြင်း (Watering Logic)
    # ဥပမာ- တစ်လပျမ်းမျှ မိုးရေချိန် ၅၀mm အောက်ရောက်ရင် ရေသွင်းဖို့ အကြံပေးမယ်
    if avg_rain < 50:
        recommendations.append("⚠️ မိုးရွာသွန်းမှု နည်းပါးနိုင်သဖြင့် ပုံမှန်ထက် ပိုမို ရေလောင်းပေးရန် လိုအပ်ပါသည်။")
    elif 50 <= avg_rain <= 150:
        recommendations.append("✅ မိုးရွာသွန်းမှု အသင့်အတင့်ရှိသဖြင့် ပုံမှန်အတိုင်း ရေသွင်းပေးနိုင်ပါသည်။")
    else:
        recommendations.append("🌊 မိုးများနိုင်သဖြင့် ရေဝပ်ခြင်းမရှိစေရန် ရေနုတ်မြောင်းများ စနစ်တကျ ပြုလုပ်ထားပါ။")

    # ၂။ အပူချိန်အလိုက် သတိပေးချက် (Temperature Logic)
    if avg_temp > 35:
        recommendations.append("🔥 အပူချိန် မြင့်မားနိုင်သဖြင့် အပင်များ ညှိုးနွမ်းခြင်းမှ ကာကွယ်ရန် နံနက်စောစော သို့မဟုတ် ညနေစောင်းတွင် ရေလောင်းပါ။")
    
    # ၃။ သီးနှံအလိုက် အထူးအကြံပြုချက် (Crop Specific)
    if crop == "ဆန်စပါး" and avg_rain > 200:
        recommendations.append("🌾 စပါးနှံများ အောင်မြင်ရန် ရေအနက်ကို စနစ်တကျ ထိန်းညှိပေးပါ။")

    return recommendations 

class CropPredictionView(APIView):
    
    """
    NASA API မှ Weather Data ကို ရယူပြီး ML Model ဖြင့် 
    အကျိုးအမြတ်နှင့် အထွက်နှုန်းကို ခန့်မှန်းပေးမည့် တစ်ခုတည်းသော API
    """

    def post(self, request):
        # ၁။ Serializer ဖြင့် Incoming Data ကို အရင်စစ်ဆေးမယ်
        # (monthly_rainfall နဲ့ monthly_temp ကို serializer ထဲမှာ required=False ပေးထားပါ)
        serializer = PredictionRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"❌ Validation Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Valid ဖြစ်ပြီးသား data များကို ရယူမယ်
        v_data = serializer.validated_data
        crop = v_data.get('crop')
        region = v_data.get("region", "Yangon")

        # ၂။ Coordinate ရှာဖွေခြင်း
        coords = get_coords_from_region(region)
        lat, lon = coords['lat'], coords['lon']

        # ၃။ NASA API မှ Weather Data (Rainfall & Temp) ရယူခြင်း
        # NASA API က list [val1, val2, ...] အတိုင်း ပြန်ပေးရပါမယ်
        rainfall, temps = get_nasa_monthly_weather(lat, lon)
        

        if not rainfall or not temps:
            return Response(
                {"error": "NASA Weather Data ရယူ၍ မရနိုင်သေးပါ။ ခဏနေမှ ပြန်ကြိုးစားပါ။"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        try:
            # ၄။ Predictor အတွက် Payload ပြင်ဆင်ခြင်း
            # Frontend ကလာတဲ့ data တွေထဲကို NASA ကရတဲ့ weather data တွေ ပေါင်းထည့်မယ်
            model_input = {
                **v_data,
                'monthly_rainfall': rainfall[:5], # ရှေ့ ၅ လစာ data
                'monthly_temp': temps[:5]
            }

            # ၅။ ML Model ဖြင့် Prediction လုပ်ခြင်း (predictor instance ကို သုံးမယ်)
            result = predictor.predict(model_input)

                    
            avg_rain = sum(rainfall[:5]) / 5
            avg_temp = sum(temps[:5]) / 5

           
            advices = generate_recommendations(crop, avg_rain, avg_temp)
            
            # ၆။ အောင်မြင်ပါက Response ပြန်လည်ပေးပို့ခြင်း
            return Response({
                "status": "success",
                "region_info": {
                    "name": region,
                    "lat": lat,
                    "lon": lon
                },
                "prediction": {
                    "yield_per_acre": round(result['yield_per_acre'], 2),
                    "profit_per_acre": round(result['profit_per_acre'], 0),
                    "total_profit": round(result['total_profit'], 0),
                    "recommendations": advices
                },
                "weather_snapshot": {
                    "total_rainfall_mm": round(sum(rainfall[:5]), 2),
                    "avg_temp_c": round(sum(temps[:5])/5, 2),
                    "source": "NASA POWER API"
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # Predictor ထဲမှာ error တက်ခဲ့ရင် (ဥပမာ- dummy encoding logic error)
            return Response(
                {"error": f"Prediction Process Error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            
@api_view(['GET'])
def get_crop_status(request, cycle_id):
    try:
        cycle = CropCycle.objects.get(id=cycle_id)
        location = MYANMAR_REGION_COORDS.get(cycle.region, MYANMAR_REGION_COORDS["Yangon"])
        lat = location["lat"]
        lon = location["lon"]
        # ၁။ NASA Weather Data ယူခြင်း (Dynamic Dates သုံးထားသည်)
        today = datetime.now()
        start_date = (today - timedelta(days=7)).strftime('%Y%m%d')
        end_date = today.strftime('%Y%m%d')
        weather = get_nasa_weather(lat, lon, start_date, end_date)
        
        # ၂။ Notifications တွက်ချက်ခြင်း
        notifications = get_notifications(cycle, weather)
        
        # ၃။ Timeline Data စီစဉ်ခြင်း
        # (is_completed, is_current logic များပါဝင်ပြီးသားဖြစ်ရမည်)
        crop_name = cycle.crop_name

        planting_month = cycle.start_date.month if cycle.start_date else 3

        timeline = predictor.calculate_timeline(crop_name, planting_month)
            

        # ၄။ Response တစ်ခုတည်းအဖြစ် ပေါင်းပို့ခြင်း
        return Response({
            "cycle_info": {
                "name": cycle.crop_name,
                "location": f"{lat}, {lon}",
                "start_date": cycle.start_date
            },
            "weather": weather,
            "notifications": notifications,
            "timeline": timeline
        })
        
    except CropCycle.DoesNotExist:
        return Response({"error": "Cycle not found"}, status=404)

# views.py
@api_view(['PATCH']) # Patch က data တစ်စိတ်တစ်ပိုင်းကိုပြင်တာမို့လို့ ပိုသင့်တော်တယ်
def update_stage_status(request, stage_id):
    try:
        stage = CropStage.objects.get(id=stage_id)
        # Frontend ကနေ is_completed (true/false) ပို့ပေးရမယ်
        stage.is_completed = request.data.get('is_completed', False)
        
        # Status Label ကိုပါ တစ်ခါတည်း update လုပ်မယ်
        if stage.is_completed:
            stage.status_label = "ပြီးစီး"
        else:
            # တကယ်လို့ အမှန်ခြစ် ပြန်ဖြုတ်ရင် (ယနေ့ထက်စောရင် လာမည့်၊ ယနေ့ဆိုရင် လက်ရှိ)
            stage.status_label = "လာမည့်" 
            
        stage.save()
        return Response({"status": "success", "is_completed": stage.is_completed})
    except CropStage.DoesNotExist:
        return Response({"error": "Stage not found"}, status=404)
        



def get_notifications(cycle, weather_data):
    notifs = []
    
    # ၁။ 'လက်ရှိ' ကို အရင်ရှာမယ်
    current_stage = cycle.stages.filter(status_label="လက်ရှိ").first()
    
    # ၂။ မတွေ့ရင် 'ပြီးစီး' သွားတဲ့အထဲက နောက်ဆုံးတစ်ခု (Latest Completed) ကို ယူမယ်
    if not current_stage:
        current_stage = cycle.stages.filter(status_label="ပြီးစီး").order_by('-expected_date').first()

    # ၃။ အဲဒါမှ မရှိသေးရင် (စိုက်ပျိုးခါစဆိုရင်) ပထမဆုံး stage ကို ယူမယ်
    if not current_stage:
        current_stage = cycle.stages.all().order_by('expected_date').first()

    # Debug: အခုဆိုရင် 'ပြီးစီး' သွားတဲ့ stage တစ်ခုခုတော့ ပေါ်လာပါပြီ
    print(f"DEBUG: Current Stage Selected -> {current_stage}")

    if not current_stage:
        return []

    avg_rain = weather_data.get('avg_rain', 0)
    avg_temp = weather_data.get('avg_temp', 0)
    avg_humid = weather_data.get('avg_humid', 75)
    stage_name = current_stage.stage_name

    # --- ၄။ Weather Logic (အခု Notification ပေါ်အောင် Threshold တွေကို ညှိထားပါတယ်) ---
    if avg_rain < 5.0: # မိုးနည်းနေလျှင် (မင်းရဲ့ ၀.၃၄ နဲ့ဆို ဒီထဲဝင်မယ်)
        notifs.append({
            "id": 101, "type": "irrigation", "urgency": "high",
            "message": f"လက်ရှိ {stage_name} အဆင့်အပြီးတွင် မိုးရွာသွန်းမှု နည်းနေသဖြင့် ရေသွင်းရန် ပြင်ဆင်ပါ။",
            "daysUntil": 1
        })
    
    if avg_temp > 25.0: # အပူချိန် (မင်းရဲ့ ၂၅.၉ နဲ့ဆို ဒီထဲဝင်မယ်)
        notifs.append({
            "id": 201, "type": "pest", "urgency": "medium",
            "message": f"{stage_name} အဆင့်တွင် ပိုးမွှားကျရောက်မှုရှိမရှိ စစ်ဆေးပေးပါ။",
            "daysUntil": 3
        })

    if avg_temp > 28.0 and avg_humid > 80.0:
        notifs.append({
            "id": 301, "type": "warning", "urgency": "high",
            "message": f"အပူချိန်နှင့် စိုထိုင်းဆ မြင့်မားနေသဖြင့် {stage_name} အဆင့်တွင် မှိုရောဂါ (Blight) ကျရောက်နိုင်ခြေ များပါသည်။",
            "daysUntil": 2
        })
    if "ကြီးထွားမှု" in stage_name or "အပင်ပွား" in stage_name:
        if avg_rain > 0 and avg_rain < 15.0: # မိုးဖွဲဖွဲလေးပဲ ရွာမည့်အခြေအနေ
            notifs.append({
                "id": 401, "type": "success", "urgency": "medium",
                "message": "မိုးဖွဲဖွဲလေး ရွာသွန်းနေသဖြင့် မြေသြဇာကျွေးရန် အလွန်သင့်တော်သော အချိန်ဖြစ်ပါသည်။",
                "daysUntil": 1
            })
        elif avg_rain > 50.0: # မိုးအရမ်းများမည့်အခြေအနေ
            notifs.append({
                "id": 402, "type": "warning", "urgency": "high",
                "message": "မိုးသည်းထန်စွာ ရွာသွန်းနိုင်သဖြင့် ယနေ့ မြေသြဇာကျွေးခြင်းကို ခေတ္တဆိုင်းငံ့ထားပါ။",
                "daysUntil": 3
            })
    if avg_temp > 38.0:
        notifs.append({
            "id": 501, "type": "danger", "urgency": "high",
            "message": f"အပူချိန် လွန်ကဲနေသဖြင့် {stage_name} အဆင့်တွင် အနှံများ အောင်မြင်ရန် ရေသွင်းခြင်းကို ညနေပိုင်းတွင် ပြုလုပ်ပေးပါ။",
            "daysUntil": 1
        })
    if "ရိတ်သိမ်း" in stage_name:
        if avg_rain > 20.0:
            notifs.append({
                "id": 601, "type": "warning", "urgency": "high",
                "message": "ရိတ်သိမ်းချိန်တွင် မိုးရွာသွန်းနိုင်သဖြင့် ရိတ်သိမ်းပြီး သီးနှံများကို လုံခြုံစွာ သိမ်းဆည်းရန် ပြင်ဆင်ပါ။",
                "daysUntil": 1
            })
        else:
            notifs.append({
                "id": 602, "type": "success", "urgency": "medium",
                "message": "ရာသီဥတု သာယာနေသဖြင့် သီးနှံများ ရိတ်သိမ်းရန်နှင့် အခြောက်လှန်းရန် အကောင်းဆုံးအချိန် ဖြစ်ပါသည်။",
                "daysUntil": 0
            })
    return notifs
@api_view(['GET'])
def get_crop_cycle_details(request, cycle_id):
    cycle = CropCycle.objects.get(id=cycle_id)
    
    # ၁။ Dynamic Dates သတ်မှတ်ခြင်း (ယနေ့ နဲ့ လွန်ခဲ့တဲ့ ၇ ရက်)
    today = datetime.now()
    seven_days_ago = today - timedelta(days=7)
    
    # NASA API format (YYYYMMDD) အတိုင်း ပြောင်းလဲခြင်း
    start_date_str = seven_days_ago.strftime('%Y%m%d')
    end_date_str = today.strftime('%Y%m%d')
    
    # ၂။ NASA မှ Dynamic Weather Data ယူခြင်း
    # အခုဆိုရင် ရက်စွဲတွေက စက်ရဲ့ နာရီပေါ်မူတည်ပြီး အလိုအလျောက် ပြောင်းသွားပါပြီ
    weather = get_nasa_weather(
        cycle.lat, 
        cycle.lon, 
        start_date_str, 
        end_date_str
    )
    
    # ၃။ အကြံပြုချက်များ ထုတ်ယူခြင်း
    notifications = get_notifications(cycle, weather)
    
    return Response({
        "today_date": today.strftime('%d %b %Y'),
        "weather": weather,
        "notifications": notifications,
        "timeline": list(cycle.stages.values())
    })
@api_view(['POST'])
def save_farmer_decision(request):
    data = request.data
    if data.get('decision') == 'yes':
        # ၁။ Cycle ကို အရင်ဆောက်မယ်
        cycle = CropCycle.objects.create(
            crop_name=data.get('crop'),
            region=data.get('region'),
            area_acres=data.get('area_acres')
        )

        # ၂။ Predictor ကနေ timeline တွက်မယ်
        # (စိုက်ပျိုးမည့်လကို လက်ရှိလအဖြစ် ယူဆမယ်)
        current_month = datetime.now().month
        timeline_data = predictor.calculate_timeline(data.get('crop'), current_month)

        # ၃။ Database ထဲမှာ Stage တစ်ခုချင်းစီကို သိမ်းမယ်
        for stage in timeline_data:
            CropStage.objects.create(
                cycle=cycle,
                stage_name=stage['stage_name'],
                # 🌟 ဒီနေရာမှာ 'date_obj' ကို သုံးရပါမယ် (ဒါမှ ၂၉ မတ် မဟုတ်ဘဲ ရက်တွေ ကွဲသွားမှာပါ)
                expected_date=stage['date_obj'], 
                is_completed=stage['is_completed'],
                status_label=stage['status_label']
            )

        return Response({"status": "success", "cycle_id": cycle.id}, status=201)
    
    return Response({"status": "no_action", "message": "Decision was 'no'."})