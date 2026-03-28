import { motion } from 'framer-motion'
import {
  DropletsIcon,
  BugIcon,
  FlaskConicalIcon,
  WheatIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  InfoIcon,
  AlertTriangle,
  CalendarClockIcon,
} from 'lucide-react'
import type { Notification } from '../types'
interface AdvisoryPageProps {
  notifications: Notification[]
}
export function AdvisoryPage({ notifications }: AdvisoryPageProps) {
  const lifecycleSteps = [
    {
      id: 1,
      title: 'မြေပြင်ညှိခြင်း',
      status: 'completed',
      date: '၁ မတ်လ',
    },
    {
      id: 2,
      title: 'စိုက်ပျိုးခြင်း',
      status: 'completed',
      date: '၅ မတ်လ',
    },
    {
      id: 3,
      title: 'ပြုစုစောင့်ရှောက်ခြင်း',
      status: 'active',
      date: 'ယခု',
    },
    {
      id: 4,
      title: 'ရိတ်သိမ်းခြင်း',
      status: 'pending',
      date: '၃၀ ဧပြီလ (ခန့်မှန်း)',
    },
  ]
  const getIcon = (type: string) => {
    switch (type) {
      case 'irrigation':
        return <DropletsIcon className="w-6 h-6" />
      case 'pest':
        return <BugIcon className="w-6 h-6" />
      case 'fertilizer':
        return <FlaskConicalIcon className="w-6 h-6" />
      case 'harvest':
        return <WheatIcon className="w-6 h-6" />
      default:
        return <InfoIcon className="w-6 h-6" />
    }
  }
  const getColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-[#FFEbee] text-[#E63946] border-[#E63946]'
      case 'medium':
        return 'bg-[#FFF3E0] text-[#E76F51] border-[#E76F51]'
      case 'low':
        return 'bg-[#E8F3EE] text-[#2D6A4F] border-[#52B788]'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
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
        {/* Left Column: Lifecycle Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#1B4332]">
                စိုက်ပျိုးမှု အဆင့်ဆင့်
              </h3>
              <span className="bg-[#E8F3EE] text-[#2D6A4F] px-3 py-1 rounded-full text-sm font-bold">
                စပါး (ဆင်းသုခ)
              </span>
            </div>

            <div className="relative ml-4">
              <div className="absolute left-4 top-4 bottom-4 w-1 bg-gray-100 rounded-full"></div>
              <div className="space-y-10 relative">
                {lifecycleSteps.map((step) => (
                  <div key={step.id} className="flex items-start group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 shadow-sm transition-transform group-hover:scale-110 ${step.status === 'completed' ? 'bg-[#52B788] border-[#E8F3EE] text-white' : step.status === 'active' ? 'bg-white border-[#2D6A4F] text-[#2D6A4F]' : 'bg-white border-gray-200 text-gray-300'}`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2Icon className="w-5 h-5" />
                      ) : (
                        <span className="text-base font-bold">{step.id}</span>
                      )}
                    </div>
                    <div
                      className={`ml-6 pt-1 ${step.status === 'completed' ? 'text-[#6B7280]' : step.status === 'active' ? 'text-[#1B4332]' : 'text-gray-400'}`}
                    >
                      <h4
                        className={`font-bold text-lg ${step.status === 'active' ? 'text-xl' : ''}`}
                      >
                        {step.title}
                      </h4>
                      <div className="flex items-center mt-1">
                        <CalendarClockIcon className="w-4 h-4 mr-1 opacity-70" />
                        <span className="text-sm opacity-80">{step.date}</span>
                      </div>
                      {step.status === 'active' && (
                        <span className="inline-block bg-[#E8F3EE] text-[#2D6A4F] text-xs font-bold px-2 py-1 rounded mt-2">
                          လက်ရှိ လုပ်ဆောင်ဆဲ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Notifications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-[#E76F51]" />
              လုပ်ဆောင်ရန် အကြံပြုချက်များ
            </h3>
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-2xl p-6 border-l-8 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer ${getColor(notif.urgency)}`}
                >
                  <div className="flex items-center space-x-5">
                    <div className="p-4 bg-white/60 rounded-full shadow-sm">
                      {getIcon(notif.type)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">
                        {notif.message}
                      </h4>
                      <p className="text-base opacity-90 flex items-center">
                        <CalendarClockIcon className="w-4 h-4 mr-1" />
                        နောက်{' '}
                        <span className="font-bold mx-1">
                          {notif.daysUntil}
                        </span>{' '}
                        ရက်အတွင်း လုပ်ဆောင်ရန်
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/40 p-2 rounded-full">
                    <ChevronRightIcon className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-[#F0F7F4] rounded-2xl p-8 border border-[#52B788]/30 flex items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mr-6 flex-shrink-0">
              <InfoIcon className="w-8 h-8 text-[#2D6A4F]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2D6A4F] mb-3">
                အထွက်နှုန်းတိုးရန် အထူးအကြံပြုချက်
              </h3>
              <p className="text-base text-[#1B4332] leading-relaxed">
                စပါးပင် ပန်းပွင့်ချိန်တွင် ရေမပြတ်စေရန် အထူးဂရုစိုက်ပါ။
                ရေပြတ်ပါက အဖျင်းအမှော် များတတ်ပါသည်။ ပိုးမွှားအန္တရာယ်ကိုလည်း
                ပုံမှန် စစ်ဆေးပါ။ ယခုရက်သတ္တပတ်အတွင်း ပိုးမွှားကျရောက်နိုင်ခြေ
                များပြားသဖြင့် ဂရုပြုစစ်ဆေးရန် အကြံပြုအပ်ပါသည်။
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
