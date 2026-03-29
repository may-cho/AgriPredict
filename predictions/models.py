from django.db import models

class FarmerDecision(models.Model):
    crop = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    area_acres = models.FloatField()
    decision = models.CharField(max_length=10, choices=[('yes', 'Yes'), ('no', 'No')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __clstr__(self):
        return f"{self.crop} in {self.region} - {self.decision}"

        
class CropCycle(models.Model):
    """တောင်သူတစ်ယောက်ချင်းစီရဲ့ စိုက်ပျိုးမှု သက်တမ်းတစ်ခုလုံးကို သိမ်းမည့် Model"""
    crop_name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    area_acres = models.FloatField()
    start_date = models.DateField(auto_now_add=True) # စိုက်ပျိုးသည့်နေ့
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.crop_name} - {self.start_date}"

class CropStage(models.Model):
    """စိုက်ပျိုးမှု သက်တမ်းတစ်ခုအတွင်းရှိ အဆင့်ဆင့် (Timeline Stages) များ"""
    cycle = models.ForeignKey(CropCycle, related_name='stages', on_delete=models.CASCADE)
    stage_name = models.CharField(max_length=100)
    expected_date = models.DateField() # ခန့်မှန်းခြေရက်စွဲ
    is_completed = models.BooleanField(default=False) # တောင်သူက လုပ်ပြီးကြောင်း အမှန်ခြစ်ခဲ့လျှင်
    status_label = models.CharField(max_length=50) # 'ပြီးစီး', 'လက်ရှိ', 'လာမည့်'

    def __str__(self):
        return f"{self.cycle.crop_name} - {self.stage_name}"