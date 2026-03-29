import { motion } from "framer-motion";
import {
  CloudSunIcon,
  DropletsIcon,
  SproutIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  CircleDollarSignIcon,
  WheatIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
} from "lucide-react";
import type { WeatherData } from "../types";
interface HomePageProps {
  weatherData: WeatherData;
  setCurrentPage: (page: string) => void;
}
type CloudLevel = {
  label: string;
  icon: string;
  color: string;
};

const CLOUD_SCALE: Record<string, CloudLevel> = {
  clear: {
    label: "ကောင်းကင်ပြာ",
    icon: "☀️",
    color: "text-yellow-500",
  },
  few: {
    label: "တိမ်အနည်းငယ်",
    icon: "🌤️",
    color: "text-blue-400",
  },
  partly: {
    label: "တိမ်အသင့်အတင့်",
    icon: "⛅",
    color: "text-gray-400",
  },
  overcast: {
    label: "တိမ်ထူထပ်",
    icon: "☁️",
    color: "text-gray-600",
  },
};

const getCloudDetails = (all: number): CloudLevel => {
  if (all === 0) return CLOUD_SCALE.clear;
  if (all <= 30) return CLOUD_SCALE.few;
  if (all <= 70) return CLOUD_SCALE.partly;
  return CLOUD_SCALE.overcast;
};

