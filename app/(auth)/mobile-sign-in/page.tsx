'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const MobileSignIn = () => {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [redirectingToQuiz, setRedirectingToQuiz] = useState(false)
  const router = useRouter()

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '')
    
    // Format as +91 XXXXXXXXXX
    if (cleaned.length <= 10) {
      return cleaned
    }
    
    // If starts with 91, format as +91 XXXXXXXXXX
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
    }
    
    // If starts with 0, remove it and format as +91 XXXXXXXXXX
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `+91 ${cleaned.slice(1)}`
    }
    
    return cleaned
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setRedirectingToQuiz(false)

    // Clean the phone number before sending
    let cleanedPhone = phone.replace(/\D/g, '')
    
    // If number starts with 0, remove it
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.slice(1)
    }
    
    // If number doesn't start with 91, add it
    if (!cleanedPhone.startsWith('91')) {
      cleanedPhone = '91' + cleanedPhone
    }

    try {
      // First check if the phone number exists in users table
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('phoneNumber')
        .eq('phoneNumber', cleanedPhone)

      if (fetchError) {
        throw fetchError;
      }

      // If phone number doesn't exist in users table, redirect to style quiz
      if (!users || users.length === 0) {
        setRedirectingToQuiz(true);
        setTimeout(() => {
          router.push('/style-quiz');
        }, 3000);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: `+${cleanedPhone}`,
        options: { shouldCreateUser: true, channel: 'sms' },
      })

      if (error) {
        console.log(cleanedPhone);
        setError(error.message)
      } else {
        setOtpSent(true)
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

    // Clean the phone number before verifying
    let cleanedPhone = phone.replace(/\D/g, '')
    
    // If number starts with 0, remove it
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.slice(1)
    }
    
    // If number doesn't start with 91, add it
    if (!cleanedPhone.startsWith('91')) {
      cleanedPhone = '91' + cleanedPhone
    }

    try {
      // Double check if the phone number exists in users table
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('phoneNumber')
        .eq('phoneNumber', cleanedPhone)

      if (fetchError) {
        throw fetchError;
      }

      // If phone number doesn't exist in users table, redirect to style quiz
      if (!users || users.length === 0) {
        router.push('/style-quiz');
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: `+${cleanedPhone}`,
        token: otp,
        type: 'sms'
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/recommendations')
      }
    } catch (err) {
      setError('An error occurred while verifying OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-[25px] font-medium text-gray-900">
          Sign in with mobile number
        </h2>
        <p className="mt-2 text-center text-[14px] text-gray-600">
          Complete the style quiz to create your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          {redirectingToQuiz && (
            <div className="mb-6 p-4 bg-[#E8F4F6] border border-[#007e90] rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#007e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-[14px] font-medium text-[#007e90]">New User Detected!</p>
                  <p className="text-[14px] text-[#007e90] mt-1">
                    Please complete the style quiz to create your account. Redirecting you now...
                  </p>
                </div>
              </div>
            </div>
          )}

          {!otpSent ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="phone" className="block text-[14px] font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007e90] focus:border-[#007e90] text-[14px]"
                    placeholder="+91 9876543210"
                    pattern="^(\+91[\s-]?)?[0]?[789]\d{9}$"
                    title="Please enter a valid Indian phone number"
                  />
                </div>
                <p className="mt-2 text-[14px] text-gray-500">
                  Enter your mobile number 
                </p>
              </div>

              {error && (
                <div className="text-red-500 text-[14px]">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !phone.match(/^(\+91[\s-]?)?[0]?[789]\d{9}$/)}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-[14px] font-medium text-white bg-[#007e90] hover:bg-[#006d7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007e90] disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp" className="block text-[14px] font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007e90] focus:border-[#007e90] text-[14px]"
                    placeholder="Enter 6-digit OTP"
                    pattern="\d{6}"
                    title="Please enter a 6-digit OTP"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-[14px]">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !otp.match(/^\d{6}$/)}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-[14px] font-medium text-white bg-[#007e90] hover:bg-[#006d7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007e90] disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileSignIn 