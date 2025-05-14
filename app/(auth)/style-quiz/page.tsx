"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { generateFitTags, generatePersonalityTags, generatePatternTags } from '@/app/utils/usermapping';
import { useRouter } from 'next/navigation';
import { STATIC_STEPS, PERSONALITY_QUESTIONS, handleSendOtp, handleVerifyOtp } from '@/app/utils/styleQuizUtils';
import PersonalInfoStep from '@/app/components/style-quiz/PersonalInfoStep';
import BodyTypeStep from '@/app/components/style-quiz/BodyTypeStep';
import SizePreferencesStep from '@/app/components/style-quiz/SizePreferencesStep';
import StylePreferencesStep from '@/app/components/style-quiz/StylePreferencesStep';
import GoToStyleStep from '@/app/components/style-quiz/GoToStyleStep';
import PersonalityQuestionStep from '@/app/components/style-quiz/PersonalityQuestionStep';
import OtpVerificationStep from '@/app/components/style-quiz/OtpVerificationStep';

interface FormValues {
  name?: string;
  phone?: string;
  gender?: string;
  bodyType?: string;
  upperWear?: string;
  waistSize?: string;
  outfitAdventurous?: string[];
  minimalistic?: string;
  goToStyle?: string[];
  feedback?: string;
  alarmResponse?: string;
  cancelPlansResponse?: string;
  friendsLateResponse?: string;
  selfieFace?: string;
  outfitPlanning?: string;
  complimentOn?: string;
  otp?: string;
  [key: string]: any;
}

interface StyleQuizData {
  userId: string;
  name: string;
  phone: string;
  gender: string;
  bodyType?: string;
  upperWear?: string;
  waistSize?: string;
  outfitAdventurous: string[];
  minimalistic?: string;
  goToStyle: string[];
  feedback?: string;
  created_at: string;
  updated_at: string;
  fittags?: string[];
  personalitytags?: string[];
  patterntags?: string[];
  alarmresponse?: string;
  cancelplansresponse?: string;
  friendslateresponse?: string;
  selfieface?: string;
  outfitplanning?: string;
  complimenton?: string;
  [key: string]: any;
}

type DynamicStep = { style: string; options: string[] };

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

      if (!formValues.name || !formValues.phone || !formValues.gender) {
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
        phone: formValues.phone.replace(/\D/g, ''),
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

  const getTotalSteps = () => 5 + dynamicSteps.length + PERSONALITY_QUESTIONS.length + 1;

  const isStepValid = useCallback((): boolean => {
    if (currentStep <= 5) {
      switch (currentStep) {
        case 1: return !!formValues.name && !!formValues.gender;
        case 2: return !!formValues.bodyType;
        case 3: return !!formValues.upperWear && !!formValues.waistSize;
        case 4: return Array.isArray(formValues.outfitAdventurous) && formValues.outfitAdventurous.length > 0 && !!formValues.minimalistic;
        case 5: return Array.isArray(formValues.goToStyle) && formValues.goToStyle.length > 0;
        default: return false;
      }
    }
    if (currentStep > 5 && currentStep <= 5 + dynamicSteps.length) {
      const idx = currentStep - 6;
      const key = `preferred_${dynamicSteps[idx].style}`;
      return Array.isArray(formValues[key]) && formValues[key].length > 0;
    }
    const personalityIdx = currentStep - (5 + dynamicSteps.length) - 1;
    if (personalityIdx >= 0 && personalityIdx < PERSONALITY_QUESTIONS.length) {
      const key = PERSONALITY_QUESTIONS[personalityIdx].key;
      return !!formValues[key];
    }
    return currentStep === getTotalSteps();
  }, [currentStep, dynamicSteps, formValues]);

  const nextStep = async () => {
    if (!isStepValid()) return;

    try {
      setError(null);
      setMaxCompletedStep(prev => Math.max(prev, currentStep));

      if (currentStep === 5) {
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

      if (currentStep === getTotalSteps()) {
        if (!otpSent) {
          await handleSendOtpClick();
          return;
        } else {
          await handleVerifyOtpClick();
          return;
        }
      }

      await sendFormData();

      if (currentStep === getTotalSteps()) {
        alert('Thank you for completing the style quiz!');
        localStorage.removeItem('userId');
        window.location.reload();
        return;
      }

      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Error in nextStep:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : undefined;

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
    if (currentStep <= 5) {
      switch (currentStep) {
        case 1:
          return <PersonalInfoStep formValues={formValues} handleChange={handleChange} />;
        case 2:
          return <BodyTypeStep formValues={formValues} handleChange={handleChange} />;
        case 3:
          return <SizePreferencesStep formValues={formValues} handleChange={handleChange} />;
        case 4:
          return <StylePreferencesStep formValues={formValues} handleChange={handleChange} />;
        case 5:
          return <GoToStyleStep formValues={formValues} handleChange={handleChange} />;
        default:
          return null;
      }
    }

    if (currentStep > 5 && currentStep <= 5 + dynamicSteps.length) {
      const idx = currentStep - 6;
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
                <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${formValues[key]?.includes(option) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                  }`}>
                  {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }

    const personalityIdx = currentStep - (5 + dynamicSteps.length) - 1;
    if (personalityIdx >= 0 && personalityIdx < PERSONALITY_QUESTIONS.length) {
      return (
        <PersonalityQuestionStep
          formValues={formValues}
          handleChange={handleChange}
          questionIndex={personalityIdx}
        />
      );
    }

    return (
      <OtpVerificationStep
        formValues={formValues}
        handleChange={handleChange}
        otpSent={otpSent}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-1/3 bg-[#007e90] text-white p-3 md:p-5 md:min-h-screen">
        <ul className="flex md:block overflow-x-auto md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-4">
          {STATIC_STEPS.concat(
            dynamicSteps.map(ds => `Preferred ${ds.style}`),
            PERSONALITY_QUESTIONS.map(q => q.label),
            ['Additional Thoughts']
          ).map((title, i) => (
            <li
              key={i}
              className={`flex items-center shrink-0 ${i + 1 === currentStep
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
              <span className="hidden md:inline ml-2">{title}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-4 md:p-8 relative">
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); nextStep(); }} className="h-full flex flex-col justify-between">
          <div className="content overflow-auto mb-20">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              {STATIC_STEPS[currentStep - 1] ||
                (currentStep > 5 && currentStep <= 5 + dynamicSteps.length
                  ? `Preferred ${dynamicSteps[currentStep - 6].style}`
                  : currentStep > 5 + dynamicSteps.length
                    ? PERSONALITY_QUESTIONS[currentStep - 6 - dynamicSteps.length]?.label
                    : 'Additional Thoughts')}
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="max-w-3xl mx-auto">
              {renderStepContent()}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:absolute md:border-0">
            <div className="flex justify-between max-w-3xl mx-auto">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="px-4 md:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={!isStepValid() || isSubmitting}
                className="px-4 md:px-6 py-2 bg-[#007e90] text-white rounded-lg disabled:opacity-50 hover:bg-[#006d7d] transition-colors"
              >
                {isSubmitting ? 'Saving...' : currentStep === getTotalSteps() ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default StyleQuiz;
