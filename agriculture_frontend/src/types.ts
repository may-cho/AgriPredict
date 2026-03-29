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
export interface Notification {
  id: string;
  type: "irrigation" | "pest" | "fertilizer" | "harvest";
  message: string;
  daysUntil: number;
  urgency: "high" | "medium" | "low";
}
