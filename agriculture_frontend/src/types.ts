export interface CropData {
  type: string;
  region: string;
  landSize: number;
  soilType: string;
  amount: number;
  predictedProfit: number;
}

export interface CostData {
  seeds: number;
  fertilizer: number;
  irrigation: number;
  labor: number;
  machinery: number;
  transport: number;
  other: number;
}

export interface HarvestData {
  actualYield: number;
  actualPrice: number;
  actualProfit: number;
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number; // Probability of precipitation (မိုးရွာနိုင်ခြေ 0 မှ 1 အတွင်း)
  rain?: {
    "3h": number;
  };
  sys: {
    pod: "d" | "n"; // d = day, n = night
  };
  dt_txt: string; // "2026-03-29 06:00:00"
}
export interface Notification {
  id: string;
  type: "irrigation" | "pest" | "fertilizer" | "harvest";
  message: string;
  daysUntil: number;
  urgency: "high" | "medium" | "low";
}
