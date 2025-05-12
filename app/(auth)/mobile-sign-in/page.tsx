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
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+${cleanedPhone}`,
        options:{shouldCreateUser: true, channel: 'sms'},
        

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in with mobile number
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!otpSent ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="+91 9876543210"
                    pattern="^(\+91[\s-]?)?[0]?[789]\d{9}$"
                    title="Please enter a valid Indian phone number"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your mobile number 
                </p>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !phone.match(/^(\+91[\s-]?)?[0]?[789]\d{9}$/)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter 6-digit OTP"
                    pattern="\d{6}"
                    title="Please enter a 6-digit OTP"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !otp.match(/^\d{6}$/)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/sign-in"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in with email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileSignIn 