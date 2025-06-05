"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { generateFitTags, generatePersonalityTags, generatePrintTags } from '@/app/utils/usermapping';
import { useRouter } from 'next/navigation';
import { PERSONALITY_QUESTIONS, handleSendOtp, handleVerifyOtp } from '@/app/utils/styleQuizUtils';
import PersonalInfoStep from '@/app/components/style-quiz/PersonalInfoStep';
import BodyTypeStep from '@/app/components/style-quiz/BodyTypeStep';
import SizePreferencesStep from '@/app/components/style-quiz/SizePreferencesStep';
import StylePreferencesStep from '@/app/components/style-quiz/StylePreferencesStep';
import GoToStyleStep from '@/app/components/style-quiz/GoToStyleStep';
import PersonalityQuestionStep from '@/app/components/style-quiz/PersonalityQuestionStep';
//import OtpVerificationStep from '@/app/components/style-quiz/OtpVerificationStep';
import { FormValues } from '@/app/data/stylequizInterface';
import { StyleQuizData } from '@/app/data/stylequizInterface';
import { motion, AnimatePresence } from 'framer-motion';
import AuthNav from '@/app/components/authNav';
import DynamicStylePreferenceStep from '@/app/components/style-quiz/DynamicStylePreferenceStep';
import ColorAnalyzer from '@/app/components/style-quiz/ColorAnalysis';
type DynamicStep = { style: string; options: string[] };

const STATIC_STEPS = [
  "Personal Info",
  "Your Main Character Energy",
  "Your Wardrobe Aesthetic",
  "Your Boss Mode Vibes",
  "Form Check",
  "Fit Check",
  "Your Style DNA",
];

const getDynamicStepHeading = (style: string): string => {
  switch (style.toLowerCase()) {
    case 'business casual':
      return 'Formal Feels';
    case 'streetwear':
      return 'Street Style Check';
    case 'athleisure':
      return 'Active Mood';
    default:
      return `${style.charAt(0).toUpperCase() + style.slice(1)} Style`;
  }
};

