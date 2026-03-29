import joblib
import os
import numpy as np
import pandas as pd
from pathlib import Path
from django.conf import settings
import datetime

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
        # ယခုနှစ်ကို ယူမယ်
        current_year = datetime.now().year
        # စိုက်ပျိုးမည့်လရဲ့ ၁ ရက်နေ့ကနေ စတွက်မယ်
        try:
            start_date = datetime(current_year, planting_month, 1)
        except ValueError:
            # လွဲမှားတဲ့ လ (ဥပမာ ၁၃ လ) ဝင်လာရင် လက်ရှိလနဲ့ အစားထိုးမယ်
            start_date = datetime.now().replace(day=1)
        
        # သီးနှံအလိုက် Stage Config ကို ယူမယ် (မရှိရင် default ကို ယူမယ်)
        stages = self.crop_stages_config.get(crop, self.crop_stages_config['default'])
        timeline = []
        now = datetime.now()

        for stage in stages:
            # ရက်ပေါင်း ပေါင်းထည့်ပြီး Stage တစ်ခုချင်းစီရဲ့ Date ကို ရှာမယ်
            stage_date = start_date + timedelta(days=stage['days'])
            
            # Status တွက်ချက်ခြင်း
            is_completed = stage_date < now
            # လက်ရှိ Stage ဟုတ်မဟုတ် (ယနေ့ကနေ ရက် ၃၀ အတွင်းဆိုရင် Current လို့ သတ်မှတ်မယ်)
            is_current = (now - stage_date).days >= 0 and (now - stage_date).days < 30

            timeline.append({
                'stage_name': stage['name'],
                'date': stage_date.strftime('%d %B'), # ဥပမာ - "15 June"
                'is_completed': is_completed,
                'is_current': is_current,
                'status_label': "ပြီးစီး" if is_completed else ("လက်ရှိ" if is_current else "လာမည့်")
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
        """
        data: dict with keys:
            crop, region, soil_type, area_acres, planting_month,
            total_cost_per_acre, monthly_rainfall (list), monthly_temp (list)
        Returns: dict with yield, profit_per_acre, total_profit, status
        """
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
        if harvest_month == 0:
            harvest_month = 12

        # Compute weather features
        weather_feats = self.compute_weather_features(monthly_rain, monthly_temp)

        # Build input dict
        input_dict = {
            'crop': crop,
            'region': region,
            'soil_type': soil,
            'area_acres': area,
            'planting_month': planting_month,
            'harvest_month': harvest_month,
            'total_cost_per_acre': total_cost,
            **weather_feats
        }

        # Create DataFrame
        df_input = pd.DataFrame([input_dict])

        # One-hot encode categoricals
        df_enc = pd.get_dummies(df_input, columns=['crop', 'region', 'soil_type'])

        # Add circular month features
        df_enc['planting_month_sin'] = np.sin(2 * np.pi * df_enc['planting_month'] / 12)
        df_enc['planting_month_cos'] = np.cos(2 * np.pi * df_enc['planting_month'] / 12)
        df_enc['harvest_month_sin'] = np.sin(2 * np.pi * df_enc['harvest_month'] / 12)
        df_enc['harvest_month_cos'] = np.cos(2 * np.pi * df_enc['harvest_month'] / 12)

        # Align columns with training features
        for col in self.features:
            if col not in df_enc.columns:
                df_enc[col] = 0
        df_enc = df_enc[self.features]

        # Predict
        yield_pred = self.yield_model.predict(df_enc)[0]
        profit_pred = self.profit_model.predict(df_enc)[0]

        total_profit = profit_pred * area

        return {
            'yield_per_acre': yield_pred,
            'profit_per_acre': profit_pred,
            'total_profit': total_profit,
            'status': 'success'
        }

# Singleton instance
predictor = ProfitPredictor()


def get_current_stage(start_date, crop_type):
    days_since_planting = (datetime.now() - start_date).days
    
  
    if days_since_planting < 15:
        return "မြေပြင်ဆင်ခြင်း"
    elif days_since_planting < 45:
        return "စိုက်ပျိုးခြင်း"
    elif days_since_planting < 120:
        return "ပြုစုစောင့်ရှောက်ခြင်း (ပေါင်းသတ်/မြေသြဇာ)"
    else:
        return "ရိတ်သိမ်းခြင်း"