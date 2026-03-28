import { motion } from 'framer-motion'
import {
  CloudSunIcon,
  DropletsIcon,
  WindIcon,
  AlertTriangleIcon,
  CloudRainIcon,
  SunIcon,
  MapPinIcon,
} from 'lucide-react'
import type { WeatherData } from '../types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
interface ClimateMonitorPageProps {
  weatherData: WeatherData
}
export function ClimateMonitorPage({ weatherData }: ClimateMonitorPageProps) {
  const forecastData = [
    {
      day: 'တနင်္လာ',
      temp: 32,
      rain: 10,
    },
    {
      day: 'အင်္ဂါ',
      temp: 33,
      rain: 5,
    },
    {
      day: 'ဗုဒ္ဓဟူး',
      temp: 30,
      rain: 40,
    },
    {
      day: 'ကြာသပတေး',
      temp: 29,
      rain: 60,
    },
    {
      day: 'သောကြာ',
      temp: 31,
      rain: 20,
    },
    {
      day: 'စနေ',
      temp: 34,
      rain: 0,
    },
    {
      day: 'တနင်္ဂနွေ',
      temp: 35,
      rain: 0,
    },
  ]
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
      {/* Top Row: Current Weather & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Weather Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#4A90E2] to-[#2C3E50] rounded-3xl p-8 shadow-lg text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
            <CloudSunIcon className="w-64 h-64" />
          </div>

          <div className="relative z-10 flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full inline-flex mb-4">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-bold">{weatherData.location} ဒေသ</span>
              </div>
              <div className="flex items-center space-x-3">
                <CloudSunIcon className="w-10 h-10 text-yellow-300" />
                <span className="text-2xl font-medium">
                  တိမ်အသင့်အတင့် ဖြစ်ထွန်းမည်
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-8xl font-bold tracking-tighter">
                {weatherData.temp}°<span className="text-5xl">C</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6 bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <DropletsIcon className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <span className="text-white/70 text-sm block mb-1">
                  စိုထိုင်းဆ
                </span>
                <span className="font-bold text-2xl">
                  {weatherData.humidity}%
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <CloudRainIcon className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <span className="text-white/70 text-sm block mb-1">
                  မိုးရေချိန်
                </span>
                <span className="font-bold text-2xl">
                  {weatherData.rainfall}mm
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <WindIcon className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <span className="text-white/70 text-sm block mb-1">
                  လေတိုက်နှုန်း
                </span>
                <span className="font-bold text-2xl">12 km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-[#1B4332] mb-4 flex items-center">
            <AlertTriangleIcon className="w-5 h-5 mr-2 text-[#E76F51]" />{' '}
            ရာသီဥတု သတိပေးချက်များ
          </h3>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            <div className="bg-[#FFF3E0] border-l-4 border-[#E76F51] p-4 rounded-r-xl shadow-sm">
              <div className="flex items-center mb-2">
                <AlertTriangleIcon className="w-5 h-5 text-[#E76F51] mr-2" />
                <h4 className="text-[#E76F51] font-bold">မိုးသည်းထန်ရန်ရှိ</h4>
              </div>
              <p className="text-sm text-[#8B6914] leading-relaxed">
                ဗုဒ္ဓဟူးနေ့နှင့် ကြာသပတေးနေ့များတွင် မိုးသည်းထန်စွာ
                ရွာသွန်းနိုင်ပါသည်။ ရေနုတ်မြောင်းများ ရှင်းလင်းထားပါ။
              </p>
            </div>

            <div className="bg-[#E8F3EE] border-l-4 border-[#52B788] p-4 rounded-r-xl shadow-sm">
              <div className="flex items-center mb-2">
                <SunIcon className="w-5 h-5 text-[#52B788] mr-2" />
                <h4 className="text-[#2D6A4F] font-bold">
                  စိုက်ပျိုးရန် အချိန်ကောင်း
                </h4>
              </div>
              <p className="text-sm text-[#2D6A4F] leading-relaxed">
                ယခုရက်သတ္တပတ်သည် မြေပြင်ညှိရန်နှင့် မျိုးစေ့ချရန်
                အလွန်သင့်တော်ပါသည်။
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: 7 Day Forecast Cards */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1B4332] mb-6">
          ၇ ရက်စာ ခန့်မှန်းချက်
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecastData.map((day, idx) => (
            <div
              key={idx}
              className="bg-[#F0F7F4] rounded-2xl p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow border border-transparent hover:border-[#52B788]/30"
            >
              <span className="text-sm font-bold text-[#6B7280] mb-3">
                {day.day}
              </span>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                {day.rain > 30 ? (
                  <CloudRainIcon className="w-6 h-6 text-[#4A90E2]" />
                ) : day.rain > 0 ? (
                  <CloudSunIcon className="w-6 h-6 text-gray-500" />
                ) : (
                  <SunIcon className="w-6 h-6 text-yellow-500" />
                )}
              </div>
              <span className="text-2xl font-bold text-[#1B4332] mb-1">
                {day.temp}°
              </span>
              <span className="text-xs text-[#4A90E2] font-medium">
                {day.rain}% မိုးရွာနိုင်
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Temperature Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1B4332] mb-6">
          အပူချိန် အပြောင်းအလဲ
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#4B5563',
                  fontSize: 14,
                }}
                dy={10}
              />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#6B7280',
                  fontSize: 14,
                }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
                formatter={(value: any) => [`${value}°C`, 'အပူချိန်']}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#E76F51"
                strokeWidth={4}
                dot={{
                  r: 6,
                  fill: '#E76F51',
                  strokeWidth: 2,
                  stroke: '#fff',
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
