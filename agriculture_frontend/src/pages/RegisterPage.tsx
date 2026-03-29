import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SproutIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from 'lucide-react'

interface RegisterPageProps {
  onRegister: (name: string, phone: string) => void
  onBackToLogin: () => void
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      setError('အမည် ထည့်သွင်းပါ')
      return false
    }
    if (formData.name.trim().length < 2) {
      setError('အမည်သည် အနည်းဆုံး ၂ လုံးရှိရပါမည်')
      return false
    }

    // Phone validation (Myanmar phone numbers)
    const phoneRegex = /^(09|\+959)[0-9]{7,9}$/
    if (!formData.phone.trim()) {
      setError('ဖုန်းနံပါတ် ထည့်သွင်းပါ')
      return false
    }
    if (!phoneRegex.test(formData.phone)) {
      setError('ဖုန်းနံပါတ် မမှန်ကန်ပါ (၀၉xxxxxxxxx ပုံစံထည့်ပါ)')
      return false
    }

    // Email validation (optional but validate if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('အီးမေးလ် လိပ်စာ မမှန်ကန်ပါ')
      return false
    }

    // Password validation
    if (!formData.password) {
      setError('စကားဝှက် ထည့်သွင်းပါ')
      return false
    }
    if (formData.password.length < 6) {
      setError('စကားဝှက်သည် အနည်းဆုံး ၆ လုံးရှိရပါမည်')
      return false
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError('စကားဝှက်များ မတူညီပါ')
      return false
    }

    // Terms agreement
    if (!agreedToTerms) {
      setError('စည်းကမ်းချက်များကို လက်ခံရပါမည်')
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Registration successful
    onRegister(formData.name.trim(), formData.phone.trim())
  }

  return (
    <div className="min-h-screen bg-[#F0F7F4] flex items-center justify-center p-4 font-sans overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md my-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-[#2D6A4F] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
          >
            <SproutIcon className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#1B4332]">
            အကောင့်အသစ် ဖွင့်ရန်
          </h1>
          <p className="text-[#6B7280] mt-2">
            မြန်မာစိုက်ပျိုးရေး AI အဖွဲ့ဝင်ဖြစ်လိုက်ပါ
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                <UserIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                အမည် <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-3 md:p-4 text-base md:text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                placeholder="ဦးမောင်မောင်"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                <PhoneIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                ဖုန်းနံပါတ် <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-3 md:p-4 text-base md:text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                placeholder="09xxxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
              />
              <p className="text-xs text-[#6B7280] mt-1">
                ဥပမာ - 09123456789 သို့မဟုတ် +959123456789
              </p>
            </div>

            {/* Email Input (Optional) */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                <MailIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                အီးမေးလ် (ရွေးချယ်နိုင်သည်)
              </label>
              <input
                type="email"
                name="email"
                className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-3 md:p-4 text-base md:text-lg focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                <LockIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                စကားဝှက် <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-3 md:p-4 text-base md:text-lg pr-12 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2D6A4F] transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                အနည်းဆုံး ၆ လုံးရှိရပါမည်
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="flex items-center text-[#1B4332] font-bold mb-2 text-sm">
                <LockIcon className="w-4 h-4 mr-2 text-[#52B788]" />
                စကားဝှက် အတည်ပြုရန် <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="w-full bg-[#F0F7F4] border border-transparent rounded-xl p-3 md:p-4 text-base md:text-lg pr-12 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2D6A4F] transition-colors"
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="mt-0.5"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  agreedToTerms 
                    ? 'bg-[#2D6A4F] border-[#2D6A4F]' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {agreedToTerms && <CheckCircleIcon className="w-4 h-4 text-white" />}
                </div>
              </button>
              <label className="text-sm text-[#4B5563] leading-relaxed">
                မြန်မာစိုက်ပျိုးရေး AI ၏{' '}
                <button
                  type="button"
                  className="text-[#2D6A4F] font-bold hover:underline"
                  onClick={() => alert('စည်းကမ်းချက်များ စာမျက်နှာ')}
                >
                  စည်းကမ်းချက်များ
                </button>{' '}
                နှင့်{' '}
                <button
                  type="button"
                  className="text-[#2D6A4F] font-bold hover:underline"
                  onClick={() => alert('ကိုယ်ရေးအချက်အလက် စည်းမျဉ်းစာမျက်နှာ')}
                >
                  ကိုယ်ရေးအချက်အလက် စည်းမျဉ်း
                </button>{' '}
                ကို ဖတ်ရှုပြီး သဘောတူပါသည်။
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-[#E63946] text-sm font-bold bg-[#FFEBEE] p-3 rounded-lg"
              >
                <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Register Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-base md:text-lg p-3 md:p-4 rounded-xl shadow-md transition-colors"
            >
              အကောင့်ဖွင့်ရန်
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-[#6B7280]">သို့မဟုတ်</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Back to Login */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full bg-white border-2 border-[#2D6A4F] text-[#2D6A4F] font-bold text-base md:text-lg p-3 md:p-4 rounded-xl hover:bg-[#F0F7F4] transition-colors"
          >
            အကောင့်ဝင်ရန်
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6B7280] text-xs md:text-sm mt-6">
          © ၂၀၂၄ မြန်မာ စိုက်ပျိုးရေး AI • မြန်မာ့တောင်သူများအတွက်
        </p>
      </motion.div>
    </div>
  )
}