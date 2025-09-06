"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';
import QuizButton from './QuizButton';
import { handleVerifyOtp, handleVerifyMail, handleSendOtp, handleSendMail, transformQuizDataForV2, storeQuizDataInSupabase, clearQuizDataFromStorage } from '@/app/utils/styleQuizUtils';
const beta=process.env.NEXT_PUBLIC_TESTING_VAR

interface OtpVerificationProps {
  onNext?: (data: OtpVerificationData) => void;
  onBack?: () => void;
  initialData?: Partial<OtpVerificationData>;
  currentStep?: number;
  totalSteps?: number;
  email?: string;
  phone?: string;
  allQuizData?: any; // All collected quiz data for logging
  isLatestVersion?: boolean; // Flag to determine if this is for style-quiz-latest
}

export interface OtpVerificationData {
  isVerified: boolean;
  verifiedEmail: string;
  verifiedPhone: string;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 7,
  totalSteps = 7,
  email = '',
  phone = '',
  allQuizData = {},
  isLatestVersion = false
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  
  // Refs for OTP input boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error && value) {
      setError('');
    }

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = ['', '', '', '', '', ''];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    setError('');

    try {
      if (beta === 'yes') {
        // Beta mode: Resend email OTP
        const emailResult = await handleSendMail(email);
        if (emailResult.error) {
          throw new Error(`Email OTP failed: ${emailResult.error.message}`);
        }
      } else {
        // Production mode: Resend phone OTP
        const phoneResult = await handleSendOtp(phone);
        if (phoneResult.error) {
          throw new Error(`Phone OTP failed: ${phoneResult.error.message}`);
        }
      }

      // Reset countdown and clear OTP
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();

    } catch (error) {
      console.error('Resend OTP failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Verify OTP
  const handleCompleteQuiz = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (beta === 'yes') {
        // Beta mode: Verify email OTP only
        const emailResult = await handleVerifyMail(email, otpString);
        if (emailResult.error) {
          throw new Error(`Email verification failed: ${emailResult.error.message}`);
        }
      } else {
        // Production mode: Verify phone OTP only
        const phoneResult = await handleVerifyOtp(phone, otpString);
        if (phoneResult.error) {
          throw new Error(`Phone verification failed: ${phoneResult.error.message}`);
        }
      }

      // Both verifications successful
      const verificationData: OtpVerificationData = {
        isVerified: true,
        verifiedEmail: email,
        verifiedPhone: phone
      };

      // Log complete quiz data
      const completeQuizData = {
        ...allQuizData,
        otpVerification: verificationData,
        completedAt: new Date().toISOString()
      };

      console.log('🎉 Style Quiz Completed Successfully!', completeQuizData);
     
      console.log('📋 Complete Quiz Data:', JSON.stringify(completeQuizData, null, 2));

      // Store data in Supabase if this is the latest version
      if (isLatestVersion) {
        console.log('Storing data in style-quiz-v2 table...');
        const transformedData = transformQuizDataForV2(completeQuizData);
        const { data: storedData, error: storageError } = await storeQuizDataInSupabase(transformedData);
        
        if (storageError) {
          console.error('Failed to store quiz data:', storageError);
          setError('Quiz completed but failed to save data. Please contact support.');
          return;
        }
        
        console.log('✅ Quiz data successfully stored in Supabase!', storedData);
        
        // Clear local storage after successful storage
        clearQuizDataFromStorage();
      }

      // Call onNext if provided
      onNext?.(verificationData);

      // Redirect to recommendations page
      router.push('/recommendations');

    } catch (error) {
      console.error('OTP verification failed:', error);
      setError(error instanceof Error ? error.message : 'Invalid OTP. Please try again.');
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 pt-12 pb-4">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={totalSteps}
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
            Almost There!
          </h1>
          <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
            Enter the 6-digit OTP we sent to your {beta === 'yes' ? 'email' : 'number'} to access your personalized style recommendations.
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div className="mb-6">
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-14 h-14 text-center text-[14px] font-[400] leading-[100%] tracking-[-0.02em] border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error 
                    ? 'border-red-500 focus:ring-red-500' 
                    : digit 
                      ? 'border-black focus:ring-purple-500' 
                      : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                }`}
              />
            ))}
          </div>

          {/* Resend OTP */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-purple-600 hover:text-purple-700 font-medium underline disabled:opacity-50"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-500">
                resend otp in {countdown}s
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-center">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isOtpComplete && !error && !isLoading && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-center">
                ✓ OTP entered. Ready to verify!
              </p>
            </div>
          </div>
        )}

        {/* Contact Info Display */}
        <div className="mb-6 text-center">
          {beta === 'yes' ? (
            <div>
              <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-500">
                OTP sent to: {email}
              </p>
             
            </div>
          ) : (
            <div>
              <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-500">
                OTP sent to: {phone.replace(/(\d{2})(\d{5})(\d{3})/, '+91 $1****$3')}
              </p>
              <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-green-600 mt-1">
                📱 Phone verification
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Complete Quiz Button */}
      <div className="px-6 pb-8 flex justify-center">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={handleCompleteQuiz}
          disabled={!isOtpComplete || isLoading}
          className="w-full max-w-md"
        >
          {isLoading ? 'Verifying...' : 'Complete Quiz'}
        </QuizButton>
      </div>

      {/* Bottom Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default OtpVerification;
