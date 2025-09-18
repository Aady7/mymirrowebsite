"use client";
import React, { useState, useEffect } from 'react';
import PersonalInfo, { PersonalInfoData } from '@/app/components/style-quiz-new/personalInfo';
import BodyType, { BodyTypeData } from '@/app/components/style-quiz-new/bodytype';
import ColorAnalysis, { ColorAnalysisData } from '@/app/components/style-quiz-new/colorAnalysis';
import StyleOrigin, { StyleOriginData } from '@/app/components/style-quiz-new/styleorigin';
import StyleVibe, { StyleVibeData } from '@/app/components/style-quiz-new/styleVibe';
import AnsQuestion, { AnsQuestionData } from '@/app/components/style-quiz-new/ansQuestion';
import OutfitSwipe, { SwipeResultData } from '@/app/components/style-quiz-new/outfitSwipe';
import ContactVerification, { ContactVerificationData } from '@/app/components/style-quiz-new/contactVerification';
import OtpVerification, { OtpVerificationData } from '@/app/components/style-quiz-new/otpVerification';
import { storeQuizDataLocally, getQuizDataFromStorage, clearQuizDataFromStorage, getStyleQuizData } from '@/app/utils/styleQuizUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Tracking utility functions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const trackEvent = (eventName: string, parameters?: any) => {
  try {
    // GTM/Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Style Quiz',
        ...parameters
      });
    }

    // Facebook Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
    }

    console.log(`Tracking event: ${eventName}`, parameters);
  } catch (error) {
    console.error('Tracking error:', error);
  }
};

interface StyleQuizState {
  currentStep: number;
  personalInfo: PersonalInfoData | null;
  bodyType: BodyTypeData | null;
  colorAnalysis: ColorAnalysisData | null;
  styleOrigin: StyleOriginData | null;
  styleVibe: StyleVibeData | null;
  ansQuestion: AnsQuestionData | null;
  outfitSwipe: SwipeResultData | null;
  contactVerification: ContactVerificationData | null;
  otpVerification: OtpVerificationData | null;
  isRetake?: boolean; // Flag to indicate if this is a quiz retake
  // Add more steps as needed
}

