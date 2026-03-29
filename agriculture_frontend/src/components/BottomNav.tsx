import React from 'react'
import {
  HomeIcon,
  SproutIcon,
  CircleDollarSignIcon,
  CloudSunIcon,
  ClipboardListIcon,
} from 'lucide-react'
interface BottomNavProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}
export function BottomNav({ currentPage, setCurrentPage }: BottomNavProps) {
  const tabs = [
    {
      id: 'home',
      label: 'ပင်မ',
      icon: HomeIcon,
    },
    {
      id: 'planning',
      label: 'စိုက်ပျိုးရေး',
      icon: SproutIcon,
    },
    {
      id: 'costs',
      label: 'ကုန်ကျစရိတ်',
      icon: CircleDollarSignIcon,
    },
    {
      id: 'climate',
      label: 'ရာသီဥတု',
      icon: CloudSunIcon,
    },
    {
      id: 'advisory',
      label: 'အကြံပြု',
      icon: ClipboardListIcon,
    },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl">
      <div className="flex justify-around items-center h-20 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentPage === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${isActive ? 'text-[#2D6A4F]' : 'text-gray-400'}`}
              aria-label={tab.label}
            >
              <div
                className={`p-1.5 rounded-full ${isActive ? 'bg-[#E8F3EE]' : 'bg-transparent'}`}
              >
                <Icon className="w-7 h-7" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-xs font-bold ${isActive ? 'text-[#2D6A4F]' : 'text-gray-500'}`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
