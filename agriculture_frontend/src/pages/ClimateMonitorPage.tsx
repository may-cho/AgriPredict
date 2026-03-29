import { motion } from "framer-motion";
import {
  CloudSunIcon,
  DropletsIcon,
  WindIcon,
  AlertTriangleIcon,
  CloudRainIcon,
  SunIcon,
  MapPinIcon,
} from "lucide-react";
import type { ForecastData, ForecastItem } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ClimateMonitorPageProps {
  forecastData: ForecastData | null;
  dailyData: ForecastItem[];
}

export function ClimateMonitorPage({
  forecastData,
  dailyData,
}: ClimateMonitorPageProps) {
  if (!forecastData || dailyData.length === 0) {
    return (
      <div className="p-10 text-center">ရာသီဥတုအချက်အလက်များ ရယူနေပါသည်...</div>
    );
  }

  // ၁။ Chart အတွက် Data ကို Format လုပ်ခြင်း
  const chartData = dailyData.map((item) => ({
    // dt (timestamp) ကို သုံးပြီး နေ့အမည်ထုတ်ယူခြင်း
    day: new Date(item.dt * 1000).toLocaleDateString("my-MM", {
      weekday: "long",
    }),
    temp: Math.round(item.main.temp),
    rain: Math.round(item.pop * 100), // pop (0 to 1) ကို percentage ပြောင်းခြင်း
  }));

  // ၂။ လက်ရှိ Weather (list ထဲက ပထမဆုံး item ကို ယူသုံးခြင်း)
  const current = dailyData[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Weather Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#4A90E2] to-[#2C3E50] rounded-3xl p-8 shadow-lg text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
            <CloudSunIcon className="w-64 h-64" />
          </div>

          <div className="relative z-10 flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full inline-flex mb-4 border border-white/30">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-bold">{forecastData.city.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CloudSunIcon className="w-10 h-10 text-yellow-300" />
                <span className="text-2xl font-medium">
                  {current.weather[0].description}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-8xl font-bold tracking-tighter">
                {Math.round(current.main.temp)}°
                <span className="text-5xl">C</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6 bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <DropletsIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-200" />
              </div>
              <div>
                <span className="text-white/70 text-xs md:text-sm block mb-1">
                  စိုထိုင်းဆ
                </span>
                <span className="font-bold text-xl md:text-2xl">
                  {current.main.humidity}%
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <CloudRainIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-200" />
              </div>
              <div>
                <span className="text-white/70 text-xs md:text-sm block mb-1">
                  မိုးရွာနိုင်ခြေ
                </span>
                <span className="font-bold text-xl md:text-2xl">
                  {Math.round(current.pop * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <WindIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-200" />
              </div>
              <div>
                <span className="text-white/70 text-xs md:text-sm block mb-1">
                  လေတိုက်နှုန်း
                </span>
                <span className="font-bold text-xl md:text-2xl">
                  {current.wind.speed} m/s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section (Static or Logic based) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-[#1B4332] mb-4 flex items-center">
            <AlertTriangleIcon className="w-5 h-5 mr-2 text-[#E76F51]" />{" "}
            ရာသီဥတု သတိပေးချက်
          </h3>
          <div className="space-y-4">
            {current.main.temp > 35 && (
              <div className="bg-[#FFF3E0] border-l-4 border-[#E76F51] p-4 rounded-r-xl">
                <h4 className="text-[#E76F51] font-bold text-sm">
                  အပူရှိန်ပြင်းထန်မှု
                </h4>
                <p className="text-xs text-[#8B6914]">
                  အပင်များ ရေငွေ့ပြန်နှုန်း များနိုင်သဖြင့်
                  ရေပုံမှန်လောင်းပေးပါ။
                </p>
              </div>
            )}
            <div className="bg-[#E8F3EE] border-l-4 border-[#52B788] p-4 rounded-r-xl">
              <h4 className="text-[#2D6A4F] font-bold text-sm">
                စိုက်ပျိုးရေး အကြံပြုချက်
              </h4>
              <p className="text-xs text-[#2D6A4F]">
                ယနေ့သည် ဓါတ်မြေဩဇာ ကျွေးရန် သင့်တော်သော ရာသီဥတု ရှိပါသည်။
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Day Forecast Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1B4332] mb-6">
          ၅ ရက်စာ ခန့်မှန်းချက်
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {chartData.map((data, idx) => (
            <div
              key={idx}
              className="bg-[#F0F7F4] rounded-2xl p-4 flex flex-col items-center border border-transparent hover:border-[#52B788]/30 transition-all"
            >
              <span className="text-xs font-bold text-[#6B7280] mb-3 uppercase">
                {data.day}
              </span>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                {data.rain > 50 ? (
                  <CloudRainIcon className="w-6 h-6 text-[#4A90E2]" />
                ) : data.rain > 10 ? (
                  <CloudSunIcon className="w-6 h-6 text-gray-400" />
                ) : (
                  <SunIcon className="w-6 h-6 text-yellow-500" />
                )}
              </div>
              <span className="text-2xl font-bold text-[#1B4332]">
                {data.temp}°
              </span>
              <span className="text-[10px] text-[#4A90E2] font-medium mt-1 uppercase">
                {data.rain}% Rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1B4332] mb-6">
          အပူချိန် အပြောင်းအလဲ (၅ ရက်)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4B5563", fontSize: 12 }}
              />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} hide />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                formatter={(value: any) => [`${value}°C`, "အပူချိန်"]}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#E76F51"
                strokeWidth={4}
                dot={{ r: 4, fill: "#E76F51" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
