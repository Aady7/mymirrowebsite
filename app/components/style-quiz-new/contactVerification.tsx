"use client";
import React, { useState } from 'react';
import SingleViewportLayout from './SingleViewportLayout';
import { handleSendMail, handleSendOtp } from '@/app/utils/styleQuizUtils';
const beta=process.env.NEXT_PUBLIC_TESTING_VAR

interface ContactVerificationProps {
  onNext?: (data: ContactVerificationData) => void;
  onBack?: () => void;
  initialData?: Partial<ContactVerificationData>;
  currentStep?: number;
  totalSteps?: number;
}

export interface ContactVerificationData {
  email: string;
  phone: string;
  isVerified: boolean;
}

const ContactVerification: React.FC<ContactVerificationProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 6,
  totalSteps = 8,
}) => {
  const [email, setEmail] = useState<string>(initialData?.email || '');
  const [phone, setPhone] = useState<string>(initialData?.phone || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    const cleanedPhone = phone.replace(/\D/g, '');
    return phoneRegex.test(cleanedPhone) || cleanedPhone.length === 10;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear email error when user starts typing
    if (errors.email && value.trim()) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setPhone(value);
      
      // Clear phone error when user starts typing
      if (errors.phone && value.trim()) {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (beta === 'yes') {
        // Beta mode: Use email verification
        const emailResult = await handleSendMail(email);
        if (emailResult.error) {
          throw new Error(`Email verification failed: ${emailResult.error.message}`);
        }
      } else {
        // Production mode: Use phone verification
        const phoneResult = await handleSendOtp(phone);
        if (phoneResult.error) {
          throw new Error(`Phone verification failed: ${phoneResult.error.message}`);
        }
      }

      // If successful, proceed to next step
      const data: ContactVerificationData = {
        email,
        phone,
        isVerified: true
      };

      onNext?.(data);

    } catch (error) {
      console.error('OTP sending failed:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to send verification code. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() && phone.trim() && validateEmail(email) && validatePhone(phone);

  return (
    <SingleViewportLayout
      onNext={handleSendOTP}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={isFormValid}
      isLoading={isLoading}
      nextButtonText={isLoading ? 'Sending OTP...' : 'Send OTP'}
      showBackButton={currentStep > 1}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
          Let's Stay Connected!
        </h1>
        <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
          We need just a bit more info to keep the style vibes flowing.
          {beta === 'yes' ? ' We\'ll send verification to your email.' : ' We\'ll send verification to your phone.'}
        </p>
      </div>

      {/* Email Verification Section */}
      <div className="mb-5">
        <label className="block text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-black mb-2">
          Email Verification
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-4 py-4 border rounded-lg text-[14px] font-[400] leading-[100%] tracking-[-0.02em] bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] mt-2">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Phone Number Section */}
      <div className="mb-5">
        <label className="block text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-black mb-2">
          Phone Number
        </label>
        <div className="relative">
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-4 border rounded-lg text-[14px] font-[400] leading-[100%] tracking-[-0.02em] bg-gray-50 focus:outline-none focus:ring-2 transition-colors ${
              errors.phone 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] mt-2">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Required Fields Note */}
      <div className="mb-8">
        <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-500 italic">
          *Both email and phone number are required
          
        </p>
      </div>

      {/* General Error Message */}
      {errors.general && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-[14px] font-[400] leading-[100%] tracking-[-0.02em]">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Success Message (if needed) */}
      {isFormValid && !isLoading && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-[14px] font-[400] leading-[100%] tracking-[-0.02em]">
              ✓ Ready to send verification codes
            </p>
          </div>
        </div>
      )}
    </SingleViewportLayout>
  );
};

export default ContactVerification;
