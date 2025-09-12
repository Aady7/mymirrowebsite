'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const SignIn = () => {
  const [input, setInput] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [redirectingToQuiz, setRedirectingToQuiz] = useState(false)
  const [inputType, setInputType] = useState<'email' | 'phone'>('email')
  const router = useRouter()

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.length <= 10) {
      return cleaned
    }
    
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
    }
    
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `+91 ${cleaned.slice(1)}`
    }
    
    return cleaned
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (inputType === 'phone') {
      setInput(formatPhoneNumber(value))
    } else {
      setInput(value)
    }
  }

  const detectInputType = (value: string) => {
    // Check if it looks like an email
    if (value.includes('@') && value.includes('.')) {
      return 'email'
    }
    // Check if it looks like a phone number
    if (/^[\d\s\+\-\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10) {
      return 'phone'
    }
    return 'email' // default
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setRedirectingToQuiz(false)

    const detectedType = detectInputType(input)
    setInputType(detectedType)

    try {
      if (detectedType === 'phone') {
        // Phone number logic
        let cleanedPhone = input.replace(/\D/g, '')
        
        if (cleanedPhone.startsWith('0')) {
          cleanedPhone = cleanedPhone.slice(1)
        }
        
        if (!cleanedPhone.startsWith('91')) {
          cleanedPhone = '91' + cleanedPhone
        }

        // Check if phone number exists in users table
        const { data: users, error: fetchError } = await supabase
          .from('users_updated')
          .select('phone_number')
          .eq('phone_number', cleanedPhone)

        if (fetchError) {
          throw fetchError
        }

        // If phone number doesn't exist, redirect to style quiz
        if (!users || users.length === 0) {
          setRedirectingToQuiz(true)
          setTimeout(() => {
            router.push('/style-quiz')
          }, 3000)
          return
        }

        const { error } = await supabase.auth.signInWithOtp({
          phone: `+${cleanedPhone}`,
          options: { shouldCreateUser: true, channel: 'sms' },
        })

        if (error) {
          setError(error.message)
        } else {
          setOtpSent(true)
        }
      } else {
        // Email logic
        const { data: users, error: fetchError } = await supabase
          .from('users_updated')
          .select('email_address')
          .eq('email_address', input)

        if (fetchError) {
          throw fetchError
        }

        // If email doesn't exist, redirect to style quiz
        if (!users || users.length === 0) {
          setRedirectingToQuiz(true)
          setTimeout(() => {
            router.push('/style-quiz')
          }, 3000)
          return
        }

        const { error } = await supabase.auth.signInWithOtp({
          email: input,
          options: { shouldCreateUser: true, emailRedirectTo: 'null' },
        })

        if (error) {
          setError(error.message)
        } else {
          setOtpSent(true)
        }
      }
    } catch (err) {
      setError('An error occurred while sending OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (inputType === 'phone') {
        let cleanedPhone = input.replace(/\D/g, '')
        
        if (cleanedPhone.startsWith('0')) {
          cleanedPhone = cleanedPhone.slice(1)
        }
        
        if (!cleanedPhone.startsWith('91')) {
          cleanedPhone = '91' + cleanedPhone
        }

        const { error } = await supabase.auth.verifyOtp({
          phone: `+${cleanedPhone}`,
          token: otp,
          type: 'sms'
        })

        if (error) {
          setError(error.message)
        } else {
          router.push('/dashboard')
        }
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email: input,
          token: otp,
          type: 'email'
        })

        if (error) {
          setError(error.message)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('An error occurred while verifying OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600">
            Sign in with your email or phone number
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-white/20"
        >
          {redirectingToQuiz && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-blue-800">New User Detected!</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Please complete the style quiz to create your account. Redirecting you now...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {!otpSent ? (
            <motion.form
              variants={itemVariants}
              className="space-y-6"
              onSubmit={handleSendOtp}
            >
              <div>
                <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number
                </label>
                <motion.input
                  id="input"
                  name="input"
                  type={inputType === 'phone' ? 'tel' : 'email'}
                  required
                  value={input}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder={inputType === 'phone' ? '+91 9876543210' : 'your@email.com'}
                  whileFocus={{ scale: 1.02 }}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter your email address or mobile number
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-all duration-300 tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Send OTP'
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
              onSubmit={handleVerifyOtp}
            >
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <motion.input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  whileFocus={{ scale: 1.02 }}
                />
                <p className="mt-2 text-sm text-gray-500 text-center">
                  OTP sent to {inputType === 'phone' ? input : input}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !otp.match(/^\d{6}$/)}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-all duration-300 tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Verify OTP'
                )}
              </motion.button>
            </motion.form>
          )}

        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignIn