import requests

def get_nasa_monthly_weather(lat, lon, year=2025):
    """
    NASA POWER API မှ လအလိုက် မိုးရေချိန်နှင့် အပူချိန်ကို ရယူရန်
    PRECTOTCORR = Precipitation (Rainfall)
    T2M = Temperature at 2 Meters
    """
    base_url = "https://power.larc.nasa.gov/api/temporal/monthly/point"
    
    params = {
        "parameters": "PRECTOTCORR,T2M",
        "community": "AG", # Agriculture Community
        "longitude": lon,
        "latitude": lat,
        "format": "JSON",
        "start": year,
        "end": year
    }

    try:
        response = requests.get(base_url, params=params, timeout=10)
        data = response.json()
        
        
        rainfall_dict = data['properties']['parameter']['PRECTOTCORR']
        temp_dict = data['properties']['parameter']['T2M']

        monthly_rainfall = [v for k, v in rainfall_dict.items() if not k.endswith('13')]
        monthly_temp = [v for k, v in temp_dict.items() if not k.endswith('13')]

        return monthly_rainfall, monthly_temp
    except Exception as e:
        print(f"NASA API Error: {e}")
        return [], []

def get_nasa_weather(lat, lon, start_date, end_date):
    # T2M = Temperature, PRECTOTCORR = Precipitation (Rainfall)
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR&community=AG&longitude={lon}&latitude={lat}&start={start_date}&end={end_date}&format=JSON"
    
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        
        # Data ထုတ်ယူခြင်း
        temp_data = data['properties']['parameter']['T2M']
        rain_data = data['properties']['parameter']['PRECTOTCORR']
        
        # ပျမ်းမျှတွက်ခြင်း (Invalid data -999 များကို ဖယ်ထုတ်ပါ)
        valid_temps = [v for v in temp_data.values() if v != -999]
        valid_rains = [v for v in rain_data.values() if v != -999]
        
        avg_temp = sum(valid_temps) / len(valid_temps) if valid_temps else 0
        avg_rain = sum(valid_rains) / len(valid_rains) if valid_rains else 0
        
        return {
            "avg_temp": round(avg_temp, 2),
            "avg_rain": round(avg_rain, 2)
        }
    except Exception as e:
        print(f"NASA API Error: {e}")
        return {"avg_temp": 30, "avg_rain": 5} # Fallback data