export function HomePage({ weatherData, setCurrentPage }: HomePageProps) {
  const cloudInfo = getCloudDetails(weatherData.clouds.all);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      className="space-y-6"
    >
      {/* Top Row: Greeting & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Greeting Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] rounded-2xl p-8 shadow-md text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <SproutIcon className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">မင်္ဂလာပါ တောင်သူကြီး</h1>
            <p className="text-white/80 text-lg">
              ယနေ့အတွက် သင့်စိုက်ခင်း အခြေအနေများကို ကြည့်ရှုနိုင်ပါသည်။
            </p>
            <button
              onClick={() => setCurrentPage("planning")}
              className="mt-6 bg-white text-[#2D6A4F] px-6 py-3 rounded-xl font-bold flex items-center hover:bg-[#F0F7F4] transition-colors"
            >
              <SproutIcon className="w-5 h-5 mr-2" /> သီးနှံအသစ် စီစဉ်ရန်
            </button>
          </div>
        </div>

        {/* Weather Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#1B4332]">
              ရာသီဥတု ({weatherData.name})
            </h2>
            <button
              onClick={() => setCurrentPage("climate")}
              className="text-[#52B788] text-sm font-bold flex items-center hover:underline"
            >
              အပြည့်အစုံ <ArrowRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CloudSunIcon className="w-12 h-12 text-[#4A90E2] mr-4" />
              <span className="text-4xl font-bold text-[#1B4332]">
                {weatherData.main.temp}°C
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6B7280]">{cloudInfo.label}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div className="flex items-center">
              <DropletsIcon className="w-5 h-5 text-[#52B788] mr-2" />
              <div>
                <p className="text-xs text-[#6B7280]">စိုထိုင်းဆ</p>
                <p className="font-bold text-[#1B4332]">
                  {weatherData.main.humidity}%
                </p>
              </div>
            </div>
            {weatherData.rain && (
              <div className="flex items-center">
                <CloudSunIcon className="w-5 h-5 text-[#4A90E2] mr-2" />
                <div>
                  <p className="text-xs text-[#6B7280]">မိုးရေချိန်</p>
                  <p className="font-bold text-[#1B4332]">
                    {weatherData.rain?.["1h"]}mm
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-[#E8F3EE] flex items-center justify-center mr-4">
            <SproutIcon className="w-7 h-7 text-[#2D6A4F]" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">စုစုပေါင်း စိုက်ခင်း</p>
            <p className="text-2xl font-bold text-[#1B4332]">၃ ဧက</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-[#FFF3E0] flex items-center justify-center mr-4">
            <TrendingUpIcon className="w-7 h-7 text-[#E76F51]" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">ခန့်မှန်း အမြတ်ငွေ</p>
            <p className="text-2xl font-bold text-[#1B4332]">၈.၅ သိန်း</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-[#E3F2FD] flex items-center justify-center mr-4">
            <CalendarDaysIcon className="w-7 h-7 text-[#4A90E2]" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">ရိတ်သိမ်းရန် ကျန်ရက်</p>
            <p className="text-2xl font-bold text-[#1B4332]">၄၅ ရက်</p>
          </div>
        </div>
      </div>

      {/* Third Row: Active Crops & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Crops */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#1B4332]">
              လက်ရှိ စိုက်ခင်းများ
            </h2>
            <button className="text-[#52B788] text-sm font-bold hover:underline">
              အားလုံးကြည့်ရန်
            </button>
          </div>

          <div className="space-y-4">
            {/* Crop Item 1 */}
            <div className="border border-[#E8F3EE] rounded-xl p-5 relative overflow-hidden flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#52B788]"></div>
              <div className="flex items-center ml-2">
                <div className="w-12 h-12 bg-[#F0F7F4] rounded-full flex items-center justify-center mr-4">
                  <WheatIcon className="w-6 h-6 text-[#2D6A4F]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B4332]">
                    စပါး (ဆင်းသုခ)
                  </h3>
                  <p className="text-sm text-[#6B7280]">၅ ဧက • မန္တလေး</p>
                </div>
              </div>
              <div className="flex-1 max-w-xs mx-8">
                <div className="flex justify-between text-sm text-[#6B7280] mb-1">
                  <span>စိုက်ပျိုးသက်တမ်း</span>
                  <span>ရက် ၉၀ / ၁၂၀</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#52B788] h-2.5 rounded-full"
                    style={{
                      width: "75%",
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-[#E8F3EE] text-[#2D6A4F] px-4 py-2 rounded-full text-sm font-bold">
                ကျန်းမာ
              </div>
            </div>

            {/* Crop Item 2 */}
            <div className="border border-[#FFF3E0] rounded-xl p-5 relative overflow-hidden flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#E76F51]"></div>
              <div className="flex items-center ml-2">
                <div className="w-12 h-12 bg-[#FFF3E0] rounded-full flex items-center justify-center mr-4">
                  <SproutIcon className="w-6 h-6 text-[#E76F51]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B4332]">
                    ပဲတီစိမ်း
                  </h3>
                  <p className="text-sm text-[#6B7280]">၂ ဧက • မန္တလေး</p>
                </div>
              </div>
              <div className="flex-1 max-w-xs mx-8">
                <div className="flex justify-between text-sm text-[#6B7280] mb-1">
                  <span>စိုက်ပျိုးသက်တမ်း</span>
                  <span>ရက် ၃၀ / ၆၀</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#E76F51] h-2.5 rounded-full"
                    style={{
                      width: "50%",
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-[#FFF3E0] text-[#E76F51] px-4 py-2 rounded-full text-sm font-bold">
                ရေလိုသည်
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#1B4332]">သတိပေးချက်များ</h2>
            <span className="bg-[#E63946] text-white text-xs font-bold px-2 py-1 rounded-full">
              ၂ ခု
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-[#FFF3E0] border-l-4 border-[#E76F51] p-4 rounded-r-xl shadow-sm flex items-start space-x-3">
              <AlertTriangleIcon className="w-6 h-6 text-[#E76F51] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[#E76F51] font-bold">မိုးရွာရန်ရှိသည်</h3>
                <p className="text-sm text-[#8B6914] mt-1">
                  နောက် ၂ ရက်အတွင်း မိုးရွာရန်ရှိပါသည်။ ရိတ်သိမ်းရန် ပြင်ဆင်ပါ။
                </p>
              </div>
            </div>

            <div className="bg-[#E8F3EE] border-l-4 border-[#2D6A4F] p-4 rounded-r-xl shadow-sm flex items-start space-x-3">
              <SproutIcon className="w-6 h-6 text-[#2D6A4F] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[#2D6A4F] font-bold">မြေသြဇာကျွေးရန်</h3>
                <p className="text-sm text-[#1B4332] mt-1">
                  စပါးခင်းအတွက် မြေသြဇာကျွေးရန် အချိန်ကျရောက်နေပါပြီ။
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => setCurrentPage("planning")}
          className="bg-white border border-gray-200 hover:border-[#2D6A4F] hover:shadow-md text-[#1B4332] p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all group"
        >
          <div className="w-12 h-12 bg-[#F0F7F4] group-hover:bg-[#2D6A4F] rounded-full flex items-center justify-center transition-colors">
            <SproutIcon className="w-6 h-6 text-[#2D6A4F] group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold">သီးနှံအသစ် စီစဉ်ရန်</span>
        </button>

        <button
          onClick={() => setCurrentPage("costs")}
          className="bg-white border border-gray-200 hover:border-[#2D6A4F] hover:shadow-md text-[#1B4332] p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all group"
        >
          <div className="w-12 h-12 bg-[#F0F7F4] group-hover:bg-[#2D6A4F] rounded-full flex items-center justify-center transition-colors">
            <CircleDollarSignIcon className="w-6 h-6 text-[#2D6A4F] group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold">အမြတ် တွက်ချက်ရန်</span>
        </button>

        <button
          onClick={() => setCurrentPage("harvest")}
          className="bg-white border border-gray-200 hover:border-[#2D6A4F] hover:shadow-md text-[#1B4332] p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all group"
        >
          <div className="w-12 h-12 bg-[#F0F7F4] group-hover:bg-[#2D6A4F] rounded-full flex items-center justify-center transition-colors">
            <WheatIcon className="w-6 h-6 text-[#2D6A4F] group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold">ရိတ်သိမ်းမှု မှတ်တမ်း</span>
        </button>

        <button
          onClick={() => setCurrentPage("advisory")}
          className="bg-white border border-gray-200 hover:border-[#2D6A4F] hover:shadow-md text-[#1B4332] p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all group"
        >
          <div className="w-12 h-12 bg-[#F0F7F4] group-hover:bg-[#2D6A4F] rounded-full flex items-center justify-center transition-colors">
            <AlertTriangleIcon className="w-6 h-6 text-[#2D6A4F] group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold">အကြံပြုချက်များ ကြည့်ရန်</span>
        </button>
      </div>
    </motion.div>
  );
}
