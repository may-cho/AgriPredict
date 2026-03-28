import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SproutIcon,
  MapPinIcon,
  MaximizeIcon,
  LayersIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  BarChart3Icon,
} from 'lucide-react'
import type { CropData } from '../types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'
interface CropPlanningPageProps {
  cropData: CropData
  setCropData: (data: CropData) => void
}
export function CropPlanningPage({
  cropData,
  setCropData,
}: CropPlanningPageProps) {
  const [localData, setLocalData] = useState<CropData>(cropData)
  const [showPrediction, setShowPrediction] = useState(false)
  const handlePredict = () => {
    // Mock prediction logic
    const baseProfit = localData.landSize * 150000
    const predictedProfit = baseProfit + Math.random() * 50000
    const newData = {
      ...localData,
      predictedProfit,
    }
    setLocalData(newData)
    setCropData(newData)
    setShowPrediction(true)
  }
  const chartData = [
    {
      name: 'စပါး',
      profit: 850000,
    },
    {
      name: 'ပဲ',
      profit: 620000,
    },
    {
      name: 'ပြောင်း',
      profit: 750000,
    },
    {
      name: 'ကြက်သွန်',
      profit: 950000,
    },
    {
      name: 'ခရမ်းချဉ်',
      profit: 550000,
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#1B4332] flex items-center">
              <SproutIcon className="w-6 h-6 mr-2 text-[#2D6A4F]" />
              သီးနှံအချက်အလက်များ ဖြည့်သွင်းပါ
            </h2>
            <p className="text-[#6B7280] text-sm mt-1">
              အမြတ်ငွေ ခန့်မှန်းရန်အတွက် အောက်ပါအချက်အလက်များကို ပြည့်စုံစွာ
              ဖြည့်စွက်ပါ။
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crop Type */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2">
                <SproutIcon className="w-5 h-5 mr-2 text-[#52B788]" />{' '}
                သီးနှံအမျိုးအစား
              </label>
              <select
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                value={localData.type}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    type: e.target.value,
                  })
                }
              >
                <option value="">ရွေးချယ်ပါ</option>
                <option value="rice">ဆန်စပါး</option>
                <option value="beans">မြေပဲ</option>
                <option value="corn">ပြောင်း</option>
                <option value="tomato">နေကြာ</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2">
                <MapPinIcon className="w-5 h-5 mr-2 text-[#52B788]" />{' '}
                တိုင်းဒေသကြီး
              </label>
              <select
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                value={localData.region}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    region: e.target.value,
                  })
                }
              >
                <option value="">ရွေးချယ်ပါ</option>
                <option value="ayeyarwady">ဧရာဝတီ</option>
                <option value="mandalay">မန္တလေး</option>
                <option value="sagaing">မကွေး</option>
                <option value="sagaing">စစ်ကိုင်း</option>
                <option value="bago">ရှမ်း</option>
              </select>
            </div>

            {/* Land Size */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2">
                <MaximizeIcon className="w-5 h-5 mr-2 text-[#52B788]" />{' '}
                မြေအကျယ်အဝန်း (ဧက)
              </label>
              <input
                type="number"
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                placeholder="ဥပမာ - ၅"
                value={localData.landSize || ''}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    landSize: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Soil Type */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2">
                <LayersIcon className="w-5 h-5 mr-2 text-[#8B6914]" />{' '}
                မြေအမျိုးအစား
              </label>
              <select
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                value={localData.soilType}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    soilType: e.target.value,
                  })
                }
              >
                <option value="">ရွေးချယ်ပါ</option>
                <option value="alluvial">နုန်း</option>
                <option value="sandy">သဲနုန်း</option>
                <option value="clay">မြေနီ</option>
                <option value="clay">သဲ</option>
                <option value="loam">နုန်းရွှံ့</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handlePredict}
              disabled={!localData.type || !localData.landSize}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <BarChart3Icon className="w-5 h-5 mr-2" /> အမြတ်ငွေ ခန့်မှန်းရန်
            </button>
          </div>
        </div>

        {/* Right Column: Prediction Results */}
        <div className="lg:col-span-1">
          {!showPrediction ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center text-[#6B7280]">
              <div className="w-20 h-20 bg-[#F0F7F4] rounded-full flex items-center justify-center mb-4">
                <TrendingUpIcon className="w-10 h-10 text-[#52B788] opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-[#1B4332] mb-2">
                ရလဒ်များ ဤနေရာတွင် ပြသမည်
              </h3>
              <p className="text-sm">
                အမြတ်ငွေ ခန့်မှန်းရန် ဘယ်ဘက်ရှိ အချက်အလက်များကို ဖြည့်သွင်းပြီး
                ခလုတ်ကို နှိပ်ပါ။
              </p>
            </div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="space-y-6 h-full"
            >
              {/* Prediction Result Card */}
              <div className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] rounded-2xl p-8 shadow-lg text-white relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 opacity-10">
                  <TrendingUpIcon className="w-48 h-48 -mt-8 -mr-8" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-xl font-medium opacity-90 mb-2">
                    ခန့်မှန်း အမြတ်ငွေ (ကျပ်)
                  </h2>
                  <div className="text-5xl font-bold mb-6">
                    {Math.round(localData.predictedProfit).toLocaleString()}{' '}
                    <span className="text-2xl font-normal">ကျပ်</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-8 border-t border-white/20 pt-6">
                    <div>
                      <p className="text-sm opacity-80 mb-1">
                        ခန့်မှန်း အထွက်နှုန်း
                      </p>
                      <p className="font-bold text-2xl">
                        {localData.landSize * 70} တင်း
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80 mb-1">ဈေးကွက် အခြေအနေ</p>
                      <p className="font-bold text-xl flex items-center text-[#52B788] bg-white/10 px-3 py-1 rounded-lg inline-flex">
                        <TrendingUpIcon className="w-5 h-5 mr-2" /> ကောင်းမွန်
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold flex items-center">
                        <CheckCircle2Icon className="w-4 h-4 mr-2 text-[#52B788]" />{' '}
                        AI တိကျမှု
                      </span>
                      <span className="font-bold text-[#52B788]">၈၅%</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2">
                      <div
                        className="bg-[#52B788] h-2 rounded-full"
                        style={{
                          width: '85%',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Row: Comparison Chart */}
      {showPrediction && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#1B4332]">
              အခြားသီးနှံများနှင့် အမြတ်ငွေ နှိုင်းယှဉ်ချက် (ကျပ် သိန်း)
            </h3>
            <p className="text-sm text-[#6B7280]">
              ဈေးကွက်ပေါက်ဈေးနှင့် အထွက်နှုန်းကို အခြေခံ၍ တွက်ချက်ထားပါသည်။
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#4B5563',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(val) => `${val / 100000}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#6B7280',
                    fontSize: 14,
                  }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{
                    fill: '#F0F7F4',
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any) => [
                    `${value.toLocaleString()} ကျပ်`,
                    'အမြတ်ငွေ',
                  ]}
                />
                <Bar dataKey="profit" radius={[6, 6, 0, 0]} barSize={60}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#2D6A4F' : '#A7F3D0'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
