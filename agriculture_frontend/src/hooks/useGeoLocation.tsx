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
        // ip-api.com က CORS rules ပိုလျော့ရဲပြီး limit ပိုကောင်းပါတယ်
        const res = await fetch("http://ip-api.com/json/");
        const data = await res.json();

        if (data.status === "success") {
          setState({
            coords: { lat: data.lat, lon: data.lon },
            error: null,
            loading: false,
          });
          console.log("Fallback Success (IP):", data.city);
        } else {
          throw new Error("IP Location failed");
        }
      } catch (e) {
        // တကယ်လို့ အားလုံးမရရင် Static Data (Yangon) ပြလိုက်ပါ (Demo အတွက် အန္တရာယ်ကင်းဆုံးပဲ)
        setState({
          coords: { lat: 16.8409, lon: 96.1735 },
          error: "Using Default Location (Yangon)",
          loading: false,
        });
      }
    };

    if (!isSupported) {
      fetchIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      (err) => {
        console.warn("Native Geo failed, trying IP fallback...");
        fetchIpLocation();
      },
      { timeout: 5000 },
    );
  }, [isSupported]);

  return state;
};
