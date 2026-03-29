import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  MaximizeIcon,
  SproutIcon,
  SaveIcon,
  LogOutIcon,
  EditIcon,
  CheckIcon,
} from 'lucide-react'
interface ProfilePageProps {
  userName: string
  userPhone?: string;
  onLogout: () => void;
}
export function ProfilePage({ userName, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: userName,
    phone: '09-123-456-789',
    region: 'မန္တလေး',
    village: 'ပုသိမ်ကြီးမြို့နယ်',
    landSize: '၅',
    mainCrop: 'စပါး',
    experience: '၁၅',
  })
  const handleSave = () => {
    setIsEditing(false)
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
        {/* Left: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] p-8 text-center relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white/30">
                <UserIcon className="w-12 h-12 text-[#2D6A4F]" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                တောင်သူ {profile.name}
              </h2>
              <p className="text-white/70 mt-1">အကောင့်ပိုင်ရှင်</p>
            </div>

            {/* Quick Stats */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between bg-[#F0F7F4] p-4 rounded-xl">
                <div className="flex items-center">
                  <SproutIcon className="w-5 h-5 text-[#2D6A4F] mr-3" />
                  <span className="text-sm text-[#1B4332] font-bold">
                    စိုက်ပျိုးအတွေ့အကြုံ
                  </span>
                </div>
                <span className="font-bold text-[#2D6A4F]">
                  {profile.experience} နှစ်
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#F0F7F4] p-4 rounded-xl">
                <div className="flex items-center">
                  <MaximizeIcon className="w-5 h-5 text-[#2D6A4F] mr-3" />
                  <span className="text-sm text-[#1B4332] font-bold">
                    စုစုပေါင်း မြေဧက
                  </span>
                </div>
                <span className="font-bold text-[#2D6A4F]">
                  {profile.landSize} ဧက
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#F0F7F4] p-4 rounded-xl">
                <div className="flex items-center">
                  <SproutIcon className="w-5 h-5 text-[#2D6A4F] mr-3" />
                  <span className="text-sm text-[#1B4332] font-bold">
                    အဓိက သီးနှံ
                  </span>
                </div>
                <span className="font-bold text-[#2D6A4F]">
                  {profile.mainCrop}
                </span>
              </div>
            </div>

            {/* Logout */}
            <div className="p-6 pt-0">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center bg-[#FFEBEE] text-[#E63946] font-bold p-4 rounded-xl hover:bg-[#FFCDD2] transition-colors"
              >
                <LogOutIcon className="w-5 h-5 mr-2" />
                အကောင့်မှ ထွက်ရန်
              </button>
            </div>
          </div>
        </div>

        {/* Right: Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-[#1B4332]">
                  ကိုယ်ရေးအချက်အလက်
                </h2>
                <p className="text-[#6B7280] text-sm mt-1">
                  သင့်အချက်အလက်များကို ပြင်ဆင်နိုင်ပါသည်။
                </p>
              </div>
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className={`flex items-center px-6 py-3 rounded-xl font-bold transition-colors ${isEditing ? 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]' : 'bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#E8F3EE]'}`}
              >
                {isEditing ? (
                  <>
                    <CheckIcon className="w-5 h-5 mr-2" /> သိမ်းဆည်းရန်
                  </>
                ) : (
                  <>
                    <EditIcon className="w-5 h-5 mr-2" /> ပြင်ဆင်ရန်
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                  <UserIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                  အမည်
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="bg-[#F0F7F4] rounded-xl p-4 text-lg text-[#1B4332] font-medium">
                    {profile.name}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                  <PhoneIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                  ဖုန်းနံပါတ်
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="bg-[#F0F7F4] rounded-xl p-4 text-lg text-[#1B4332] font-medium">
                    {profile.phone}
                  </div>
                )}
              </div>

              {/* Region */}
              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                  <MapPinIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                  တိုင်းဒေသကြီး
                </label>
                {isEditing ? (
                  <select
                    className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                    value={profile.region}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        region: e.target.value,
                      })
                    }
                  >
                    <option value="ဧရာဝတီ">ဧရာဝတီ</option>
                    <option value="မန္တလေး">မန္တလေး</option>
                    <option value="စစ်ကိုင်း">စစ်ကိုင်း</option>
                    <option value="ပဲခူး">ပဲခူး</option>
                    <option value="ရန်ကုန်">ရန်ကုန်</option>
                  </select>
                ) : (
                  <div className="bg-[#F0F7F4] rounded-xl p-4 text-lg text-[#1B4332] font-medium">
                    {profile.region}
                  </div>
                )}
              </div>

              {/* Village */}
              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                  <MapPinIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                  မြို့နယ်
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                    value={profile.village}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        village: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="bg-[#F0F7F4] rounded-xl p-4 text-lg text-[#1B4332] font-medium">
                    {profile.village}
                  </div>
                )}
              </div>

              {/* Land Size */}
              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                  <MaximizeIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                  မြေဧက
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                    value={profile.landSize}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        landSize: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="bg-[#F0F7F4] rounded-xl p-4 text-lg text-[#1B4332] font-medium">
                    {profile.landSize} ဧက
                  </div>
                )}
              </div>

              {/* Main Crop */}
              <div>
                <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                  <SproutIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                  အဓိက သီးနှံ
                </label>
                {isEditing ? (
                  <select
                    className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                    value={profile.mainCrop}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        mainCrop: e.target.value,
                      })
                    }
                  >
                    <option value="စပါး">စပါး</option>
                    <option value="ပဲ">ပဲ</option>
                    <option value="ပြောင်း">ပြောင်း</option>
                    <option value="ကြက်သွန်">ကြက်သွန်</option>
                    <option value="ခရမ်းချဉ်">ခရမ်းချဉ်</option>
                  </select>
                ) : (
                  <div className="bg-[#F0F7F4] rounded-xl p-4 text-lg text-[#1B4332] font-medium">
                    {profile.mainCrop}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
            <h3 className="text-lg font-bold text-[#1B4332] mb-4">
              အကောင့် အချက်အလက်
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#E8F3EE] p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-[#2D6A4F]">၃</p>
                <p className="text-sm text-[#6B7280] mt-1">လက်ရှိ စိုက်ခင်း</p>
              </div>
              <div className="bg-[#FFF3E0] p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-[#E76F51]">၁၂</p>
                <p className="text-sm text-[#6B7280] mt-1">ပြီးခဲ့သော ရာသီ</p>
              </div>
              <div className="bg-[#E3F2FD] p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-[#4A90E2]">၈၅%</p>
                <p className="text-sm text-[#6B7280] mt-1">AI တိကျမှု</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