const getFinalStepHeading = (step: number, totalDynamicSteps: number): string => {
  const finalStepsStart = STATIC_STEPS.length + totalDynamicSteps;
  const stepPosition = step - finalStepsStart;
  
  switch (stepPosition) {
    case 1:
      return 'Style Personality';
    case 2:
      return  `Let's Get to Know Your Skin Tone` ;
    case 3:
      return 'Fashion Secrets Safe';
    case 4:
      return 'The Final Bits';
    case 5:
      return 'Almost There';
    default:
      return 'Additional Thoughts';
  }
};

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
          // Add user data to users table
          const { error: userError } = await supabase
            .from('users')
            .upsert([{
              userid: session?.user.id,
              phoneNumber: session?.user.phone,
              created_at: new Date().toISOString()
            }],{
              onConflict: 'userid',
            });

          if (userError) {
            console.error('Error saving user data:', userError);
            setError('Failed to save user data. Please try again.');
            return;
          }

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

      if (!formValues.name || !formValues.gender) {
        throw new Error('Please fill in all required fields');
      }

      console.log("Form values for fit tags:", {
        gender: formValues.gender,
        bodyType: formValues.bodyType || 'rectangle'
      });

      const fitTags = generateFitTags({
        gender: formValues.gender,
        bodyType: formValues.bodyType || 'rectangle'
      });

      console.log("Generated fit tags:", fitTags);

      const personalityTags = generatePersonalityTags({
        weekendPreference: formValues.weekendPreference,
        shoppingStyle: formValues.shoppingStyle,
        workspaceStyle: formValues.workspaceStyle,
        friendCompliments: formValues.friendCompliments,
        workOutfit: formValues.workOutfit,
        wardrobeContent: formValues.wardrobeContent
      });

      const printCharacteristics = generatePrintTags({
        gender: formValues.gender,
        personalityTags,
        styleTypes: formValues.goToStyle || []
      });

      // Parse color analysis data if it exists
      let colorAnalysisData = null;
      if (formValues.colorAnalysis) {
        try {
          colorAnalysisData = JSON.parse(formValues.colorAnalysis);
          console.log("Color Analysis Data:", colorAnalysisData);
        } catch (e) {
          console.error("Error parsing color analysis data:", e);
        }
      }

      const userTags = [{
        personality_tags: personalityTags,
        fit_tags_upper: fitTags.upperWear,
        fit_tags_lower: fitTags.lowerWear,
        fit_tags_full: fitTags.fullBody,
        print_type_tags: printCharacteristics.printTypes,
        print_scale_tags: printCharacteristics.printScales,
        print_density_tags: printCharacteristics.printDensities,
        pattern_placement_tags: printCharacteristics.patternPlacements,
        surface_texture_tags: printCharacteristics.surfaceTextures
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
        weekendPreference: formValues.weekendPreference,
        shoppingStyle: formValues.shoppingStyle,
        workspaceStyle: formValues.workspaceStyle,
        friendCompliments: formValues.friendCompliments,
        workOutfit: formValues.workOutfit,
        wardrobeContent: formValues.wardrobeContent,
        colorAnalysis: colorAnalysisData // Add color analysis data directly to the main object
      };

      dynamicSteps.forEach(({ style }) => {
        const key = `preferred_${style}`;
        if (formValues[key]) {
          cleanedData[key] = formValues[key];
        }
      });

      console.log("Sending data to Supabase:", {
        ...cleanedData,
        colorAnalysis: colorAnalysisData // Log color analysis data separately for clarity
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

  const getTotalSteps = () => 8 + dynamicSteps.length + 5;

  const isStepValid = useCallback((): boolean => {
    if (currentStep === 1) return !!formValues.name && !!formValues.gender;
    
    // Handle personality questions (steps 2-4)
    if (currentStep >= 2 && currentStep <= 4) {
      const personalityIdx = (() => {
        switch (currentStep) {
          case 2: return 0; // Personality group
          case 3: return 2; // Social group
          case 4: return 4; // Work group
          default: return 0;
        }
      })();
      
      const question = PERSONALITY_QUESTIONS[personalityIdx];
      
      // Validate all questions in the group
      const groupQuestions = PERSONALITY_QUESTIONS.filter(q => q.group === question.group);
      return groupQuestions.every(q => !!formValues[q.key]);
    }

    if (currentStep === 5) return !!formValues.bodyType;
    if (currentStep === 6) return !!formValues.upperWear && !!formValues.waistSize;
    if (currentStep === 7) {
      return Array.isArray(formValues.goToStyle) && formValues.goToStyle.length > 0;
    }

    // Dynamic steps come right after Go To Style (step 7)
    if (currentStep > 7 && currentStep <= 7 + dynamicSteps.length) {
      const idx = currentStep - 8;
      const key = `preferred_${dynamicSteps[idx].style}`;
      return Array.isArray(formValues[key]) && formValues[key].length > 0;
    }

    const minimalismStep = 7 + dynamicSteps.length + 1;
    const colorAnalysisStep = minimalismStep + 1;
    const otpSendStep = colorAnalysisStep + 1;
    const feedbackStep = otpSendStep + 1;
    const otpVerifyStep = feedbackStep + 1;

    if (currentStep === minimalismStep) return !!formValues.minimalistic;
    if (currentStep === colorAnalysisStep) {
      try {
        const colorAnalysisData = formValues.colorAnalysis ? JSON.parse(formValues.colorAnalysis as string) : null;
        return colorAnalysisData?.isComplete === true;
      } catch {
        return false;
      }
    }
    if (currentStep === otpSendStep) return !!formValues.phone;
    if (currentStep === otpVerifyStep) return !!formValues.otp;
    if (currentStep === feedbackStep) return true;

    return currentStep === getTotalSteps();
  }, [currentStep, dynamicSteps, formValues]);

  const nextStep = async () => {
    if (!isStepValid()) return;
    await sendFormData();

    try {
      setError(null);
      setMaxCompletedStep(prev => Math.max(prev, currentStep));

      // Generate dynamic steps right after Go To Style step (step 7)
      if (currentStep === 7) {
        const selected = formValues.goToStyle || [];
        const generated = selected.map(style => ({
          style,
          options: Array.isArray(selected) ? selected.map((_, i) => `option_${i + 1}`) : []
        }));
        setDynamicSteps(generated);
      }

      const minimalismStep = 7 + dynamicSteps.length + 1;
      const colorAnalysisStep = minimalismStep + 1;
      const otpSendStep = colorAnalysisStep + 1;
      const feedbackStep = otpSendStep + 1;
      const otpVerifyStep = feedbackStep + 1;

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

    // Debug the current state
    console.log(`handleChange: ${name}=${value}, currentStep=${currentStep}`);

    // Update form values first
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

    // Auto-next for single-option questions (radio buttons)
    if (type === 'radio') {
      // Skip auto-next for steps that need multiple inputs or selections
      const skipAutoNext = [
        'name', // Name is required
        'gender',
        'phone', // Phone number needs a "Next" click to confirm
        'otp',   // OTP verification needs a "Next" click to confirm
        'feedback', // Feedback is optional
        'colorAnalysis',
        'minimalistic', // Color analysis needs explicit next button click
       // Size preferences step has multiple inputs
       // Size preferences step has multiple inputs
      ].includes(name);

      // Also skip if the step is the GoToStyle step (multiple checkboxes)
      const isGoToStyleStep = currentStep === 7;
      
      // Or if it's a dynamic style preference step (multiple options)
      const isDynamicStyleStep = currentStep > 7 && currentStep <= 7 + dynamicSteps.length;
      
      if(currentStep===2){
        const updatedValues = {...formValues, [name]: value};
        const bothPersonalityQuestionsAnswered = 
          !!updatedValues.weekendPreference  && !!updatedValues.friendCompliments;
        if(!bothPersonalityQuestionsAnswered){
          console.log("Not auto-advancing yet - waiting for both personality questions to be answered");
          return; // Skip auto-next until both are answered
        }
      }
      
      // Special handling for step 3 (social questions)
      if (currentStep === 3) {
        // Check if both social questions are answered after this update
        const updatedValues = {...formValues, [name]: value};
        const bothSocialQuestionsAnswered = 
          !!updatedValues.shoppingStyle && !!updatedValues.wardrobeContent;
        
        if (!bothSocialQuestionsAnswered) {
          console.log("Not auto-advancing yet - waiting for both social questions to be answered");
          return; // Skip auto-next until both are answered
        }
      }

      if(currentStep===4){
        const updatedValues = {...formValues, [name]: value};
        const bothWorkQuestionsAnswered = 
          !!updatedValues.workspaceStyle && !!updatedValues.workOutfit;
        if(!bothWorkQuestionsAnswered){
          console.log("Not auto-advancing yet - waiting for both work questions to be answered");
          return; // Skip auto-next until both are answered
        }
      }

      if(currentStep==6){
        const updatedValues = {...formValues, [name]: value};
        const bothSizeQuestionsAnswered = 
          !!updatedValues.upperWear && !!updatedValues.waistSize;
        
        if (!bothSizeQuestionsAnswered) {
          console.log("Not auto-advancing yet - waiting for both size questions to be answered");
          return; // Skip auto-next until both are answered
        }
      }
      
    
      
      if (!skipAutoNext && !isGoToStyleStep && !isDynamicStyleStep) {
        // Auto advance for most radio button selections
        console.log(`Will auto-advance after selecting ${name}=${value} at step ${currentStep}`);
        
        // Add a small delay to allow state to update
        setTimeout(async () => {
          console.log(`Auto-advancing now from step ${currentStep}`);
          
          try {
            // First save the data
            await sendFormData();
            console.log("Data saved successfully");
            
            // Directly advance the step without validation
            console.log(`Advancing from ${currentStep} to ${currentStep + 1}`);
            setCurrentStep(prev => prev + 1);
            setMaxCompletedStep(prev => Math.max(prev, currentStep));
          } catch (error) {
            console.error('Error during auto-advance:', error);
          }
        }, 500);
      }
    }
  }, [sendFormData, currentStep, setCurrentStep, setMaxCompletedStep, formValues]);

  const renderStepContent = () => {
    const content = (() => {
      if (currentStep === 1) {
        return <PersonalInfoStep formValues={formValues} handleChange={handleChange} />;
      }
      
      // Handle personality questions (steps 2-4)
      if (currentStep >= 2 && currentStep <= 4) {
        const personalityIdx = (() => {
          switch (currentStep) {
            case 2: return 0; // Personality group
            case 3: return 2; // Social group
            case 4: return 4; // Work group
            default: return 0;
          }
        })();

        return (
          <PersonalityQuestionStep
            formValues={formValues}
            handleChange={handleChange}
            questionIndex={personalityIdx}
            onOptionSelect={() => nextStep()}
          />
        );
      }

      if (currentStep === 5) {
        return <BodyTypeStep formValues={formValues} handleChange={handleChange} />;
      }

      if (currentStep === 6) {
        return <SizePreferencesStep formValues={formValues} handleChange={handleChange} />;
      }

      if (currentStep === 7) {
        return (
          <div className="space-y-8">
            <GoToStyleStep formValues={formValues} handleChange={handleChange} />
          </div>
        );
      }

      // Dynamic steps come immediately after Go To Style (step 7)
      if (currentStep > 7 && currentStep <= 7 + dynamicSteps.length) {
        const idx = currentStep - 8;
        const { style } = dynamicSteps[idx];
        return <DynamicStylePreferenceStep style={style} formValues={formValues} handleChange={handleChange} />;
      }

      // Minimalistic step comes after dynamic steps
      const minimalismStep = 7 + dynamicSteps.length + 1;
      const colorAnalysisStep = minimalismStep + 1;
      const otpSendStep = colorAnalysisStep + 1;
      const feedbackStep = otpSendStep + 1;
      const otpVerifyStep = feedbackStep + 1;

      if (currentStep === minimalismStep) {
        return (
          <div>
            <label className="block text-[25px] text-gray-700 mb-4">Do you prefer a minimalistic look?</label>
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
                  <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all text-[14px] ${formValues.minimalistic === option ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                    }`}>
                    {option}
                  </div>
                </label>
              ))}
            </div>
            <div className="border-t pt-8">
              <StylePreferencesStep formValues={formValues} handleChange={handleChange} />
            </div>
          </div>
        );
      }

      if (currentStep === colorAnalysisStep) {
        return <ColorAnalyzer formValues={formValues} handleChange={handleChange} />;
      }

      if (currentStep === otpSendStep) {
        return (
          <div className="space-y-4">
            <h3 className="text-[25px] font-medium text-gray-900">Enter your Phone Number</h3>
            <p className="text-[14px] text-gray-600">We'll send you a verification code to secure your account.</p>
            <div className="mt-8">
              <input
                type="tel"
                name="phone"
                value={formValues.phone || ''}
                onChange={handleChange}
                className="m-2 block w-full text-[14px] py-3 px-4 rounded-md border-gray-300 shadow-sm focus:border-[#007e90] focus:ring-[#007e90]"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        );
      }

      if (currentStep === feedbackStep) {
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="block text-[25px] text-gray-700 mb-4">Tell us more you would like us to know</span>
              <textarea
                name="feedback"
                value={formValues.feedback || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007e90] focus:ring-[#007e90] text-[14px]"
                rows={4}
                placeholder="Share any additional preferences or requirements..."
              />
            </label>
          </div>
        );
      }

      

      if (currentStep === otpVerifyStep) {
        return (
          <div className="space-y-4">
            <h3 className="text-[25px] font-medium text-gray-900">Enter Verification Code</h3>
            <p className="text-[14px] text-gray-600">We've sent a verification code to your phone. Please enter it below.</p>
            <div className="mt-8">
              <label className="block text-[14px] font-medium text-gray-700">Verification Code</label>
              <input
                type="text"
                name="otp"
                value={formValues.otp || ''}
                onChange={handleChange}
                className="m-2 block w-full text-[14px] py-3 px-4 rounded-md border-gray-300 shadow-sm focus:border-[#007e90] focus:ring-[#007e90] tracking-wider"
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
    <div className="min-h-[calc(100vh-64px)] flex flex-col bg-white">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-1/3 bg-[#007e90] text-white p-5 overflow-y-auto h-[calc(100vh-64px)]">
          <ul className="space-y-4 relative">
            {[...STATIC_STEPS, 
              ...dynamicSteps.map(step => getDynamicStepHeading(step.style)),
              'Style Personality',
              `Let's Get to Know Your Skin Tone`,
              'Fashion Secrets Safe',
              'The Final Bits',
              'Almost There'
            ].map((title, i) => (
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
        <main className="flex-1 flex flex-col h-[calc(100vh-64px)]">
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
                    {currentStep <= STATIC_STEPS.length 
                      ? STATIC_STEPS[currentStep - 1] 
                      : currentStep <= STATIC_STEPS.length + dynamicSteps.length
                        ? getDynamicStepHeading(dynamicSteps[currentStep - STATIC_STEPS.length - 1].style)
                        : getFinalStepHeading(currentStep, dynamicSteps.length)}
                  </h2>
                  <p className="text-sm md:text-base text-white/80 mt-1">
                    {(() => {
                      if (currentStep === 1) {
                        return "Let's start with your basic details";
                      } else if (currentStep >= 2 && currentStep <= 4) {
                        return "Help us understand your personality better";
                      } else if (currentStep === 5) {
                        return "Select the option that best describes your body type";
                      } else if (currentStep === 6) {
                        return "Tell us your preferred sizes for a perfect fit";
                      } else if (currentStep === 7) {
                        return "Choose the styles that match your vibe";
                      } else if (currentStep === 8) {
                        return "Share any additional preferences with us";
                      } else if (currentStep === 8 + dynamicSteps.length + 1) {
                        return "Help us to recommend the best products for you";
                      } else if (currentStep === 8 + dynamicSteps.length + 2) {
                        return "Almost there! Let's verify your phone number";
                       
                      } else if (currentStep === 8 + dynamicSteps.length + 3) {
                        return"Help us to know what's on your mind";
                     
                      } else if (currentStep === 8 + dynamicSteps.length + 4) {
                        return "Enter the verification code sent to your phone";
                      }
                      else if (currentStep > 8 && currentStep <= 8 + dynamicSteps.length) {
                        const styleIndex = currentStep - 9;
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
            <div className="flex-1 min-h-0 relative">
              <div className="absolute inset-0 overflow-y-auto">
                <div className="p-4 md:p-8 pb-32">
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
            </div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
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
    </div>
  );
};

export default StyleQuiz;
