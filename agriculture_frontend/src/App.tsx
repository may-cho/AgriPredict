import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { HomePage } from "./pages/HomePage";
import { CropPlanningPage } from "./pages/CropPlanningPage";
import { CostManagementPage } from "./pages/CostManagementPage";
import { HarvestAnalysisPage } from "./pages/HarvestAnalysisPage";
import { ClimateMonitorPage } from "./pages/ClimateMonitorPage";
import { AdvisoryPage } from "./pages/AdvisoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import type {
  CropData,
  CostData,
  HarvestData,
  Notification,
  WeatherData,
} from "./types";
import { useWeatherData, useForecastData } from "./hooks/useWeatherHook";
import { useGeolocation } from "./hooks/useGeoLocation";

export function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const { coords, loading: geoLoading } = useGeolocation();
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { weatherData, loading: weatherLoading } = useWeatherData(coords);
  const {
    forecastData,
    loading: forecastLoading,
    dailyData,
  } = useForecastData(coords);
  
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

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('agri_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Check if session is still valid (e.g., not expired)
        const sessionAge = Date.now() - (user.loginTime || 0);
        const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (sessionAge < SESSION_DURATION) {
          setUserName(user.name);
          setUserPhone(user.phone || '');
          setIsLoggedIn(true);
          setShowRegister(false); // Ensure register page is hidden
        } else {
          localStorage.removeItem('agri_user');
        }
      } catch (e) {
        console.error('Error parsing saved user data');
        localStorage.removeItem('agri_user');
      }
    }
  }, []);

  const handleLogin = (name: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setUserName(name);
      setUserPhone('');
      setIsLoggedIn(true);
      setShowRegister(false); // Reset register page state
      setCurrentPage('home');
      setIsLoading(false);
      
      // Save session to localStorage
      localStorage.setItem('agri_user', JSON.stringify({
        name: name,
        phone: '',
        loginTime: Date.now()
      }));
    }, 500);
  };

  const handleRegister = (name: string, phone: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setUserName(name);
      setUserPhone(phone);
      setIsLoggedIn(true);
      setShowRegister(false); // IMPORTANT: Hide register page
      setCurrentPage('home'); // Set to home page
      setIsLoading(false);
      
      // Save session to localStorage
      localStorage.setItem('agri_user', JSON.stringify({
        name: name,
        phone: phone,
        loginTime: Date.now()
      }));
    }, 500);
  };

  const handleLogout = () => {
    setIsLoading(true);
    
    // Clear any saved user data
    localStorage.removeItem('agri_user');
    
    // Reset all app state
    setTimeout(() => {
      setIsLoggedIn(false);
      setUserName('');
      setUserPhone('');
      setCurrentPage('home');
      setShowRegister(false);
      
      // Optional: Reset form data
      setCropData({
        type: "",
        region: "",
        landSize: 0,
        soilType: "",
        amount: 0,
        predictedProfit: 0,
      });
      setCosts({
        seeds: 0,
        fertilizer: 0,
        irrigation: 0,
        labor: 0,
        machinery: 0,
        transport: 0,
        other: 0,
      });
      setHarvestData({
        actualYield: 0,
        actualPrice: 0,
        actualProfit: 0,
      });
      
      setIsLoading(false);
    }, 500);
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F7F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B4332] font-semibold">လုပ်ဆောင်နေပါသည်...</p>
        </div>
      </div>
    );
  }

  // Show login/register page if not logged in
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <RegisterPage 
          onRegister={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginPage 
        onLogin={handleLogin}
        onRegisterClick={() => setShowRegister(true)}
      />
    );
  }

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

      case "harvest":
        return (
          <HarvestAnalysisPage
            harvestData={harvestData}
            setHarvestData={setHarvestData}
          />
        );
      case "climate":
        return (
          <ClimateMonitorPage
            forecastData={forecastData}
            dailyData={dailyData || []}
          />
        );
      case "advisory":
        return <AdvisoryPage notifications={notifications} />;
      case "profile":
        return (
          <ProfilePage 
            userName={userName} 
            userPhone={userPhone}
            onLogout={handleLogout} 
          />
        );
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
      {/* Sidebar - only show when logged in */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        userName={userName} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <TopHeader
          currentPage={currentPage}
          notificationCount={notifications.length}
          userName={userName}
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