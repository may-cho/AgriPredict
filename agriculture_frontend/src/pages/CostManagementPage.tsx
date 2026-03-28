import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SproutIcon,
  FlaskConicalIcon,
  DropletsIcon,
  UsersIcon,
  TractorIcon,
  TruckIcon,
  PackageIcon,
  CalculatorIcon,
  LightbulbIcon,
  PieChartIcon,
} from 'lucide-react'
import type { CostData } from '../types'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'
interface CostManagementPageProps {
  costs: CostData
  setCosts: (costs: CostData) => void
}
export function CostManagementPage({
  costs,
  setCosts,
}: CostManagementPageProps) {
  const [localCosts, setLocalCosts] = useState<CostData>(costs)
  const [showResults, setShowResults] = useState(false)
  const handleInputChange = (field: keyof CostData, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10)
    setLocalCosts({
      ...localCosts,
      [field]: numValue,
    })
  }
  const totalCost = Object.values(localCosts).reduce(
    (acc, curr) => acc + curr,
    0,
  )
  const estimatedRevenue = 2500000 // Mock revenue
  const netProfit = estimatedRevenue - totalCost
  const profitMargin = Math.round((netProfit / estimatedRevenue) * 100)
  const costInputs = [
    {
      id: 'seeds',
      label: 'မျိုးစေ့/ပျိုးပင်',
      icon: SproutIcon,
      color: '#52B788',
    },
    {
      id: 'fertilizer',
      label: 'မြေသြဇာ/ပိုးသတ်ဆေး',
      icon: FlaskConicalIcon,
      color: '#E76F51',
    },
    {
      id: 'irrigation',
      label: 'ရေသွင်းရေထုတ်',
      icon: DropletsIcon,
      color: '#4A90E2',
    },
    {
      id: 'labor',
      label: 'လုပ်သားစရိတ်',
      icon: UsersIcon,
      color: '#8B6914',
    },
    {
      id: 'machinery',
      label: 'စက်ယန္တရား',
      icon: TractorIcon,
      color: '#6B7280',
    },
    {
      id: 'transport',
      label: 'သယ်ယူပို့ဆောင်ရေး',
      icon: TruckIcon,
      color: '#1B4332',
    },
    {
      id: 'other',
      label: 'အခြားစရိတ်',
      icon: PackageIcon,
      color: '#9CA3AF',
    },
  ]
  const pieData = costInputs
    .map((item) => ({
      name: item.label,
      value: localCosts[item.id as keyof CostData],
      color: item.color,
    }))
    .filter((item) => item.value > 0)
  const handleCalculate = () => {
    setCosts(localCosts)
    setShowResults(true)
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
        {/* Left Column: Cost Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#1B4332] flex items-center">
                  <CalculatorIcon className="w-6 h-6 mr-2 text-[#2D6A4F]" />
                  စိုက်ပျိုးစရိတ်များ ထည့်သွင်းပါ
                </h2>
                <p className="text-[#6B7280] text-sm mt-1">
                  ကုန်ကျစရိတ်များကို ကျပ်ငွေဖြင့် ထည့်သွင်းပါ။
                </p>
              </div>
              <div className="bg-[#E8F3EE] px-4 py-2 rounded-xl">
                <span className="text-sm text-[#6B7280] mr-2">စုစုပေါင်း:</span>
                <span className="font-bold text-[#2D6A4F] text-xl">
                  {totalCost.toLocaleString()} ကျပ်
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {costInputs.map((input) => {
                const Icon = input.icon
                return (
                  <div
                    key={input.id}
                    className="bg-[#F0F7F4] rounded-xl p-4 flex items-center space-x-4 border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                      <Icon
                        className="w-6 h-6"
                        style={{
                          color: input.color,
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-[#1B4332] mb-1">
                        {input.label}
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-lg font-bold focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                        placeholder="၀"
                        value={localCosts[input.id as keyof CostData] || ''}
                        onChange={(e) =>
                          handleInputChange(
                            input.id as keyof CostData,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCalculate}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-md transition-colors flex items-center"
              >
                <PieChartIcon className="w-5 h-5 mr-2" /> အမြတ် တွက်ချက်ရန်
              </button>
            </div>
          </div>

          {/* AI Suggestions (Full Width of Left Column) */}
          {showResults && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-[#FFF8E1] rounded-2xl p-6 shadow-sm border border-[#FFE082]"
            >
              <h3 className="text-lg font-bold text-[#8B6914] flex items-center mb-4">
                <LightbulbIcon className="w-6 h-6 mr-2" /> ကုန်ကျစရိတ်
                လျှော့ချရန် အကြံပြုချက်များ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded-xl">
                  <h4 className="font-bold text-[#8B6914] mb-2">
                    မြေသြဇာ သုံးစွဲမှု
                  </h4>
                  <p className="text-sm text-[#8B6914]">
                    မြေသြဇာစရိတ် များနေပါသည်။ ဓာတုမြေသြဇာအစား သဘာဝမြေသြဇာကို
                    အချိုးကျ ရောစပ်သုံးစွဲခြင်းဖြင့် ကုန်ကျစရိတ်ကို ၂၀% အထိ
                    လျှော့ချနိုင်ပါသည်။
                  </p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl">
                  <h4 className="font-bold text-[#8B6914] mb-2">ရေသွင်းစနစ်</h4>
                  <p className="text-sm text-[#8B6914]">
                    ရေသွင်းစရိတ် သက်သာစေရန် မိုးလေဝသ သတင်းကို
                    ကြိုတင်ကြည့်ရှုပြီး မိုးရွာမည့်ရက်များတွင် ရေသွင်းခြင်းကို
                    ရပ်နားထားပါ။
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-1">
          {!showResults ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center text-[#6B7280]">
              <div className="w-20 h-20 bg-[#F0F7F4] rounded-full flex items-center justify-center mb-4">
                <PieChartIcon className="w-10 h-10 text-[#52B788] opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-[#1B4332] mb-2">
                တွက်ချက်မှု ရလဒ်များ
              </h3>
              <p className="text-sm">
                ကုန်ကျစရိတ်များကို ဖြည့်သွင်းပြီး တွက်ချက်ရန် ခလုတ်ကို နှိပ်ပါ။
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
              {/* Profit Summary Card */}
              <div
                className={`rounded-2xl p-8 shadow-lg text-white ${netProfit >= 0 ? 'bg-gradient-to-br from-[#2D6A4F] to-[#1B4332]' : 'bg-gradient-to-br from-[#E76F51] to-[#C62828]'}`}
              >
                <h2 className="text-xl font-medium opacity-90 mb-2">
                  ခန့်မှန်း အသားတင်အမြတ်
                </h2>
                <div className="text-4xl font-bold mb-6">
                  {netProfit.toLocaleString()}{' '}
                  <span className="text-xl font-normal">ကျပ်</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/20 pt-6">
                  <div>
                    <p className="text-sm opacity-80 mb-1">
                      ဝင်ငွေ (ခန့်မှန်း)
                    </p>
                    <p className="font-bold text-xl">
                      {estimatedRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80 mb-1">
                      အမြတ် ရာခိုင်နှုန်း
                    </p>
                    <p className="font-bold text-xl">{profitMargin}%</p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
                <h3 className="font-bold text-[#1B4332] mb-4">
                  ကုန်ကျစရိတ် ခွဲခြမ်းစိတ်ဖြာမှု
                </h3>
                <div className="flex-1 min-h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: any) =>
                          `${value.toLocaleString()} ကျပ်`
                        }
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                        style={{
                          backgroundColor: item.color,
                        }}
                      ></div>
                      <span
                        className="text-[#4B5563] truncate"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
