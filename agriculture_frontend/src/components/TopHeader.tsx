import { BellIcon, CalendarIcon } from 'lucide-react'
interface TopHeaderProps {
  currentPage: string
  notificationCount: number
  userName?: string;
}
export function TopHeader({ currentPage, notificationCount }: TopHeaderProps) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'ပင်မစာမျက်နှာ'
      case 'planning':
        return 'သီးနှံစိုက်ပျိုးရေး အစီအစဉ်'
      case 'costs':
        return 'ကုန်ကျစရိတ် စီမံခန့်ခွဲမှု'
      case 'harvest':
        return 'ရိတ်သိမ်းခြင်း ခွဲခြမ်းစိတ်ဖြာမှု'
      case 'climate':
        return 'ရာသီဥတု စောင့်ကြည့်ရေး'
      case 'advisory':
        return 'စိုက်ပျိုးရေး အကြံပြုချက်'
      default:
        return 'မြန်မာ စိုက်ပျိုးရေး AI'
    }
  }
  // Mock current date in Myanmar
  const currentDate = '၁၅ မတ်လ၊ ၂၀၂၄'
  return (
    <div className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
      <h1 className="text-xl font-bold text-[#1B4332]">{getPageTitle()}</h1>

      <div className="flex items-center space-x-6">
        <div className="flex items-center text-[#6B7280] bg-[#F0F7F4] px-4 py-2 rounded-lg">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span className="text-sm font-bold">{currentDate}</span>
        </div>

        <button className="relative p-2 text-[#6B7280] hover:bg-[#F0F7F4] rounded-full transition-colors">
          <BellIcon className="w-6 h-6" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#E63946] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
