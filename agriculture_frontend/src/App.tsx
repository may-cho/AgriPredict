import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { HomePage } from "./pages/HomePage";
import { CropPlanningPage } from "./pages/CropPlanningPage";
import { CostManagementPage } from "./pages/CostManagementPage";
import { HarvestAnalysisPage } from "./pages/HarvestAnalysisPage";
import { ClimateMonitorPage } from "./pages/ClimateMonitorPage";
import { AdvisoryPage } from "./pages/AdvisoryPage";
import type {
  CropData,
  CostData,
  HarvestData,
  Notification,
  WeatherData,
} from "./types";
import { useWeatherData } from "./hooks/useWeatherData";

export function App() {
  const [currentPage, setCurrentPage] = useState("home");
  // Shared State & Mock Data
  const [cropData, setCropData] = useState<CropData>({
    type: "",
    region: "",
    landSize: 0,
    soilType: "",
    amount: 0,
    predictedProfit: 0,
  });
  const [costs, setCosts] = useState<CostData>({
    seeds: 0,
    fertilizer: 0,
    irrigation: 0,
    labor: 0,
    machinery: 0,
    transport: 0,
    other: 0,
  });
  const [harvestData, setHarvestData] = useState<HarvestData>({
    actualYield: 0,
    actualPrice: 0,
    actualProfit: 0,
  });
  const mockWeatherData: WeatherData = {
    coord: {
      lon: 96.0891,
      lat: 21.9747,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04d",
      },
    ],
    base: "stations",
    main: {
      temp: 32,
      feels_like: 35,
      temp_min: 31,
      temp_max: 33,
      pressure: 1008,
      humidity: 78,
    },
    visibility: 10000,
    wind: {
      speed: 2.1,
      deg: 150,
    },
    rain: {
      "1h": 15,
    },
    clouds: {
      all: 75,
    },
    dt: 1711700000,
    sys: {
      country: "MM",
      sunrise: 1711668000,
      sunset: 1711712000,
    },
    timezone: 23400,
    id: 1311815,
    name: "Mandalay",
    cod: 200,
  };
  const { weatherData } = useWeatherData();
  const notifications: Notification[] = [
    {
      id: "1",
      type: "irrigation",
      message: "ရေသွင်းရန် လိုအပ်ပါသည်",
      daysUntil: 2,
      urgency: "high",
    },
    {
      id: "2",
      type: "pest",
      message: "ပိုးမွှားအန္တရာယ် စစ်ဆေးရန်",
      daysUntil: 5,
      urgency: "medium",
    },
    {
      id: "3",
      type: "fertilizer",
      message: "မြေသြဇာ ထည့်ရန်",
      daysUntil: 7,
      urgency: "low",
    },
  ];
  // Render active page
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            weatherData={weatherData ?? mockWeatherData}
            setCurrentPage={setCurrentPage}
          />
        );
      case "planning":
        return (
          <CropPlanningPage cropData={cropData} setCropData={setCropData} />
        );
      case "costs":
        return <CostManagementPage costs={costs} setCosts={setCosts} />;
      case "harvest":
        return (
          <HarvestAnalysisPage
            harvestData={harvestData}
            setHarvestData={setHarvestData}
          />
        );
      case "climate":
        return (
          <ClimateMonitorPage weatherData={weatherData ?? mockWeatherData} />
        );
      case "advisory":
        return <AdvisoryPage notifications={notifications} />;
      default:
        return (
          <HomePage
            weatherData={weatherData ?? mockWeatherData}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };
  return (
    <div className="flex h-screen bg-[#F0F7F4] font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <TopHeader
          currentPage={currentPage}
          notificationCount={notifications.length}
        />

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <div key={currentPage} className="max-w-7xl mx-auto">
              {renderPage()}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
