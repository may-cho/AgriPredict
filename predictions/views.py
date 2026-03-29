from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FarmerDecision,CropCycle,CropStage
from rest_framework.decorators import api_view

import datetime

# မင်းရဲ့ project structure အလိုက် import များကို ပြန်စစ်ပါ
from .serializers import PredictionRequestSerializer
from .utils import predictor
from .constants import MYANMAR_REGION_COORDS
from .nasa_service import get_nasa_monthly_weather

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
            
            


@api_view(['POST'])
def save_farmer_decision(request):
    data = request.data
    if data.get('decision') == 'yes':
        # ၁။ Crop Cycle (အဓိက အနှစ်ချုပ်) ကို အရင်သိမ်းမယ်
        cycle = CropCycle.objects.create(
            crop_name=data.get('crop'),
            region=data.get('region'),
            area_acres=data.get('area_acres')
        )

        # ၂။ Predictor ကနေ Timeline တွက်ချက်မယ်
        current_month = datetime.now().month
        timeline_data = predictor.calculate_timeline(data.get('crop'), current_month)

        # ၃။ တွက်ချက်ရလာတဲ့ အဆင့်တစ်ခုချင်းစီကို Database ထဲ Loop ပတ်ပြီး သိမ်းမယ်
        for stage in timeline_data:
            # stage['date'] စာသားကို Python Date object ပြောင်းရန် (ဥပမာ "15 June" -> Date)
            # ဒါမှမဟုတ် predictor ထဲမှာ date object အတိုင်း ပြန်ပေးဖို့ ပြင်ထားရင် ပိုလွယ်မယ်
            
            CropStage.objects.create(
                cycle=cycle,
                stage_name=stage['stage_name'],
                expected_date=datetime.now().date(), # 💡 မှတ်ချက်- ဒီနေရာမှာ stage date ကို conversion လုပ်ပေးရပါမယ်
                is_completed=stage['is_completed'],
                status_label=stage['status_label']
            )

        return Response({"status": "success", "cycle_id": cycle.id}, status=201)
    