const StyleQuizPages = () => {
  const { getSession } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [existingQuizData, setExistingQuizData] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  
  const [quizState, setQuizState] = useState<StyleQuizState>({
    currentStep: 1,
    personalInfo: null,
    bodyType: null,
    colorAnalysis: null,
    styleOrigin: null,
    styleVibe: null,
    ansQuestion: null,
    outfitSwipe: null,
    contactVerification: null,
    otpVerification: null,
  });

  // Calculate total steps and flow type based on style origin selections and authentication status
  const getTotalSteps = () => {
    if (!quizState.styleOrigin?.styleOrigin) {
      // Default total steps - reduce by 2 if authenticated (skip contact verification and OTP)
      return isAuthenticated ? 7 : 9;
    }
    
    const selectedStyles = quizState.styleOrigin.styleOrigin;
    const hasInspiredByVibe = selectedStyles.includes('inspired-by-vibe');
    const hasSelfExpressive = selectedStyles.includes('self-expressive');
    const hasTrendFocused = selectedStyles.includes('trend-focused');
    
    // If user selected only trend-focused, skip styleVibe and ansQuestion steps
    if (hasTrendFocused && !hasInspiredByVibe && !hasSelfExpressive) {
      // PersonalInfo(1) -> BodyType(2) -> ColorAnalysis(3) -> StyleOrigin(4) -> OutfitSwipe(5) 
      // + ContactVerification(6) -> OtpVerification(7) for non-authenticated
      // + No additional steps for authenticated users
      return isAuthenticated ? 5 : 7;
    }
    
    // If user selected inspired-by-vibe or self-expressive (with or without trend-focused), show all steps
    // PersonalInfo(1) -> BodyType(2) -> ColorAnalysis(3) -> StyleOrigin(4) -> StyleVibe(5) -> AnsQuestion(6) -> OutfitSwipe(7)
    // + ContactVerification(8) -> OtpVerification(9) for non-authenticated
    // + No additional steps for authenticated users
    return isAuthenticated ? 7 : 9;
  };

  // Determine if user has extended flow (inspired-by-vibe or self-expressive)
  const hasExtendedFlow = () => {
    if (!quizState.styleOrigin?.styleOrigin) {
      return false;
    }
    
    const selectedStyles = quizState.styleOrigin.styleOrigin;
    const hasInspiredByVibe = selectedStyles.includes('inspired-by-vibe');
    const hasSelfExpressive = selectedStyles.includes('self-expressive');
    
    return hasInspiredByVibe || hasSelfExpressive;
  };

  const totalSteps = getTotalSteps();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      setIsCheckingAuth(true);
      try {
        const { session } = await getSession();
        
        if (session?.user) {
          console.log('User is authenticated:', session.user.id);
          setIsAuthenticated(true);
          setUserEmail(session.user.email || '');
          
          // Try to fetch existing quiz data for authenticated users
          try {
            const { data: existingQuiz } = await getStyleQuizData();
            if (existingQuiz) {
              console.log('Found existing quiz data for user:', existingQuiz);
              setExistingQuizData(existingQuiz);
              
              // Automatically proceed with quiz retake for existing users
              console.log('User has existing quiz, proceeding with retake');
              setQuizState(prev => ({ ...prev, isRetake: true }));
              trackEvent('quiz_retake_started', {
                event_label: 'Quiz Retake Started',
                existing_quiz_id: existingQuiz.id
              });
            }
          } catch (error) {
            console.log('No existing quiz data found, starting fresh quiz');
          }
        } else {
          console.log('User is not authenticated');
          setIsAuthenticated(false);
        }
        
        // Load quiz data from local storage
        const savedData = getQuizDataFromStorage();
        if (savedData) {
          // Check if the quiz was already completed
          if (savedData.otpVerification?.isVerified) {
            // Quiz was completed, clear the data and start fresh
            console.log('Quiz was already completed, starting fresh...');
            clearQuizDataFromStorage();
            setQuizState({
              currentStep: 1,
              personalInfo: null,
              bodyType: null,
              colorAnalysis: null,
              styleOrigin: null,
              styleVibe: null,
              ansQuestion: null,
              outfitSwipe: null,
              contactVerification: null,
              otpVerification: null,
              isRetake: quizState.isRetake,
            });
            
            // Track quiz restart
            trackEvent('quiz_restart', {
              event_label: 'Quiz Restarted After Completion'
            });
          } else {
            // Quiz was not completed, restore the saved state
            setQuizState(prev => ({ ...savedData, isRetake: prev.isRetake }));
            console.log('Loaded quiz data from local storage:', savedData);
            
            // Track quiz resume
            trackEvent('quiz_resume', {
              event_label: 'Quiz Resumed',
              step: savedData.currentStep,
              total_steps: totalSteps
            });
          }
        } else {
          // Track quiz start for new users
          trackEvent('quiz_start', {
            event_label: session?.user ? 'Authenticated Quiz Started' : 'Guest Quiz Started',
            step: 1,
            total_steps: totalSteps,
            is_authenticated: !!session?.user
          });
        }
        
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndLoadData();
  }, []);

  // Save quiz data to local storage whenever quiz state changes
  useEffect(() => {
    // Only save if we have some data (not initial empty state) and quiz is not completed
    // Also don't save if we're on the final OTP step to prevent completion state from being saved
    if ((quizState.personalInfo || quizState.bodyType || quizState.colorAnalysis) && 
        !quizState.otpVerification?.isVerified && 
        quizState.currentStep < totalSteps) {
      storeQuizDataLocally(quizState);
    }
  }, [quizState, totalSteps]);

  // Function to reset quiz to start
  const resetQuiz = () => {
    // Track quiz reset/abandonment
    trackEvent('quiz_reset', {
      event_label: 'Quiz Reset - Start Over',
      from_step: quizState.currentStep,
      total_steps: totalSteps,
      completion_rate: ((quizState.currentStep / totalSteps) * 100).toFixed(2)
    });
    
    clearQuizDataFromStorage();
    setQuizState({
      currentStep: 1,
      personalInfo: null,
      bodyType: null,
      colorAnalysis: null,
      styleOrigin: null,
      styleVibe: null,
      ansQuestion: null,
      outfitSwipe: null,
      contactVerification: null,
      otpVerification: null,
    });
  };

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    console.log('Personal Info Data:', data);
    setQuizState(prev => ({
      ...prev,
      personalInfo: data,
      currentStep: prev.currentStep + 1
    }));
    
    // Track step completion
    trackEvent('quiz_step_completed', {
      event_label: 'Personal Info Completed',
      step: 1,
      total_steps: totalSteps,
      data: data
    });
  };

  const handleBodyTypeNext = (data: BodyTypeData) => {
    console.log('Body Type Data:', data);
    setQuizState(prev => ({
      ...prev,
      bodyType: data,
      currentStep: prev.currentStep + 1
    }));
    
    // Track step completion
    trackEvent('quiz_step_completed', {
      event_label: 'Body Type Completed',
      step: 2,
      total_steps: totalSteps,
      data: data
    });
  };

  const handleColorAnalysisNext = (data: ColorAnalysisData) => {
    console.log('Color Analysis Data:', data);
    setQuizState(prev => ({
      ...prev,
      colorAnalysis: data,
      currentStep: prev.currentStep + 1
    }));
    
    // Track step completion
    trackEvent('quiz_step_completed', {
      event_label: 'Color Analysis Completed',
      step: 3,
      total_steps: totalSteps,
      data: data
    });
  };

  const handleStyleOriginNext = (data: StyleOriginData) => {
    console.log('Style Origin Data:', data);
    
    // Always go to the next step, but the conditional logic in renderCurrentStep
    // will determine what component to show based on styleOrigin selection
    setQuizState(prev => ({
      ...prev,
      styleOrigin: data,
      currentStep: prev.currentStep + 1
    }));
    
    // Track step completion
    trackEvent('quiz_step_completed', {
      event_label: 'Style Origin Completed',
      step: 4,
      total_steps: totalSteps,
      style_selections: data.styleOrigin
    });
  };

  const handleStyleVibeNext = (data: StyleVibeData) => {
    console.log('Style Vibe Data:', data);
    setQuizState(prev => ({
      ...prev,
      styleVibe: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleAnsQuestionNext = (data: AnsQuestionData) => {
    console.log('Ans Question Data:', data);
    setQuizState(prev => ({
      ...prev,
      ansQuestion: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleOutfitSwipeNext = async (data: SwipeResultData) => {
    console.log('Outfit Swipe Data:', data);
    
    // For authenticated users, this is the final step - complete the quiz
    if (isAuthenticated) {
      const updatedQuizState = {
        ...quizState,
        outfitSwipe: data,
        // Auto-fill contact verification with user's email
        contactVerification: {
          email: userEmail,
          phone: '', // Will be handled during storage
          isVerified: true
        },
        otpVerification: {
          isVerified: true,
          verifiedEmail: userEmail,
          verifiedPhone: ''
        },
        isRetake: quizState.isRetake
      };
      
      setQuizState(updatedQuizState);
      
      // Complete the quiz immediately for authenticated users
      await completeQuizForAuthenticatedUser(updatedQuizState);
    } else {
      // For non-authenticated users, proceed to contact verification
      setQuizState(prev => ({
        ...prev,
        outfitSwipe: data,
        currentStep: prev.currentStep + 1
      }));
    }
  };

  // Complete quiz for authenticated users
  const completeQuizForAuthenticatedUser = async (finalQuizState: StyleQuizState) => {
    try {
      console.log('🎉 Completing quiz for authenticated user');
      
      // Transform and store quiz data in Supabase
      const { transformQuizDataForV2, storeQuizDataInSupabase } = await import('@/app/utils/styleQuizUtils');
      const transformedData = transformQuizDataForV2(finalQuizState);
      
      console.log('Storing quiz data...', transformedData);
      const { data, error } = await storeQuizDataInSupabase(transformedData, finalQuizState.isRetake || false);
      
      if (error) {
        console.error('Error storing quiz data:', error);
        throw new Error(`Failed to store quiz data: ${error}`);
      }
      
      console.log('Quiz data successfully stored:', data);
      
      // Clear local storage since we're completing the quiz
      clearQuizDataFromStorage();
      
      // Track quiz completion
      trackEvent('quiz_completed', {
        event_label: 'Authenticated User Quiz Completed',
        total_steps: totalSteps,
        is_retake: finalQuizState.isRetake,
        completion_method: 'authenticated_auto',
        quiz_id: data?.id
      });
      
      // Redirect to dashboard
      console.log('Redirecting to dashboard...');
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Error completing quiz for authenticated user:', error);
      // Still redirect on error
      console.warn('Quiz completed but there was an issue saving your data.');
      window.location.href = '/dashboard';
    }
  };

  const handleContactVerificationNext = (data: ContactVerificationData) => {
    console.log('Contact Verification Data:', data);
    setQuizState(prev => ({
      ...prev,
      contactVerification: data,
      currentStep: prev.currentStep + 1
    }));
    
    // Track lead generation (email captured)
    trackEvent('lead_generated', {
      event_label: 'Email Captured',
      step: quizState.currentStep,
      total_steps: totalSteps,
      email: data.email
    });
    
    // Facebook Pixel Lead event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Style Quiz Email Capture',
        value: 1.00,
        currency: 'USD'
      });
    }
  };

  const handleOtpVerificationNext = (data: OtpVerificationData) => {
    console.log('OTP Verification Data:', data);
    setQuizState(prev => ({
      ...prev,
      otpVerification: data,
      currentStep: prev.currentStep + 1
    }));
    
    // Track quiz completion - MOST IMPORTANT CONVERSION EVENT
    trackEvent('quiz_completed', {
      event_label: 'Style Quiz Completed',
      step: quizState.currentStep,
      total_steps: totalSteps,
      user_email: quizState.contactVerification?.email || '',
      completion_rate: ((quizState.currentStep / totalSteps) * 100).toFixed(2)
    });
    
    // Facebook Pixel Conversion event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: 'Style Quiz Completion',
        value: 10.00, // Assign a value to the completion
        currency: 'USD'
      });
    }
    
    // GTM Custom Event for quiz completion
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'quiz_completion',
        quiz_type: 'style_quiz',
        user_email: quizState.contactVerification?.email || '',
        completion_time: new Date().toISOString()
      });
    }
  };

  const handleBack = () => {
    // Track step abandonment for funnel analysis
    trackEvent('quiz_step_back', {
      event_label: 'User Went Back',
      from_step: quizState.currentStep,
      total_steps: totalSteps,
      completion_rate: ((quizState.currentStep / totalSteps) * 100).toFixed(2)
    });
    
    setQuizState(prev => {
      let newStep = Math.max(1, prev.currentStep - 1);
      
      // Handle back navigation based on style origin selections
      if (prev.styleOrigin?.styleOrigin) {
        const selectedStyles = prev.styleOrigin.styleOrigin;
        const hasInspiredByVibe = selectedStyles.includes('inspired-by-vibe');
        const hasSelfExpressive = selectedStyles.includes('self-expressive');
        const hasTrendFocused = selectedStyles.includes('trend-focused');
        
        // If user selected only trend-focused, handle shorter flow
        if (hasTrendFocused && !hasInspiredByVibe && !hasSelfExpressive) {
          if (prev.currentStep === 5) { // outfit swipe step
            newStep = 4; // Go back to styleOrigin
          } else if (prev.currentStep === 6) { // contact verification step
            newStep = 5; // Go back to outfit swipe
          } else if (prev.currentStep === 7) { // otp verification step
            newStep = 6; // Go back to contact verification
          }
        }
        // For users with inspired-by-vibe or self-expressive, use normal back navigation
      }
      
      return {
        ...prev,
        currentStep: newStep
      };
    });
  };

  const renderCurrentStep = () => {
    switch (quizState.currentStep) {
      case 1:
        return (
          <PersonalInfo
            onNext={handlePersonalInfoNext}
            onBack={handleBack}
            initialData={quizState.personalInfo || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            hasExtendedFlow={hasExtendedFlow()}
            onStartOver={resetQuiz}
          />
        );
      
      case 2:
        return (
          <BodyType
            onNext={handleBodyTypeNext}
            onBack={handleBack}
            initialData={quizState.bodyType || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            gender={quizState.personalInfo?.gender || ''}
            hasExtendedFlow={hasExtendedFlow()}
            onStartOver={resetQuiz}
          />
        );
      
      case 3:
        return (
          <ColorAnalysis
            onNext={handleColorAnalysisNext}
            onBack={handleBack}
            initialData={quizState.colorAnalysis || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            hasExtendedFlow={hasExtendedFlow()}
            onStartOver={resetQuiz}
          />
        );
      
      case 4:
        return (
          <StyleOrigin
            onNext={handleStyleOriginNext}
            onBack={handleBack}
            initialData={quizState.styleOrigin || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            gender={quizState.personalInfo?.gender || ''}
            hasExtendedFlow={hasExtendedFlow()}
            onStartOver={resetQuiz}
          />
        );
      
      case 5:
        // Check if user selected only trend-focused (outfit swipe) or styleVibe for regular flow
        if (quizState.styleOrigin?.styleOrigin) {
          const selectedStyles = quizState.styleOrigin.styleOrigin;
          const hasInspiredByVibe = selectedStyles.includes('inspired-by-vibe');
          const hasSelfExpressive = selectedStyles.includes('self-expressive');
          const hasTrendFocused = selectedStyles.includes('trend-focused');
          
          // If user selected only trend-focused, skip to outfit swipe
          if (hasTrendFocused && !hasInspiredByVibe && !hasSelfExpressive) {
            return (
              <OutfitSwipe
                onNext={handleOutfitSwipeNext}
                onBack={handleBack}
                currentStep={quizState.currentStep}
                totalSteps={totalSteps}
                gender={quizState.personalInfo?.gender || 'Male'}
              />
            );
          }
        }
        
        // Default to StyleVibe for users with inspired-by-vibe or self-expressive
        return (
          <StyleVibe
            onNext={handleStyleVibeNext}
            onBack={handleBack}
            initialData={quizState.styleVibe || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            gender={quizState.personalInfo?.gender || ''}
            hasExtendedFlow={hasExtendedFlow()}
            onStartOver={resetQuiz}
          />
        );
      
      case 6:
        // Check if user selected only trend-focused (contact verification) or ansQuestion
        if (quizState.styleOrigin?.styleOrigin) {
          const selectedStyles = quizState.styleOrigin.styleOrigin;
          const hasInspiredByVibe = selectedStyles.includes('inspired-by-vibe');
          const hasSelfExpressive = selectedStyles.includes('self-expressive');
          const hasTrendFocused = selectedStyles.includes('trend-focused');
          
          // If user selected only trend-focused, skip to contact verification
          if (hasTrendFocused && !hasInspiredByVibe && !hasSelfExpressive) {
            return (
              <ContactVerification
                onNext={handleContactVerificationNext}
                onBack={handleBack}
                initialData={quizState.contactVerification || undefined}
                currentStep={quizState.currentStep}
                totalSteps={totalSteps}
              />
            );
          }
        }
        
        // Default to AnsQuestion for users with inspired-by-vibe or self-expressive
        return (
          <AnsQuestion
            onNext={handleAnsQuestionNext}
            onBack={handleBack}
            initialData={quizState.ansQuestion || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            hasExtendedFlow={hasExtendedFlow()}
            onStartOver={resetQuiz}
          />
        );
      
      case 7:
        // Check if user selected only trend-focused (OTP verification) or outfit swipe
        if (quizState.styleOrigin?.styleOrigin) {
          const selectedStyles = quizState.styleOrigin.styleOrigin;
          const hasInspiredByVibe = selectedStyles.includes('inspired-by-vibe');
          const hasSelfExpressive = selectedStyles.includes('self-expressive');
          const hasTrendFocused = selectedStyles.includes('trend-focused');
          
          // If user selected only trend-focused, skip to OTP verification
          if (hasTrendFocused && !hasInspiredByVibe && !hasSelfExpressive) {
            return (
              <OtpVerification
                onNext={handleOtpVerificationNext}
                onBack={handleBack}
                initialData={quizState.otpVerification || undefined}
                currentStep={quizState.currentStep}
                totalSteps={totalSteps}
                email={quizState.contactVerification?.email || ''}
                phone={quizState.contactVerification?.phone || ''}
                allQuizData={quizState}
                isLatestVersion={true}
              />
            );
          }
        }
        
        // Default to OutfitSwipe for users with inspired-by-vibe or self-expressive
        return (
          <OutfitSwipe
            onNext={handleOutfitSwipeNext}
            onBack={handleBack}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            gender={quizState.personalInfo?.gender || 'Male'}
            onStartOver={resetQuiz}
          />
        );
      
      case 8:
        // Contact Verification step (only for non-trend-focused users)
        return (
          <ContactVerification
            onNext={handleContactVerificationNext}
            onBack={handleBack}
            initialData={quizState.contactVerification || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            onStartOver={resetQuiz}
          />
        );
      
      case 9:
        // OTP Verification step (only for non-trend-focused users)
        return (
          <OtpVerification
            onNext={handleOtpVerificationNext}
            onBack={handleBack}
            initialData={quizState.otpVerification || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            email={quizState.contactVerification?.email || ''}
            phone={quizState.contactVerification?.phone || ''}
            allQuizData={quizState}
            isLatestVersion={true}
            onStartOver={resetQuiz}
          />
        );
      
      default:
        return (
          <PersonalInfo
            onNext={handlePersonalInfoNext}
            onBack={handleBack}
            initialData={quizState.personalInfo || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            onStartOver={resetQuiz}
          />
        );
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your style quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default StyleQuizPages;
