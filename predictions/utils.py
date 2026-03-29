import joblib
import os
import numpy as np
import pandas as pd
from pathlib import Path
from django.conf import settings
from datetime import datetime, timedelta

class ProfitPredictor:
    def __init__(self):
        self.yield_model = None
        self.profit_model = None
        self.features = None
        self.crop_duration = {
            'ဆန်စပါး': 5,
            'ပြောင်း': 4,
            'မြေပဲ': 4,
            'နေကြာ': 4
        }
        
        self.crop_stages_config = {
        'ဆန်စပါး': [
            {'name': 'စိုက်ပျိုးခြင်း', 'days': 0},
            {'name': 'ပင်ပွားထွက်ခြင်း', 'days': 25},
            {'name': 'ပန်းပွင့်ခြင်း', 'days': 75},
            {'name': 'ရင့်မှည့်ခြင်း', 'days': 105},
            {'name': 'ရိတ်သိမ်းခြင်း', 'days': 135}
        ],
        'ပြောင်း': [
            {'name': 'စိုက်ပျိုးခြင်း', 'days': 0},
            {'name': 'ပေါင်းသတ်ခြင်း', 'days': 25},
            {'name': 'အဖူးစထွက်ခြင်း', 'days': 55},
            {'name': 'အစေ့တည်ခြင်း', 'days': 85},
            {'name': 'ရိတ်သိမ်းခြင်း', 'days': 110}
        ],
        'default': [
            {'name': 'စိုက်ပျိုးခြင်း', 'days': 0},
            {'name': 'ကြီးထွားမှုအဆင့်', 'days': 30},
            {'name': 'ပန်းပွင့်/အသီးထွက်ခြင်း', 'days': 60},
            {'name': 'ရိတ်သိမ်းခြင်း', 'days': 110}
        ]
    }
        self.load_models()

    def load_models(self):
        """Load pre-trained models from disk"""
        model_dir = settings.MODEL_ROOT
        self.yield_model = joblib.load(os.path.join(model_dir, 'yield_model_weather.pkl'))
        self.profit_model = joblib.load(os.path.join(model_dir, 'profit_model_weather.pkl'))
        self.features = joblib.load(os.path.join(model_dir, 'features_weather.pkl'))
        
    def calculate_timeline(self, crop, planting_month):
        """
        စိုက်ပျိုးမည့်လအပေါ် မူတည်ပြီး Timeline ရက်စွဲများ တွက်ချက်ရန်
        """
        # ❌ အရင်က logic: အဲဒီလရဲ့ ၁ ရက်နေ့ကနေ စတွက်တာ
        # start_date = datetime(current_year, planting_month, 1)

        # ✅ ပြင်ဆင်ရန် logic: "ယနေ့" (တောင်သူ ဆုံးဖြတ်ချက်ချသည့်နေ့) ကနေ စတွက်မယ်
        start_date = datetime.now() 
        
        stages = self.crop_stages_config.get(crop, self.crop_stages_config['default'])
        timeline = []
        now = datetime.now()

        for stage in stages:
            # ယနေ့ကနေစပြီး Config ထဲက ရက်ပေါင်းတွေကို ပေါင်းမယ်
            stage_date = start_date + timedelta(days=stage['days'])
            
            # ... (ကျန်တဲ့ logic တွေက အတူတူပါပဲ) ...
            is_completed = stage_date.date() <= now.date() # ယနေ့ထက် စောရင် ပြီးစီး
            
            timeline.append({
                'stage_name': stage['name'],
                'date_obj': stage_date.date(),
                'date_str': stage_date.strftime('%d %b'),
                'is_completed': is_completed,
                'status_label': "ပြီးစီး" if is_completed else "လာမည့်"
            })
            
        return timeline

    def compute_weather_features(self, monthly_rainfall, monthly_temp):
        """Compute aggregate weather features from monthly data"""
        total_rain = sum(monthly_rainfall)
        avg_temp = np.mean(monthly_temp)
        cv_rain = np.std(monthly_rainfall) / (np.mean(monthly_rainfall) + 1e-6)
        dry_months = sum(1 for r in monthly_rainfall if r < 50)
        hot_months = sum(1 for t in monthly_temp if t > 35)
        max_temp = max(monthly_temp)
        min_rain = min(monthly_rainfall)
        return {
            'total_rainfall_mm': total_rain,
            'avg_temp_c': avg_temp,
            'cv_rainfall': cv_rain,
            'dry_months': dry_months,
            'hot_months': hot_months,
            'max_temp_c': max_temp,
            'min_rainfall_mm': min_rain
        }

    def predict(self, data):
        crop = data['crop']
        region = data['region']
        soil = data['soil_type']
        area = data['area_acres']
        planting_month = data['planting_month']
        total_cost = data['total_cost_per_acre']
        monthly_rain = data['monthly_rainfall']
        monthly_temp = data['monthly_temp']

        # Compute harvest month
        duration = self.crop_duration.get(crop, 4)
        harvest_month = (planting_month + duration) % 12
        if harvest_month == 0: harvest_month = 12

        weather_feats = self.compute_weather_features(monthly_rain, monthly_temp)

        input_dict = {
            'crop': crop, 'region': region, 'soil_type': soil,
            'area_acres': area, 'planting_month': planting_month,
            'harvest_month': harvest_month, 'total_cost_per_acre': total_cost,
            **weather_feats
        }

        df_input = pd.DataFrame([input_dict])
        df_enc = pd.get_dummies(df_input, columns=['crop', 'region', 'soil_type'])

        # Add circular month features
        df_enc['planting_month_sin'] = np.sin(2 * np.pi * df_enc['planting_month'] / 12)
        df_enc['planting_month_cos'] = np.cos(2 * np.pi * df_enc['planting_month'] / 12)
        df_enc['harvest_month_sin'] = np.sin(2 * np.pi * df_enc['harvest_month'] / 12)
        df_enc['harvest_month_cos'] = np.cos(2 * np.pi * df_enc['harvest_month'] / 12)

        for col in self.features:
            if col not in df_enc.columns:
                df_enc[col] = 0
        df_enc = df_enc[self.features]

        yield_pred = self.yield_model.predict(df_enc)[0]
        profit_pred = self.profit_model.predict(df_enc)[0]

        return {
            'yield_per_acre': yield_pred,
            'profit_per_acre': profit_pred,
            'total_profit': profit_pred * area,
            'status': 'success'
        }

# Singleton instance
predictor = ProfitPredictor()