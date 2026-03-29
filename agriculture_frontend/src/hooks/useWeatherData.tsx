import axios from "axios";
import { useState, useEffect } from "react";
import { useGeolocation } from "./useGeoLocation";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const useWeatherData = () => {
  const { coords, loading: geoLoading, error: geoError } = useGeolocation();

  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords.lat || !coords.lon) {
      return;
    }

    async function fetchWeather() {
      try {
        setLoading(true);
        console.log("Fetching weather for:", coords.lat, coords.lon);

        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;

        const response = await axios.get(URL);
        console.log("API Response Success:", response.data);
        setWeatherData(response.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [coords.lat, coords.lon, API_KEY]);

  return { weatherData, loading: geoLoading || loading, error: geoError };
};

export const useForecastData = () => {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;
};
