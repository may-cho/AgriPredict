import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  WheatIcon,
  CoinsIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AwardIcon,
  AlertCircleIcon,
  BarChartIcon,
} from 'lucide-react'
import type { HarvestData } from '../types'
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
interface HarvestAnalysisPageProps {
  harvestData: HarvestData
  setHarvestData: (data: HarvestData) => void
}
export function HarvestAnalysisPage({
  harvestData,
  setHarvestData,
}: HarvestAnalysisPageProps) {
  const [localData, setLocalData] = useState<HarvestData>(harvestData)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const predictedProfit = 850000 // Mock predicted
  const actualProfit = localData.actualYield * localData.actualPrice - 500000 // Mock calculation
  const chartData = [
    {
      name: 'ခန့်မှန်းချက်',
      profit: predictedProfit,
    },
    {
      name: 'အမှန်တကယ် ရရှိမှု',
      profit: actualProfit,
    },
  ]
  const handleAnalyze = () => {
    setHarvestData({
      ...localData,
      actualProfit,
    })
    setShowAnalysis(true)
  }
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
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#1B4332] flex items-center">
                <WheatIcon className="w-6 h-6 mr-2 text-[#8B6914]" />
                ရိတ်သိမ်းပြီး အချက်အလက်များ
              </h2>
              <p className="text-[#6B7280] text-sm mt-1">
                အမှန်တကယ် ထွက်ရှိမှုနှင့် ရောင်းရငွေကို ထည့်ပါ။
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2">
                  <WheatIcon className="w-5 h-5 mr-2 text-[#8B6914]" />{' '}
                  အမှန်တကယ် ထွက်ရှိမှု (တင်း)
                </label>
                <input
                  type="number"
                  className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                  placeholder="ဥပမာ - ၃၅၀"
                  value={localData.actualYield || ''}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      actualYield: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2">
                  <CoinsIcon className="w-5 h-5 mr-2 text-[#8B6914]" />{' '}
                  ရောင်းရသည့် ဈေးနှုန်း (၁ တင်းလျှင်)
                </label>
                <input
                  type="number"
                  className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                  placeholder="ဥပမာ - ၁၈၀၀၀"
                  value={localData.actualPrice || ''}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      actualPrice: Number(e.target.value),
                    })
                  }
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!localData.actualYield || !localData.actualPrice}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-lg p-4 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <BarChartIcon className="w-5 h-5 mr-2" /> ရလဒ် ကြည့်ရှုရန်
              </button>
            </div>
          </div>

          {/* Efficiency Scores (Moved to left column when results show) */}
          {showAnalysis && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-[#52B788] flex items-center justify-center mb-3 bg-[#F0F7F4]">
                  <span className="text-3xl font-bold text-[#1B4332]">A-</span>
                </div>
                <span className="text-sm font-bold text-[#1B4332]">
                  ကုန်ကျစရိတ် စီမံမှု
                </span>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-[#E76F51] flex items-center justify-center mb-3 bg-[#FFF3E0]">
                  <span className="text-3xl font-bold text-[#1B4332]">B</span>
                </div>
                <span className="text-sm font-bold text-[#1B4332]">
                  အထွက်နှုန်း
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="lg:col-span-2">
          {!showAnalysis ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center text-[#6B7280]">
              <div className="w-24 h-24 bg-[#F0F7F4] rounded-full flex items-center justify-center mb-6">
                <AwardIcon className="w-12 h-12 text-[#2D6A4F] opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-[#1B4332] mb-2">
                ခွဲခြမ်းစိတ်ဖြာမှု ရလဒ်များ
              </h3>
              <p className="text-base">
                ရိတ်သိမ်းပြီး အချက်အလက်များကို ဖြည့်သွင်း၍ ရလဒ်များကို
                ကြည့်ရှုပါ။
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
              className="space-y-6 h-full flex flex-col"
            >
              {/* Result Header */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full bg-[#E8F3EE] flex items-center justify-center mr-6">
                    <AwardIcon className="w-10 h-10 text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-[#6B7280] text-lg mb-1">
                      အမှန်တကယ် ရရှိသောအမြတ်
                    </p>
                    <h2 className="text-4xl font-bold text-[#1B4332]">
                      {actualProfit.toLocaleString()}{' '}
                      <span className="text-xl">ကျပ်</span>
                    </h2>
                  </div>
                </div>

                <div
                  className={`px-6 py-4 rounded-xl flex items-center ${actualProfit >= predictedProfit ? 'bg-[#E8F3EE] text-[#2D6A4F]' : 'bg-[#FFF3E0] text-[#E76F51]'}`}
                >
                  {actualProfit >= predictedProfit ? (
                    <>
                      <TrendingUpIcon className="w-8 h-8 mr-3" />
                      <div>
                        <span className="block font-bold text-lg">
                          ပိုမိုကောင်းမွန်သည်
                        </span>
                        <span className="text-sm opacity-80">
                          ခန့်မှန်းချက်ထက် ပိုရသည်
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <TrendingDownIcon className="w-8 h-8 mr-3" />
                      <div>
                        <span className="block font-bold text-lg">
                          လျော့နည်းနေသည်
                        </span>
                        <span className="text-sm opacity-80">
                          ခန့်မှန်းချက်အောက် ရောက်နေသည်
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[#1B4332] mb-6">
                  ခန့်မှန်းချက်နှင့် အမှန်တကယ် ရရှိမှု နှိုင်းယှဉ်ချက် (ကျပ်
                  သိန်း)
                </h3>
                <div className="flex-1 min-h-[300px] w-full">
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
                        formatter={(value: any) => [
                          `${value.toLocaleString()} ကျပ်`,
                          'အမြတ်ငွေ',
                        ]}
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Bar dataKey="profit" radius={[8, 8, 0, 0]} barSize={80}>
                        {chartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? '#A7F3D0' : '#2D6A4F'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-[#FFF3E0] rounded-2xl p-6 shadow-sm border border-[#FFE0B2] flex items-start">
                <AlertCircleIcon className="w-8 h-8 text-[#E76F51] mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#E76F51] mb-2">
                    နောက်ရာသီအတွက် အကြံပြုချက်
                  </h3>
                  <p className="text-base text-[#8B6914] leading-relaxed">
                    အထွက်နှုန်းမှာ မျှော်မှန်းထားသည်ထက် အနည်းငယ် လျော့နည်းပါသည်။
                    နောက်ရာသီတွင် မြေသြဇာကျွေးသည့် အချိန်ဇယားကို ပိုမိုတိကျစွာ
                    လိုက်နာရန်နှင့် ပိုးမွှားအန္တရာယ်ကို ကြိုတင်ကာကွယ်ရန်
                    အကြံပြုအပ်ပါသည်။
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
