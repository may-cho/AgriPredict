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