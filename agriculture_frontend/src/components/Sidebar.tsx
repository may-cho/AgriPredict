import React from 'react'
import {
  HomeIcon,
  SproutIcon,
  // CircleDollarSignIcon,
  WheatIcon,
  CloudSunIcon,
  ClipboardListIcon,
  UserIcon,
  // LogOutIcon,
} from 'lucide-react'
import logo from '../assets/logo.png'
interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  userName: string
}
export function Sidebar({
  currentPage,
  setCurrentPage,
  userName,
}: SidebarProps) {
  const navItems = [
    {
      id: "home",
      label: "ပင်မ",
      icon: HomeIcon,
    },
    {
      id: "planning",
      label: "စိုက်ပျိုးရေး",
      icon: SproutIcon,
    },

    {
      id: "harvest",
      label: "ရိတ်သိမ်းခြင်း",
      icon: WheatIcon,
    },
    {
      id: "climate",
      label: "ရာသီဥတု",
      icon: CloudSunIcon,
    },
    {
      id: "advisory",
      label: "အကြံပြု",
      icon: ClipboardListIcon,
    },
  ];
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-sm z-20">
      {/* Brand */}
      <div className="h-16 flex items-center p-0 border-b border-gray-100">
        {/* <SproutIcon className="w-8 h-8 text-[#2D6A4F] mr-3" /> */}
        <img 
          src={logo} 
          alt="စိုက်ပျိုး​မြော်မြင် Logo" 
          className="w-25 h-16 object-contain rounded-lg left-0" 
        />
        <span className="font-bold text-lg text-[#2D6A4F]">
          စိုက်ပျိုး​မြော်မြင်
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-[#E8F3EE] text-[#2D6A4F] border-l-4 border-[#2D6A4F]" : "text-[#6B7280] hover:bg-[#F0F7F4] border-l-4 border-transparent"}`}
            >
              <Icon
                className={`w-5 h-5 mr-3 ${isActive ? "text-[#2D6A4F]" : "text-[#6B7280]"}`}
              />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Profile - Clickable */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setCurrentPage('profile')}
          className={`w-full flex items-center p-3 rounded-xl transition-colors ${currentPage === 'profile' ? 'bg-[#E8F3EE] ring-2 ring-[#2D6A4F]/30' : 'bg-[#F0F7F4] hover:bg-[#E8F3EE]'}`}
        >
          <div className="w-10 h-10 bg-[#2D6A4F] rounded-full flex items-center justify-center text-white mr-3">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#1B4332]">
              တောင်သူ {userName}
            </p>
            <p className="text-xs text-[#6B7280]">ပရိုဖိုင် ကြည့်ရန်</p>
          </div>
        </button>
      </div>
    </div>
  );
}
