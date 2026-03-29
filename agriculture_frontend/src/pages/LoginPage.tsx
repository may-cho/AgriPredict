import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SproutIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react'
import logo from '../assets/logo.png'

interface LoginPageProps {
  onLogin: (name: string) => void
  onRegisterClick?: () => void  // This is defined but not used
}

export function LoginPage({ onLogin, onRegisterClick }: LoginPageProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) {
      setError('ဖုန်းနံပါတ် ထည့်သွင်းပါ')
      return
    }
    if (!password.trim()) {
      setError('စကားဝှက် ထည့်သွင်းပါ')
      return
    }
    setError('')
    onLogin('ဦးမောင်')
  }
  
  return (
    <div className="min-h-screen bg-[#F0F7F4] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
            }}
            className="w-20 h-20 bg-[#F0F7F4] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
          >
            {/* <SproutIcon className="w-10 h-10 text-white" /> */}
            <img 
          src={logo} 
          alt="စိုက်ပျိုး​မြော်မြင် Logo" 
          className="w-25 h-16 object-contain rounded-lg left-0" 
        />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#1B4332]">
            စိုက်ပျိုး​မြော်မြင်
          </h1>
          <p className="text-[#6B7280] mt-2 text-lg">
            သင့်စိုက်ခင်းကို AI ဖြင့် စီမံခန့်ခွဲပါ
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-[#1B4332] mb-6 text-center">
            အကောင့်ဝင်ရန်
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Input */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                <UserIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                ဖုန်းနံပါတ်
              </label>
              <input
                type="tel"
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                placeholder="09xxxxxxxxx"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setError('')
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                <LockIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                စကားဝှက်
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-4 text-lg pr-12 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2D6A4F] transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="text-[#E63946] text-sm font-bold bg-[#FFEBEE] p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-lg p-4 rounded-xl shadow-md transition-colors"
            >
              ဝင်ရောက်ရန်
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-[#6B7280]">သို့မဟုတ်</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register button - FIXED: Now calls onRegisterClick instead of onLogin */}
          <button
            type="button"
            onClick={() => onRegisterClick?.()}  // ← This was the problem
            className="w-full bg-white border-2 border-[#2D6A4F] text-[#2D6A4F] font-bold text-lg p-4 rounded-xl hover:bg-[#F0F7F4] transition-colors"
          >
            အကောင့်အသစ် ဖွင့်ရန်
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6B7280] text-sm mt-6">
          © ၂၀၂၄ မြန်မာ စိုက်ပျိုးရေး AI • မြန်မာ့တောင်သူများအတွက်
        </p>
      </motion.div>
    </div>
  )
}