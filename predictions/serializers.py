from rest_framework import serializers

class PredictionRequestSerializer(serializers.Serializer):
    # ၁။ Crop Choices (Backend Dict Keys နဲ့ ကိုက်အောင် ပြင်ဆင်ခြင်း)
    CROP_CHOICES = [
        ('ဆန်စပါး', 'ဆန်စပါး'),
        ('ပြောင်း', 'ပြောင်း'),
        ('မြေပဲ', 'မြေပဲ'),
        ('နေကြာ', 'နေကြာ'),
    ]

    # ၂။ Region Choices (Constants.py ထဲက Hardcoded Keys များအတိုင်း)
    REGION_CHOICES = [
        ('Yangon', 'ရန်ကုန်'),
        ('Mandalay', 'မန္တလေး'),
        ('Ayeyarwady', 'ဧရာဝတီ'),
        ('Sagaing', 'စစ်ကိုင်း'),
        ('Magway', 'မကွေး'),
        ('Shan', 'ရှမ်း'),
    ]

    # ၃။ Soil Choices
    SOIL_CHOICES = [
        ('နုန်း', 'နုန်း'),
        ('သဲနုန်း', 'သဲနုန်း'),
        ('မြေနီ', 'မြေနီ'),
        ('သဲ', 'သဲ'),
        ('နုန်းရွှံ့', 'နုန်းရွှံ့'),
    ]

    crop = serializers.ChoiceField(choices=CROP_CHOICES)
    region = serializers.ChoiceField(choices=REGION_CHOICES)
    soil_type = serializers.ChoiceField(choices=SOIL_CHOICES)
    area_acres = serializers.FloatField(min_value=0.1)
    planting_month = serializers.IntegerField(min_value=1, max_value=12)
    total_cost_per_acre = serializers.FloatField(min_value=0)

    # 🌟 အရေးကြီးဆုံးအချက် - NASA API ကနေ ဖြည့်မှာမို့လို့ required=False လုပ်ပါ
    monthly_rainfall = serializers.ListField(
        child=serializers.FloatField(min_value=0),
        required=False,
        allow_null=True
    )
    monthly_temp = serializers.ListField(
        child=serializers.FloatField(),
        required=False,
        allow_null=True
    )

    def validate(self, data):
        """
        NASA API မှ weather data ကို View ထဲတွင် ဖြည့်စွက်မည်ဖြစ်သောကြောင့်
        Serializer အဆင့်တွင် Length စစ်ဆေးခြင်းကို ဖယ်ရှားလိုက်ပါသည် (သို့မဟုတ်)
        Data ရှိမှသာ စစ်ဆေးရန် ပြင်ဆင်ပါမည်။
        """
        if 'monthly_rainfall' in data and data['monthly_rainfall']:
            crop = data['crop']
            duration_map = {'ဆန်စပါး': 5, 'ပြောင်း': 4, 'မြေပဲ': 4, 'နေကြာ': 4}
            duration = duration_map.get(crop, 4)
            
            if len(data['monthly_rainfall']) != duration:
                raise serializers.ValidationError(f"{crop} အတွက် {duration} လစာ data လိုအပ်ပါသည်။")
        
        return data

class PredictionResponseSerializer(serializers.Serializer):
    yield_per_acre = serializers.FloatField()
    profit_per_acre = serializers.FloatField()
    total_profit = serializers.FloatField()
    status = serializers.CharField()