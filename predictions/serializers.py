from rest_framework import serializers

class PredictionRequestSerializer(serializers.Serializer):
    crop = serializers.ChoiceField(choices=['ဆန်စပါး', 'ပြောင်း', 'မြေပဲ', 'နေကြာ'])
    region = serializers.ChoiceField(choices=['ဧရာဝတီ', 'မန္တလေး', 'မကွေး', 'ရှမ်း', 'စစ်ကိုင်း'])
    soil_type = serializers.ChoiceField(choices=['နုန်း', 'သဲနုန်း', 'မြေနီ', 'သဲ', 'နုန်းရွှံ့'])
    area_acres = serializers.FloatField(min_value=0.1)
    planting_month = serializers.IntegerField(min_value=1, max_value=12)
    total_cost_per_acre = serializers.FloatField(min_value=0)
    monthly_rainfall = serializers.ListField(child=serializers.FloatField(min_value=0))
    monthly_temp = serializers.ListField(child=serializers.FloatField())

    def validate(self, data):
        crop = data['crop']
        duration_map = {'ဆန်စပါး':5, 'ပြောင်း':4, 'မြေပဲ':4, 'နေကြာ':4}
        duration = duration_map.get(crop, 4)
        if len(data['monthly_rainfall']) != duration:
            raise serializers.ValidationError(f"{crop} အတွက် {duration} လအတွက် မိုးရေချိန် ပေးရပါမယ်။")
        if len(data['monthly_temp']) != duration:
            raise serializers.ValidationError(f"{crop} အတွက် {duration} လအတွက် အပူချိန် ပေးရပါမယ်။")
        return data

class PredictionResponseSerializer(serializers.Serializer):
    yield_per_acre = serializers.FloatField()
    profit_per_acre = serializers.FloatField()
    total_profit = serializers.FloatField()
    status = serializers.CharField()