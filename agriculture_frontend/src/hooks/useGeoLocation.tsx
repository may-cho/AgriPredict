import { useEffect, useState } from "react";

interface LocationCoords {
  lat: number | null;
  lon: number | null;
}

interface GeolocationState {
  coords: LocationCoords;
  error: string | null;
  loading: boolean;
}
export const useGeolocation = (): GeolocationState => {
  const isSupported =
    typeof window !== "undefined" && "geolocation" in navigator;

  const [state, setState] = useState<GeolocationState>({
    coords: { lat: null, lon: null },
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchIpLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setState({
          coords: { lat: data.latitude, lon: data.longitude },
          error: null,
          loading: false,
        });
        console.log("Fallback Location (IP):", data.city);
      } catch (e) {
        setState((prev) => ({
          ...prev,
          error: "Location failed",
          loading: false,
        }));
      }
    };

    if (!isSupported) {
      fetchIpLocation();
      return;
    }

    // ၂။ Native Geolocation ကို အရင်ကြိုးစားမယ်
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      (err) => {
        console.warn(
          `Native Geo Error (${err.code}): ${err.message}. Trying Fallback...`,
        );
        fetchIpLocation(); // Native မရရင် IP ဘက်ကို ကူးမယ်
      },
      { timeout: 5000 }, // ၅ စက္ကန့်ပဲ စောင့်မယ်
    );
  }, [isSupported]);

  return state;
};
