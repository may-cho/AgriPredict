// useWeatherHooks.ts

import axios from "axios";
import { useState, useEffect } from "react";
import type { WeatherData, ForecastData, ForecastItem } from "../types";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const useWeatherData = (coords: {
  lat: number | null;
  lon: number | null;
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords.lat || !coords.lon) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;
        const response = await axios.get<WeatherData>(URL);
        setWeatherData(response.data);
      } catch (err) {
        console.error("Weather API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [coords.lat, coords.lon]);

  return { weatherData, loading };
};

export const useForecastData = (coords: {
  lat: number | null;
  lon: number | null;
}) => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [dailyData, setDailyData] = useState<ForecastItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const getDailyForecasts = (forecastList: ForecastItem[]) => {
    return forecastList.filter((item: ForecastItem) => {
      return item.dt_txt.includes("12:00:00");
    });
  };
  useEffect(() => {
    console.log("Forecast Hook triggered with coords:", coords);

    if (!coords.lat || !coords.lon) return;

    const fetchForecast = async () => {
      try {
        setLoading(true);
        const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;
        console.log("Calling Forecast API:", URL);

        const response = await axios.get<ForecastData>(URL);
        const dailyData = getDailyForecasts(response.data.list);

        setDailyData((prev) => {
          const currentItems = prev || [];
          return [...currentItems, ...dailyData];
        });
        setForecastData(response.data);
      } catch (err) {
        console.error("Forecast API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [coords.lat, coords.lon]);

  return { forecastData, loading, dailyData };
};
