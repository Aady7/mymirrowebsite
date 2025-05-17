"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { generateFitTags, generatePersonalityTags, generatePatternTags } from '@/app/utils/usermapping';
import { useRouter } from 'next/navigation';
import { PERSONALITY_QUESTIONS, handleSendOtp, handleVerifyOtp } from '@/app/utils/styleQuizUtils';
import PersonalInfoStep from '@/app/components/style-quiz/PersonalInfoStep';
import BodyTypeStep from '@/app/components/style-quiz/BodyTypeStep';
import SizePreferencesStep from '@/app/components/style-quiz/SizePreferencesStep';
import StylePreferencesStep from '@/app/components/style-quiz/StylePreferencesStep';
import GoToStyleStep from '@/app/components/style-quiz/GoToStyleStep';
import PersonalityQuestionStep from '@/app/components/style-quiz/PersonalityQuestionStep';
import OtpVerificationStep from '@/app/components/style-quiz/OtpVerificationStep';
import { FormValues } from '@/app/data/stylequizInterface';
import { StyleQuizData } from '@/app/data/stylequizInterface';
import { motion, AnimatePresence } from 'framer-motion';
import AuthNav from '@/app/components/authNav';
import Footer from '@/app/components/style-quiz/Footer';


type DynamicStep = { style: string; options: string[] };

const STATIC_STEPS = [
  "Personal Info",
  "What's Your Morning Like?",
  "How Do You Handle Plans?",
  "When Friends Are Late...",
  "Your Selfie Face Is...",
  "Planning Your Outfit...",
  "People Compliment You On...",
  "Body Type",
  "Size Preferences",
  "Style Preferences"
];

const StyleQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({ outfitAdventurous: [], goToStyle: [] });
  const [dynamicSteps, setDynamicSteps] = useState<DynamicStep[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('userId', id);
    }
    setUserId(id);
  }, []);

  const handleSendOtpClick = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await handleSendOtp(formValues.phone || '');
      if (error) {
        setError(error.message);
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError('An error occurred while sending OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtpClick = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await handleVerifyOtp(formValues.phone || '', formValues.otp || '');
      if (error) {
        setError(error.message);
      } else {
        console.log("verified otp");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (session && !sessionError) {
          await sendFormData();
          router.push("/recommendations");
        } else {
          setError('Session not available. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred while verifying OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendFormData = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!formValues.name  || !formValues.gender) {
        throw new Error('Please fill in all required fields');
      }

      const fitTags = generateFitTags({
        gender: formValues.gender,
        bodyType: formValues.bodyType || 'rectangle'
      });

      const personalityTags = generatePersonalityTags({
        alarmRings: formValues.alarmResponse?.toLowerCase() || '',
        friendCancels: formValues.cancelPlansResponse?.toLowerCase() || '',
        friendsLate: formValues.friendsLateResponse?.toLowerCase() || '',
        selfieFace: formValues.selfieFace?.toLowerCase() || '',
        planOutfit: formValues.outfitPlanning?.toLowerCase() || '',
        peopleCompliment: formValues.complimentOn?.toLowerCase() || ''
      });

      const patternTags = generatePatternTags({
        gender: formValues.gender,
        personalityTags,
        styleTypes: formValues.goToStyle || []
      });

      const userTags = [{
        personality_tags: personalityTags,
        pattern_tags: patternTags,
        fit_tags: fitTags,
      }];

      const cleanedData: StyleQuizData = {
        userId,
        name: formValues.name.trim(),
        phone: formValues.phone?.replace(/\D/g, '')||'',
        gender: formValues.gender,
        bodyType: formValues.bodyType,
        upperWear: formValues.upperWear,
        waistSize: formValues.waistSize,
        outfitAdventurous: formValues.outfitAdventurous || [],
        minimalistic: formValues.minimalistic,
        goToStyle: formValues.goToStyle || [],
        feedback: formValues.feedback?.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usertags: userTags,
        alarmresponse: formValues.alarmResponse,
        cancelplansresponse: formValues.cancelPlansResponse,
        friendslateresponse: formValues.friendsLateResponse,
        selfieface: formValues.selfieFace,
        outfitplanning: formValues.outfitPlanning,
        complimenton: formValues.complimentOn
      };

      dynamicSteps.forEach(({ style }) => {
        const key = `preferred_${style}`;
        if (formValues[key]) {
          cleanedData[key] = formValues[key];
        }
      });

      const { error: supabaseError } = await supabase
        .from('style-quiz')
        .upsert([cleanedData], {
          onConflict: 'userId',
          ignoreDuplicates: false
        });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your data');
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, userId, dynamicSteps]);

  const getTotalSteps = () => 10 + dynamicSteps.length + 4;

  const isStepValid = useCallback((): boolean => {
    if (currentStep === 1) return !!formValues.name && !!formValues.gender;
    if (currentStep >= 2 && currentStep <= 7) {
      const personalityIdx = currentStep - 2;
      const key = PERSONALITY_QUESTIONS[personalityIdx].key;
      return !!formValues[key];
    }
    if (currentStep === 8) return !!formValues.bodyType;
    if (currentStep === 9) return !!formValues.upperWear && !!formValues.waistSize;
    if (currentStep === 10) {
      return Array.isArray(formValues.goToStyle) && formValues.goToStyle.length > 0 &&
             Array.isArray(formValues.outfitAdventurous) && formValues.outfitAdventurous.length > 0 
           ;
    }
    if (currentStep > 10 && currentStep <= 10 + dynamicSteps.length) {
      const idx = currentStep - 11;
      const key = `preferred_${dynamicSteps[idx].style}`;
      return Array.isArray(formValues[key]) && formValues[key].length > 0;
    }
    const feedbackStep = 10 + dynamicSteps.length + 1;
    const otpSendStep = feedbackStep + 1;
    const minimalismStep = otpSendStep + 1;
    const otpVerifyStep = minimalismStep + 1;

    if (currentStep === feedbackStep) return true;
    if (currentStep === otpSendStep) return !!formValues.phone;
    if (currentStep === minimalismStep) return !!formValues.minimalistic;
    if (currentStep === otpVerifyStep) return !!formValues.otp;

    return currentStep === getTotalSteps();
  }, [currentStep, dynamicSteps, formValues]);

  const nextStep = async () => {
    if (!isStepValid()) return;
    await sendFormData();

    try {
      setError(null);
      setMaxCompletedStep(prev => Math.max(prev, currentStep));

      const feedbackStep = 10 + dynamicSteps.length + 1;
      const otpSendStep = feedbackStep + 1;
      const minimalismStep = otpSendStep + 1;
      const otpVerifyStep = minimalismStep + 1;

      if (currentStep === 10) {
        const selected = formValues.goToStyle || [];
        const generated = selected.map(style => {
          let options: string[] = [];
          const gender = formValues.gender || 'male';
          if (style === 'streetwear') {
            options = gender === 'male'
              ? ['tshirts', 'shirts', 'cargos', 'joggers and sweatpants', 'jeans', 'shorts']
              : ['cropped tees', 'tshirt and tanks', 'shirts', 'jeans', 'cargos', 'joggers and sweatpants', 'shorts'];
          } else if (style === 'business casual') {
            options = gender === 'male'
              ? ['shirts', 'blazers', 'jeans']
              : ['dresses', 'shirts', 'blouse', 'ethnic', 'blazers', 'pants and trousers', 'jeans', 'skirt'];
          } else if (style === 'athleisure') {
            options = ['tshirts', 'tank tops', 'joggers and sweatpants', 'shorts'];
          }
          return { style, options };
        });
        setDynamicSteps(generated);
      }

      if (currentStep === otpSendStep) {
        await handleSendOtpClick();
      }

      if (currentStep === otpVerifyStep) {
        await handleVerifyOtpClick();
        await sendFormData();
        return;
      }

      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Error in nextStep:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : undefined;

    setFormValues(prev => {
      const newVals = { ...prev };
      if (type === 'checkbox') {
        const arr = Array.isArray(prev[name]) ? [...prev[name]] : [];
        if (checked) arr.push(value);
        else arr.splice(arr.indexOf(value), 1);
        newVals[name] = arr;
      } else {
        newVals[name] = value;
      }
      return newVals;
    });
  }, []);

  const renderStepContent = () => {
    const content = (() => {
      if (currentStep === 1) {
        return <PersonalInfoStep formValues={formValues} handleChange={handleChange} />;
      }
      
      if (currentStep >= 2 && currentStep <= 7) {
        const personalityIdx = currentStep - 2;
        return (
          <PersonalityQuestionStep
            formValues={formValues}
            handleChange={handleChange}
            questionIndex={personalityIdx}
          />
        );
      }

      if (currentStep === 8) {
        return <BodyTypeStep formValues={formValues} handleChange={handleChange} />;
      }

      if (currentStep === 9) {
        return <SizePreferencesStep formValues={formValues} handleChange={handleChange} />;
      }

      if (currentStep === 10) {
        return (
          <div className="space-y-8">
            <GoToStyleStep formValues={formValues} handleChange={handleChange} />
            <div className="border-t pt-8">
              <StylePreferencesStep formValues={formValues} handleChange={handleChange} />
            </div>
          </div>
        );
      }

      if (currentStep > 10 && currentStep <= 10 + dynamicSteps.length) {
        const idx = currentStep - 11;
        const { style, options } = dynamicSteps[idx];
        const key = `preferred_${style}`;
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Select your preferred {style} items</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {options.map(option => (
                <label key={option} className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    name={key}
                    value={option}
                    checked={formValues[key]?.includes(option)}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <motion.div 
                    className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-colors`}
                    initial={false}
                    animate={{
                      scale: formValues[key]?.includes(option) ? 1.05 : 1,
                      backgroundColor: formValues[key]?.includes(option) ? '#007e90' : '#ffffff',
                      color: formValues[key]?.includes(option) ? '#ffffff' : '#374151',
                      borderColor: formValues[key]?.includes(option) ? '#007e90' : '#e5e7eb',
                    }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </motion.div>
                </label>
              ))}
            </div>
          </div>
        );
      }

      const feedbackStep = 10 + dynamicSteps.length + 1;
      const otpSendStep = feedbackStep + 1;
      const minimalismStep = otpSendStep + 1;
      const otpVerifyStep = minimalismStep + 1;

      if (currentStep === feedbackStep) {
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Any additional feedback or preferences?</span>
              <textarea
                name="feedback"
                value={formValues.feedback || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007e90] focus:ring-[#007e90]"
                rows={4}
                placeholder="Tell us anything else that might help us understand your style better..."
              />
            </label>
          </div>
        );
      }

      if (currentStep === otpSendStep) {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Verify Your Phone Number</h3>
            <p className="text-gray-600">Enter your phone number to receive a verification code.</p>
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formValues.phone || ''}
                onChange={handleChange}
                className="m-2 block w-full text-lg py-3 px-4 rounded-md border-gray-300 shadow-sm focus:border-[#007e90] focus:ring-[#007e90]"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        );
      }

      if (currentStep === minimalismStep) {
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Do you prefer minimalistic style?</label>
            <div className="grid grid-cols-2 gap-4">
              {['Yes', 'No'].map(option => (
                <label key={option} className="flex items-center justify-center">
                  <input
                    type="radio"
                    name="minimalistic"
                    value={option}
                    checked={formValues.minimalistic === option}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${formValues.minimalistic === option ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                    }`}>
                    {option}
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      }

      if (currentStep === otpVerifyStep) {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Enter Verification Code</h3>
            <p className="text-gray-600">We've sent a verification code to your phone. Please enter it below.</p>
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                type="text"
                name="otp"
                value={formValues.otp || ''}
                onChange={handleChange}
                className="m-2 block w-full text-lg py-3 px-4 rounded-md border-gray-300 shadow-sm focus:border-[#007e90] focus:ring-[#007e90] tracking-wider font-medium"
                placeholder="Enter the verification code"
                maxLength={6}
              />
            </div>
          </div>
        );
      }

      return null;
    })();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.2, 0.8, 0.2, 1] 
          }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthNav />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-1/3 bg-[#007e90] text-white p-5">
          <ul className="space-y-4 relative">
            <motion.div
              className="absolute w-px bg-white opacity-50 left-[29px] h-8"
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              animate={{
                top: `${(currentStep - 1) * 48}px`
              }}
            />
            {STATIC_STEPS.map((title, i) => (
              <li
                key={i}
                className={`flex items-center ${i + 1 === currentStep
                  ? 'bg-white text-[#007e90]'
                  : i + 1 <= maxCompletedStep
                    ? 'text-white'
                    : 'text-gray-300'
                  } p-2 rounded-lg`}
              >
                <div className={`w-8 h-8 border-2 flex items-center justify-center rounded-full ${i + 1 === currentStep
                  ? 'border-[#007e90]'
                  : 'border-white'
                  }`}>
                  {i + 1}
                </div>
                <span className="ml-2">{title}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); nextStep(); }} className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <div className="md:hidden bg-[#007e90] text-white p-4">
              <div className="flex items-start gap-6">
                <div className="relative shrink-0" style={{ width: '80px', height: '80px' }}>
                  <motion.div 
                    className="w-full h-full rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm"
                    style={{
                      background: `conic-gradient(
                        #4ade80 0%, 
                        #4ade80 ${(currentStep / getTotalSteps()) * 100}%, 
                        rgba(255, 255, 255, 0.2) ${(currentStep / getTotalSteps()) * 100}%, 
                        rgba(255, 255, 255, 0.2) 100%
                      )`,
                      padding: '3px'
                    }}
                    initial={false}
                    animate={{
                      background: `conic-gradient(
                        #4ade80 0%, 
                        #4ade80 ${(currentStep / getTotalSteps()) * 100}%, 
                        rgba(255, 255, 255, 0.2) ${(currentStep / getTotalSteps()) * 100}%, 
                        rgba(255, 255, 255, 0.2) 100%
                      )`
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <div className="w-full h-full rounded-full bg-[#007e90] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs md:text-sm text-white/90">Step</div>
                        <div className="text-base md:text-lg font-bold text-white">{currentStep}<span className="text-xs md:text-sm font-normal"> of {getTotalSteps()}</span></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-xl font-semibold text-white break-words">
                    {STATIC_STEPS[currentStep - 1] || 'Additional Thoughts'}
                  </h2>
                  <p className="text-sm md:text-base text-white/80 mt-1">
                    {(() => {
                      if (currentStep === 1) {
                        return "Let's start with your basic details";
                      } else if (currentStep >= 2 && currentStep <= 7) {
                        return "Help us understand your personality better";
                      } else if (currentStep === 8) {
                        return "Select the option that best describes your body type";
                      } else if (currentStep === 9) {
                        return "Tell us your preferred sizes for a perfect fit";
                      } else if (currentStep === 10) {
                        return "Choose the styles that match your vibe";
                      } else if (currentStep === 10 + dynamicSteps.length + 1) {
                        return "Share any additional preferences with us";
                      } else if (currentStep === 10 + dynamicSteps.length + 2) {
                        return "Almost there! Let's verify your phone number";
                      } else if (currentStep === 10 + dynamicSteps.length + 3) {
                        return "Do you prefer keeping things simple?";
                      } else if (currentStep === 10 + dynamicSteps.length + 4) {
                        return "Enter the verification code sent to your phone";
                      } else if (currentStep > 10 && currentStep <= 10 + dynamicSteps.length) {
                        const styleIndex = currentStep - 11;
                        const style = dynamicSteps[styleIndex]?.style;
                        return `Pick your favorite ${style} items`;
                      }
                      return "";
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Global styles for form inputs */}
            <style jsx global>{`
              input[type="text"],
              input[type="tel"],
              input[type="email"],
              input[type="number"],
              textarea {
                color: #000000 !important;
                font-size: 14px !important;
              }
              @media (min-width: 768px) {
                input[type="text"],
                input[type="tel"],
                input[type="email"],
                input[type="number"],
                textarea {
                  font-size: 16px !important;
                }
              }
              input::placeholder,
              textarea::placeholder {
                color: #6B7280;
                opacity: 1;
              }
              .form-input {
                color: #000000 !important;
              }
            `}</style>

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              <div className="content p-4 md:p-8 pb-24">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm md:text-base text-red-600">{error}</p>
                  </div>
                )}

                <div className="max-w-3xl mx-auto">
                  {renderStepContent()}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="max-w-3xl mx-auto px-4 py-4 md:px-8">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors font-medium"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={!isStepValid() || isSubmitting}
                      className="px-6 py-2.5 bg-[#007e90] text-white rounded-lg disabled:opacity-50 hover:bg-[#006d7d] transition-colors font-medium"
                    >
                      {isSubmitting ? 'Saving...' : currentStep === getTotalSteps() ? 'Submit' : 'Next'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StyleQuiz;
