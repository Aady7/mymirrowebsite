"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateFitTags, generatePersonalityTags, generatePrintTags } from '@/app/utils/usermapping';
import { FormValues } from '@/app/data/stylequizInterface';
import { StyleQuizData } from '@/app/data/stylequizInterface';

// Import existing step components
import PersonalInfoStep from '@/app/components/style-quiz/PersonalInfoStep';
import BodyTypeStep from '@/app/components/style-quiz/BodyTypeStep';
import SizePreferencesStep from '@/app/components/style-quiz/SizePreferencesStep';
import StylePreferencesStep from '@/app/components/style-quiz/StylePreferencesStep';
import GoToStyleStep from '@/app/components/style-quiz/GoToStyleStep';
import PersonalityQuestionStep from '@/app/components/style-quiz/PersonalityQuestionStep';
import DynamicStylePreferenceStep from '@/app/components/style-quiz/DynamicStylePreferenceStep';
import ColorAnalyzer from '@/app/components/style-quiz/ColorAnalysis';

// Import utilities
import { PERSONALITY_QUESTIONS, handleSendOtp, handleVerifyOtp, handleSendMail, handleVerifyMail } from '@/app/utils/styleQuizUtils';
import { trackEvent } from '@/lib/utils/analytics';

// Types
interface FormData {
  name: string;
  gender: string;
  phone: string;
  email: string;  // Add email field
  otp: string;
  emailOtp: string;  // Add emailOtp field
  bodyType: string;
  upperWear: string;
  waistSize: string;
  goToStyle: string[];
  minimalistic: string;
  outfitAdventurous: string[];
  weekendPreference: string[];
  shoppingStyle: string[];
  workspaceStyle: string[];
  friendCompliments: string[];
  workOutfit: string[];
  wardrobeContent: string[];
  preferred_athleisure?: string[];
  preferred_streetwear?: string[];
  preferred_business_casual?: string[];
  colorAnalysis: any;
  feedback: string;
  userId: string;
  styleQuizId: string;
}

// Step configuration - same as original
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
      return 'Fashion Adventure Level';
    case 3:
      return `Let's Get to Know Your Skin Tone`;
    case 4:
      return 'Fashion Secrets Safe';
    case 5:
      return 'The Final Bits';
    case 6:
      return 'Almost There';
    default:
      return 'Additional Thoughts';
  }
};

const getStepDescription = (currentStep: number, dynamicSteps: { style: string; options: string[] }[]): string => {
  // Calculate dynamic step positions
  const firstDynamicStep = 8;
  const minimalismStep = firstDynamicStep + dynamicSteps.length;
  const stylePrefsStep = minimalismStep + 1;
  const colorAnalysisStep = stylePrefsStep + 1;
  const phoneStep = colorAnalysisStep + 1;
  const feedbackStep = phoneStep + 1;
  const otpStep = feedbackStep + 1;

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
  } else if (currentStep >= firstDynamicStep && currentStep < minimalismStep) {
    const dynamicIndex = currentStep - firstDynamicStep;
    const style = dynamicSteps[dynamicIndex]?.style;
    return `Pick your favorite ${style} items`;
  } else if (currentStep === minimalismStep) {
    return "Help us to recommend the best products for you";
  } else if (currentStep === stylePrefsStep) {
    return "Tell us about your fashion adventure level";
  } else if (currentStep === colorAnalysisStep) {
    return "Let's discover your perfect color palette";
  } else if (currentStep === phoneStep) {
    return "Almost there! Let's verify your phone number";
  } else if (currentStep === feedbackStep) {
    return "Help us to know what's on your mind";
  } else if (currentStep === otpStep) {
    return "Enter the verification code sent to your phone";
  }
  return "";
};

// Enhanced scroll down button component
const ScrollArrow = ({ contentRef }: { contentRef: React.RefObject<HTMLDivElement | null> }) => {
  const [atBottom, setAtBottom] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState({ scrollHeight: 0, clientHeight: 0, scrollTop: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 30; // More sensitive
        setAtBottom(isNearBottom);
        
        // Calculate scroll progress (0 to 1)
        const progress = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
        setScrollProgress(progress);
        
        // Show arrow if there's scrollable content (more aggressive detection for mobile)
        const hasScrollableContent = scrollHeight > clientHeight + 50; // Better threshold for mobile
        setShowArrow(hasScrollableContent);
        
        // Debug info
        setDebugInfo({ scrollHeight, clientHeight, scrollTop });
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // Add a small delay to let content render first
      const timer = setTimeout(handleScroll, 500); // Increased delay
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }
  }, [contentRef]);

  // Also re-check when content might have changed - with more frequent checks
  useEffect(() => {
    const checkContent = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 30;
        setAtBottom(isNearBottom);
        
        const progress = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
        setScrollProgress(progress);
        
        const hasScrollableContent = scrollHeight > clientHeight + 50;
        setShowArrow(hasScrollableContent);
        
        setDebugInfo({ scrollHeight, clientHeight, scrollTop });
      }
    };

    // More frequent checks for better responsiveness on mobile
    const timer1 = setTimeout(checkContent, 50);
    const timer2 = setTimeout(checkContent, 200);
    const timer3 = setTimeout(checkContent, 500);
    const timer4 = setTimeout(checkContent, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [contentRef, showArrow]); // Add showArrow as dependency

  const scrollToBottom = () => {
    if (contentRef.current) {
      const element = contentRef.current;
      
      // For mobile Safari compatibility and smooth scrolling
      const currentScroll = element.scrollTop;
      const maxScroll = element.scrollHeight - element.clientHeight;
      
      // Calculate target scroll position
      // Try to scroll to second question area or bottom, whichever is closer
      const viewportHeight = element.clientHeight;
      const scrollAmount = Math.min(viewportHeight * 0.9, maxScroll - currentScroll);
      const targetScroll = Math.min(currentScroll + scrollAmount, maxScroll);
      
      // Simple, reliable smooth scroll using requestAnimationFrame
      const startTime = performance.now();
      const duration = 600; // Faster, more responsive animation
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out function for natural deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        element.scrollTop = currentScroll + (targetScroll - currentScroll) * easeOut;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  // Determine if we should show the arrow based on the current step
  const shouldShowForCurrentStep = () => {
    // Get the current step from parent component's state using a ref
    const currentStep = Number(contentRef.current?.getAttribute('data-current-step'));
    
    // Only show scroll arrow on personality questions (2, 3, 4) and image-based steps (5, 7)
    // These are the steps where users might have trouble seeing all content
    const stepsWithScrollNeeds = [
      2,  // Weekend preferences (personality question)
      3,  // Shopping style (personality question)  
      4,  // Workspace style (personality question)
      5,  // Body type (has images)
      7   // Go-to style (has images)
    ];
    
    return stepsWithScrollNeeds.includes(currentStep) && showArrow;
  };

  const shouldShow = shouldShowForCurrentStep();

  if (!shouldShow) return null; // Hide completely when no scrollable content or not in scrollable step

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <button
        type="button"
        onClick={scrollToBottom}
        className={`group p-4 rounded-full shadow-lg transition-all duration-300 border-2 hover:scale-110 cursor-pointer bg-white text-[#007e90] border-[#007e90] hover:bg-gray-50 hover:shadow-xl ${
          atBottom ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
        }`}
        disabled={atBottom}
        aria-label="Scroll down for more content"
        title="Scroll down to see more options"
      >
        <div className="relative">
          <ArrowDown 
            size={24} 
            className={`transition-transform duration-300 ${
              atBottom ? '' : 'group-hover:translate-y-1'
            }`} 
          />
          {/* Progress indicator */}
          {!atBottom && (
            <div className="absolute -inset-2 rounded-full border-2 border-[#007e90]/20">
              <div 
                className="absolute -inset-2 rounded-full border-2 border-[#007e90] transition-all duration-300"
                style={{
                  clipPath: `circle(${scrollProgress * 50}% at center)`
                }}
              />
            </div>
          )}
        </div>
        {/* Pulse animation when there's more content */}
        {!atBottom && (
          <div className="absolute inset-0 rounded-full bg-[#007e90]/10 animate-pulse" />
        )}
      </button>
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
          {atBottom ? 'You\'ve reached the bottom' : 'More options below ↓'}
        </div>
      </div>
    </div>
  );
};

export default function StyleQuizNew() {
  // Core state - SINGLE SOURCE OF TRUTH
  const [currentStep, setCurrentStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const [dynamicSteps, setDynamicSteps] = useState<{ style: string; options: string[] }[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const beta=process.env.NEXT_PUBLIC_TESTING_VAR

  // Form data - single state object
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    phone: '',
    email: '',  // Initialize email
    otp: '',
    emailOtp: '',  // Initialize emailOtp
    bodyType: '',
    upperWear: '',
    waistSize: '',
    goToStyle: [],
    minimalistic: '',
    outfitAdventurous: [],
    weekendPreference: [],
    shoppingStyle: [],
    workspaceStyle: [],
    friendCompliments: [],
    workOutfit: [],
    wardrobeContent: [],
    colorAnalysis: null,
    feedback: '',
    userId: '',
    styleQuizId: ''
  });

  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when step changes
  useEffect(() => {
    // Scroll the entire page to top first (to show header)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Also scroll the content container to top
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  // Initialize and load from localStorage
  useEffect(() => {
    const initializeQuiz = async () => {
      // Track style quiz start
      trackEvent.startStyleQuiz();
      
      // Try to load existing quiz data from localStorage first
      let existingData: FormData | null = null;
      let existingStep: number = 1;
      let existingUserId: string = '';
      let existingStyleQuizId: string = '';
      
      try {
        const savedData = localStorage.getItem('styleQuizNewData');
        const savedStep = localStorage.getItem('styleQuizNewStep');
        const savedUserId = localStorage.getItem('userId');
        const savedStyleQuizId = localStorage.getItem('styleQuizNewId');
        
        if (savedData) {
          existingData = JSON.parse(savedData);
          console.log('Found existing quiz data in localStorage:', existingData);
        }
        
        if (savedStep) {
          existingStep = parseInt(savedStep, 10);
          console.log('Found existing step in localStorage:', existingStep);
        }
        
        if (savedUserId) {
          existingUserId = savedUserId;
          console.log('Found existing userId in localStorage:', existingUserId);
        }
        
        if (savedStyleQuizId) {
          existingStyleQuizId = savedStyleQuizId;
          console.log('Found existing styleQuizId in localStorage:', existingStyleQuizId);
        }
      } catch (error) {
        console.warn('Error loading existing quiz data:', error);
      }
      
      // Generate new IDs only if they don't exist
      const userId = existingUserId || crypto.randomUUID();
      const styleQuizId = existingStyleQuizId || crypto.randomUUID();
      
      // Save IDs to localStorage if they're new
      if (!existingUserId) {
        localStorage.setItem('userId', userId);
      }
      if (!existingStyleQuizId) {
        localStorage.setItem('styleQuizNewId', styleQuizId);
      }
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsAuthenticated(true);
        
        // Check if user has previously completed the quiz
        const { data: userData } = await supabase
          .from('users_updated')
          .select('style_quiz_id')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (userData?.style_quiz_id) {
          setIsReturningUser(true);
        }
        
        // Initialize form data - preserve existing data if available, otherwise use defaults
        if (existingData) {
          // Merge existing data with session phone number
          setFormData({
            ...existingData,
            userId,
            styleQuizId,
            phone: session.user.phone || existingData.phone || '',
            email: session.user.email || existingData.email || '' // Preserve email
          });
          
          // Restore dynamic steps if goToStyle exists
          if (existingData.goToStyle && existingData.goToStyle.length > 0) {
            const restoredDynamicSteps = existingData.goToStyle.map(style => ({
              style: style,
              options: [] // Will be populated by the DynamicStylePreferenceStep component
            }));
            setDynamicSteps(restoredDynamicSteps);
          }
          
          // Restore current step
          setCurrentStep(existingStep);
          setMaxCompletedStep(Math.max(existingStep - 1, 0));
        } else {
          // Initialize with fresh data
          setFormData(prev => ({ 
            ...prev, 
            userId, 
            styleQuizId,
            phone: session.user.phone || '',
            email: session.user.email || '' // Initialize email
          }));
        }
      } else {
        // For non-authenticated users, restore existing data if available
        if (existingData) {
          setFormData({
            ...existingData,
            userId,
            styleQuizId
          });
          
          // Restore dynamic steps if goToStyle exists
          if (existingData.goToStyle && existingData.goToStyle.length > 0) {
            const restoredDynamicSteps = existingData.goToStyle.map(style => ({
              style: style,
              options: [] // Will be populated by the DynamicStylePreferenceStep component
            }));
            setDynamicSteps(restoredDynamicSteps);
          }
          
          // Restore current step
          setCurrentStep(existingStep);
          setMaxCompletedStep(Math.max(existingStep - 1, 0));
        } else {
          // Initialize with fresh data
          setFormData(prev => ({ 
            ...prev, 
            userId, 
            styleQuizId
          }));
        }
      }
    };

    initializeQuiz();
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (formData.userId) {
      localStorage.setItem('styleQuizNewData', JSON.stringify(formData));
      localStorage.setItem('styleQuizNewStep', currentStep.toString());
    }
  }, [formData, currentStep]);

  // Clean form update function
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle input changes - simplified
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (type === 'checkbox') {
      // Handle multi-select checkboxes
      const currentArray = Array.isArray(formData[name as keyof FormData]) 
        ? [...(formData[name as keyof FormData] as string[])] 
        : [];
      
      if (checked) {
        currentArray.push(value);
      } else {
        const index = currentArray.indexOf(value);
        if (index > -1) {
          currentArray.splice(index, 1);
        }
      }
      updateFormData(name, currentArray);

      // Generate dynamic steps when goToStyle changes
      if (name === 'goToStyle') {
        // Clear all previous dynamic preference data
        const clearedData = { ...formData };
        Object.keys(clearedData).forEach(key => {
          if (key.startsWith('preferred_')) {
            delete clearedData[key as keyof FormData];
          }
        });
        
        // Set the updated goToStyle
        clearedData.goToStyle = currentArray;
        
        // Update form data with cleared preferences
        setFormData(clearedData);
        
        const newDynamicSteps = currentArray.map(style => ({
          style: style,
          options: [] // Will be populated by the DynamicStylePreferenceStep component
        }));
        setDynamicSteps(newDynamicSteps);
      }
    } else {
      updateFormData(name, value);
    }
  };

  // Handle OTP sending
  const sendOtp = async () => {
    if ((beta === 'yes' && !formData.email) || (beta !== 'yes' && !formData.phone)) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (beta === 'yes') {
        // Use email verification in beta
        const { error: emailError } = await handleSendMail(formData.email);
        if (emailError) {
          setError(emailError.message);
          return;
        }
      } else {
        // Use phone verification normally
        const { error: phoneError } = await handleSendOtp(formData.phone);
        if (phoneError) {
          setError(phoneError.message);
          return;
        }
      }

      // OTP sent successfully, move to next step
      setCurrentStep(prev => prev + 1);
      setMaxCompletedStep(prev => Math.max(prev, currentStep));
      // Start cooldown for resend (60 seconds)
      setResendCooldown(60);
    } catch (err) {
      setError('An error occurred while sending verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP resending
  const resendOtp = async () => {
    if (!formData.phone || resendCooldown > 0) return;
    
    setIsResendingOtp(true);
    setError(null);
    
    try {
      const { error } = await handleSendOtp(formData.phone);
      if (error) {
        setError(error.message);
      } else {
        // Start cooldown for next resend (60 seconds)
        setResendCooldown(60);
        // Show success message
        setError(null);
        setResendSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } catch (err) {
      setError('An error occurred while resending OTP');
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP verification and final submission
  const verifyOtpAndSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (beta === 'yes') {
        // Verify email OTP in beta
        const { error: emailError } = await handleVerifyMail(formData.email, formData.emailOtp);
        if (emailError) {
          setError(emailError.message);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Verify phone OTP normally
        const { error: phoneError } = await handleVerifyOtp(formData.phone, formData.otp);
        if (phoneError) {
          setError(phoneError.message);
          setIsSubmitting(false);
          return;
        }
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (!session || sessionError) {
        setError('Session not available. Please try again.');
        setIsSubmitting(false);
        return;
      }

      try {
        // First, submit the style quiz data to Supabase
        await submitFormData(true); // Skip state management since verifyOtpAndSubmit handles it
        
        // Get the styleQuizId from localStorage
        const styleQuizId = localStorage.getItem('styleQuizNewId');

        // Add user data to users table with styleQuizId
        const { error: userError } = await supabase
          .from('users_updated')
          .upsert([{
            user_id: session.user.id,
            phone_number: session.user.phone,
            email_address: session.user.email,
            created_at: new Date().toISOString(),
            style_quiz_id: styleQuizId,
            updated_at: new Date().toISOString() // Add updated_at to track changes
          }], {
            onConflict: 'user_id',
          });

        if (userError) {
          console.error('Error saving user data:', userError);
          setError('Failed to save user data. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // Always trigger outfit regeneration with regenerate: true
        try {
          // Get the user ID from users_updated table
          const { data: userData, error: userDataError } = await supabase
            .from('users_updated')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (!userDataError && userData?.id) {
            // Call the outfit generation API with regenerate: true
            const response = await fetch('/api/mymirrobackend/create-outfit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                user_id: userData.id,
                regenerate: true 
              }),
            });
            
            if (!response.ok) {
              console.warn('Failed to regenerate outfits, but continuing...');
            }
          }
        } catch (regenerateError) {
          console.error('Error regenerating outfits:', regenerateError);
          // Don't block the flow, just log the error
        }
        
        // Clear quiz data from localStorage only after successful completion
        try {
          localStorage.removeItem('styleQuizNewData');
          localStorage.removeItem('styleQuizNewStep');
          localStorage.removeItem('styleQuizNewId');
          localStorage.removeItem('userId');
          console.log('✅ Quiz data cleared from localStorage after successful completion');
        } catch (clearError) {
          console.warn('Failed to clear quiz data from localStorage:', clearError);
        }

        // Clear all caches after successful completion
        try {
          const { cache } = await import('@/lib/utils/cache');
          cache.clear();
          console.log('✅ Cache cleared after successful completion');
        } catch (cacheError) {
          console.warn('Failed to clear cache:', cacheError);
        }
        
        // Clear the submitting state before navigation
        setIsSubmitting(false);
        console.log('✅ Quiz completed successfully, navigating to recommendations...');
        router.push('/recommendations');
        
      } catch (submitError) {
        console.error('Error during submission:', submitError);
        setError('Failed to submit quiz data. Please try again.');
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error('Error in verifyOtpAndSubmit:', err);
      setError('An error occurred during submission. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Submit form data to Supabase (comprehensive version)
  const submitFormData = async (skipStateManagement = false) => {
    try {
      if (!skipStateManagement) {
        setIsSubmitting(true);
      }
      setError(null);

      if (!formData.name || !formData.gender) {
        throw new Error('Please fill in all required fields');
      }

      const fitTags = generateFitTags({
        gender: formData.gender,
        bodyType: formData.bodyType || 'rectangle'
      });

      const personalityTags = generatePersonalityTags({
        weekendPreference: formData.weekendPreference,
        shoppingStyle: formData.shoppingStyle,
        workspaceStyle: formData.workspaceStyle,
        friendCompliments: formData.friendCompliments,
        workOutfit: formData.workOutfit,
        wardrobeContent: formData.wardrobeContent
      });

      const printCharacteristics = generatePrintTags({
        gender: formData.gender,
        personalityTags,
        styleTypes: formData.goToStyle || []
      });

      // Parse color analysis data if it exists
      let colorAnalysisData = null;
      if (formData.colorAnalysis) {
        try {
          colorAnalysisData = JSON.parse(formData.colorAnalysis);
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

      // Get the session to access user ID
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id || '';

      interface DynamicStyleQuizData extends StyleQuizData {
        [key: string]: any;
      }

      const generateCaptions = (formData: FormData): { upperWearCaption: string; lowerWearCaption: string; fullBodyCaption: string } => {
        // Extract basic information
        const gender = formData.gender || 'Not specified';
        const bodyShape = formData.bodyType || 'Not specified';
        const upperFit = fitTags.upperWear?.join(', ') || 'Not specified';
        const lowerFit = fitTags.lowerWear?.join(', ') || 'Not specified';
        const fullBodyFit = fitTags.fullBody?.join(', ') || 'Not specified';
        const upperSize = formData.upperWear || 'Not specified';
        const lowerWaistSize = formData.waistSize || 'Not specified';

        // Extract personality tags
        const personalityTag1 = personalityTags[0] || 'Not specified';
        const personalityTag2 = personalityTags[1] || 'Not specified';

        // Extract fashion style
        const fashionStyle = formData.goToStyle?.join(', ') || 'Not specified';

        // Extract color analysis
        let colorPalette = 'Not specified';
        if (formData.colorAnalysis && formData.goToStyle && formData.goToStyle.length > 0) {
          console.log('Color Analysis Raw Data:', formData.colorAnalysis);
          try {
            const colorData = typeof formData.colorAnalysis === 'string'
              ? JSON.parse(formData.colorAnalysis)
              : formData.colorAnalysis;
            
          

            if (colorData.recommended_colours) {
              const styleColorMap: Record<string, string> = {
                'athleisure': 'Athleisure',
                'business casual': 'Formal',
                'streetwear': 'Streetwear'
              };

              const selectedCategories = formData.goToStyle.map(style => styleColorMap[style.toLowerCase()]);
             

              const colorDescriptions: string[] = [];
              selectedCategories.forEach(category => {
                if (colorData.recommended_colours[category]) {
                  const categoryColors = colorData.recommended_colours[category] as [string, string][];
                  const colorPairsDesc = categoryColors.map(([name, hex]: [string, string]) => `${name} (${hex})`).join(', ');
                  colorDescriptions.push(`${category} style: ${colorPairsDesc}`);
                }
                console.log(`Processing category ${category}:`, colorData.recommended_colours[category]);
              });

              if (colorDescriptions.length > 0) {
                colorPalette = colorDescriptions.join('; ');
              }
              console.log('Final color palette string:', colorPalette);
            } else {
              console.log('No recommended_colours found in color data');
            }
          } catch (e) {
            console.error('Error parsing color analysis:', e);
            console.error('Error details:', e);
          }
        } else {
          console.log('No color analysis data or goToStyle preferences found in formData');
        }

        // Extract print preferences
        const printType = printCharacteristics.printTypes?.join(', ') || 'Not specified';
        const printScale = printCharacteristics.printScales?.join(', ') || 'Not specified';
        const printDensity = printCharacteristics.printDensities?.join(', ') || 'Not specified';
        const patternPlacement = printCharacteristics.patternPlacements?.join(', ') || 'Not specified';
        const surfaceTexture = printCharacteristics.surfaceTextures?.join(', ') || 'Not specified';

        // Determine minimalistic preference
        const minimalistic = formData.minimalistic === 'Yes' ? 'minimalistic' : 'non-minimalistic';

        // Additional preferences
        const additionalPreferences = formData.feedback || 'None';

        // Construct the captions
        const upperWearCaption = `${gender} with ${bodyShape} body shape seeking ${upperFit} fitting tops in size ${upperSize}. Style personality combines ${personalityTag1} and ${personalityTag2} traits with ${fashionStyle} aesthetic. Color palette features ${colorPalette}. Print preferences include ${printType} patterns at ${printScale} scale with ${printDensity} density and ${patternPlacement} positioning. Prefers ${surfaceTexture} fabric textures. Styling approach: ${minimalistic} design. Additional preferences: ${additionalPreferences}`;

        const lowerWearCaption = `${gender} with ${bodyShape} body shape seeking ${lowerFit} fitting bottoms with ${lowerWaistSize} waist size. Style personality combines ${personalityTag1} and ${personalityTag2} traits with ${fashionStyle} aesthetic. Color palette features ${colorPalette}. Prefers ${surfaceTexture} fabric textures. Styling approach: ${minimalistic} design. Additional preferences: ${additionalPreferences}`;

        const fullBodyCaption = `${gender} with ${bodyShape} body shape seeking ${fullBodyFit} silhouette in size ${upperSize} with ${lowerWaistSize} waist measurement. Style personality combines ${personalityTag1} and ${personalityTag2} traits with ${fashionStyle} aesthetic. Color palette features ${colorPalette}. Print preferences include ${printType} patterns at ${printScale} scale with ${printDensity} density and ${patternPlacement} positioning. Prefers ${surfaceTexture} fabric textures. Styling approach: ${minimalistic} design. Additional preferences: ${additionalPreferences}`;

        return { upperWearCaption, lowerWearCaption, fullBodyCaption };
      };

      const { upperWearCaption, lowerWearCaption, fullBodyCaption } = generateCaptions(formData);
      const recommended_colors = colorAnalysisData?.recommended_colours;
      console.log(recommended_colors);
     
      // Define types for the color data
      type ColorPair = [string, string]; // [name, hex]
      type CategoryColors = {
        [category: string]: ColorPair[];
      };

      const colorNamesMap: Record<string, string[]> = {};
      const hexCodesMap: Record<string, string[]> = {}; 

      if (recommended_colors) {
        // Type assertion to help TypeScript understand the structure
        const typedColors = recommended_colors as CategoryColors;
        
        for (const category in typedColors) {
          const items = typedColors[category];
          
          // Extract color names (first element of each pair)
          colorNamesMap[category] = items.map((item: ColorPair) => item[0]);
          
          // Extract hex codes (second element of each pair)
          hexCodesMap[category] = items.map((item: ColorPair) => item[1]);
        }
      }

      const cleanedData: DynamicStyleQuizData = {
        id: formData.styleQuizId || undefined,
        name: formData.name.trim(),
        phone_number: formData.phone?.replace(/\D/g, '') || '',
        email_address: formData.email?.trim(), // Add email to cleaned data
        gender: formData.gender,
        body_shape: formData.bodyType,
        upper_size: formData.upperWear,
        lower_waist_size: formData.waistSize,
        outfit_adventurous: formData.outfitAdventurous || [],
        minimalistic: formData.minimalistic,
        fashion_style: formData.goToStyle || [],
        feedback: formData.feedback?.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_tags: userTags,
        weekend_preference: formData.weekendPreference,
        shopping_style: formData.shoppingStyle,
        workspace_style: formData.workspaceStyle,
        friend_compliments: formData.friendCompliments,
        work_outfit: formData.workOutfit,
        wardrobe_content: formData.wardrobeContent,
        color_analysis: colorAnalysisData,
        personality_tag_1: personalityTags[0],
        personality_tag_2: personalityTags[1],
        print_type: printCharacteristics.printTypes,
        print_scale: printCharacteristics.printScales,
        print_density: printCharacteristics.printDensities,
        pattern_placement: printCharacteristics.patternPlacements,
        surface_texture: printCharacteristics.surfaceTextures,
        upper_fit: fitTags.upperWear,
        lower_fit: fitTags.lowerWear,
        full_body_fit: fitTags.fullBody,
        user_id,
        upper_wear_caption: upperWearCaption,
        lower_wear_caption: lowerWearCaption,
        full_body_dress_caption: fullBodyCaption,
        undertone:colorAnalysisData?.undertone,
        contrast:colorAnalysisData?.contrast,
        hex_codes:hexCodesMap,
        color_family: colorNamesMap,
      };

      // Add dynamic style preferences
      const validApparelKeys = ['athleisure', 'streetwear', 'business_casual'];
      dynamicSteps.forEach(({ style }) => {
        const key = `preferred_${style.replace(/\s+/g, '_').toLowerCase()}`;
        const dbKey = `apparel_pref_${style.replace(/\s+/g, '_')}`;

        if (validApparelKeys.includes(style.replace(/\s+/g, '_')) && formData[key as keyof FormData]) {
          cleanedData[dbKey] = formData[key as keyof FormData];
        }
      });

      console.log("Sending data to Supabase:", cleanedData);

      // Upsert data using styleQuizId
      const { error: insertError } = await supabase
        .from('style-quiz-updated')
        .upsert([cleanedData], {
          onConflict: 'id'
        });

      if (insertError) {
        console.error('Error inserting style quiz data:', insertError);
        throw new Error(`Failed to save style quiz data: ${insertError.message}`);
      }

      console.log('Successfully saved style quiz data to database');
      
      // Track style quiz completion
      trackEvent.completeStyleQuiz();

    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your data');
      throw error; // Re-throw to handle in calling function
    } finally {
      if (!skipStateManagement) {
        setIsSubmitting(false);
      }
    }
  };

  // Step validation - simplified
  const isStepValid = (): boolean => {
    // Calculate dynamic step positions
    const firstDynamicStep = 8;
    const minimalismStep = firstDynamicStep + dynamicSteps.length;
    const stylePrefsStep = minimalismStep + 1;
    const colorAnalysisStep = stylePrefsStep + 1;
    const phoneStep = colorAnalysisStep + 1;
    const feedbackStep = phoneStep + 1;
    const otpStep = feedbackStep + 1;

    // For authenticated users, skip phone and OTP validation
    if (isAuthenticated) {
      if (currentStep === phoneStep || currentStep === otpStep) {
        return true;
      }
    }

    if (currentStep === 1) return !!formData.name && !!formData.gender;
    if (currentStep === 2) return formData.weekendPreference.length > 0 && formData.friendCompliments.length > 0;
    if (currentStep === 3) return formData.shoppingStyle.length > 0 && formData.wardrobeContent.length > 0;
    if (currentStep === 4) return formData.workspaceStyle.length > 0 && formData.workOutfit.length > 0;
    if (currentStep === 5) return !!formData.bodyType;
    if (currentStep === 6) return !!formData.upperWear && !!formData.waistSize;
    if (currentStep === 7) return formData.goToStyle.length > 0;
    
    // Dynamic style steps
    if (currentStep >= firstDynamicStep && currentStep < minimalismStep) {
      const dynamicIndex = currentStep - firstDynamicStep;
      const style = dynamicSteps[dynamicIndex]?.style;
      if (style) {
        const key = `preferred_${style.replace(/\s+/g, '_').toLowerCase()}`;
        return Array.isArray(formData[key as keyof FormData]) && 
               (formData[key as keyof FormData] as string[]).length > 0;
      }
      return false;
    }
    
    // Minimalistic step
    if (currentStep === minimalismStep) {
      return !!formData.minimalistic && formData.outfitAdventurous.length > 0;
    }
    
    // Skip stylePrefsStep validation since it's combined
    if (currentStep === stylePrefsStep) {
      return true;
    }
    
    // Color analysis step
    if (currentStep === colorAnalysisStep) {
      try {
        const colorData = formData.colorAnalysis ? JSON.parse(formData.colorAnalysis) : null;
        return colorData?.isReadyForAnalysis === true;
      } catch {
        return false;
      }
    }
    
    // Phone/Email step validation
    if (currentStep === phoneStep) {
      if (isAuthenticated) {
        return true; // Skip validation for authenticated users
      } else {
        if (beta === 'yes') {
          // Only require email in beta
          return !!formData.email && formData.email.includes('@') && formData.phone.trim().length >= 10;
        } else {
          // Only require phone number normally
          return !!formData.phone && formData.phone.trim().length >= 10;
        }
      }
    }
    
    // OTP step validation
    if (currentStep === otpStep) {
      if (isAuthenticated) {
        return true;
      } else {
        if (beta === 'yes') {
          // Only require email OTP in beta
          return !!formData.emailOtp;
        } else {
          // Only require phone OTP normally
          return !!formData.otp;
        }
      }
    }
    
    // Feedback step (optional)
    if (currentStep === feedbackStep) {
      return true; // Feedback is optional for all users
    }
    
    return true;
  };

  // Render step content - clean and organized
  const renderStepContent = () => {
    // Calculate dynamic step positions
    const firstDynamicStep = 8;
    const minimalismStep = firstDynamicStep + dynamicSteps.length;
    const stylePrefsStep = minimalismStep + 1;
    const colorAnalysisStep = stylePrefsStep + 1;
    const phoneStep = colorAnalysisStep + 1;
    const feedbackStep = phoneStep + 1;
    const otpStep = feedbackStep + 1;

    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            formValues={formData} 
            handleChange={handleChange} 
          />
        );
      
      case 2:
        return (
          <PersonalityQuestionStep
            formValues={formData}
            handleChange={handleChange}
            questionIndex={0} // Weekend preferences
          />
        );
      
      case 3:
        return (
          <PersonalityQuestionStep
            formValues={formData}
            handleChange={handleChange}
            questionIndex={2} // Shopping style
          />
        );
      
      case 4:
        return (
          <PersonalityQuestionStep
            formValues={formData}
            handleChange={handleChange}
            questionIndex={4} // Workspace style
          />
        );
      
      case 5:
        return (
          <BodyTypeStep 
            formValues={formData} 
            handleChange={handleChange} 
          />
        );
      
      case 6:
        return (
          <SizePreferencesStep 
            formValues={formData} 
            handleChange={handleChange} 
          />
        );
      
      case 7:
        return (
          <GoToStyleStep 
            formValues={formData} 
            handleChange={handleChange} 
          />
        );
      
      // Dynamic style preference steps
      default:
        if (currentStep >= firstDynamicStep && currentStep < minimalismStep) {
          const dynamicIndex = currentStep - firstDynamicStep;
          const style = dynamicSteps[dynamicIndex]?.style;
          
          if (style) {
            return (
              <DynamicStylePreferenceStep
                style={style}
                formValues={formData}
                handleChange={handleChange}
              />
            );
          }
        }
        
        // Minimalistic preference
        if (currentStep === minimalismStep) {
          return (
            <div className="space-y-8">
              
              
              {/* Minimalistic preference section */}
              <div className="space-y-6 pb-8">
                <label className="block text-lg text-gray-700 mb-4 text-[24px]">
                  Do you prefer a minimalistic look?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['Yes', 'No'].map(option => (
                    <label key={option} className="flex items-center justify-center cursor-pointer">
                      <input
                        type="radio"
                        name="minimalistic"
                        value={option}
                        checked={formData.minimalistic === option}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`w-full py-3 px-4 rounded-lg text-center transition-all ${
                        formData.minimalistic === option
                          ? 'bg-[#007e90] text-white'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                      }`}>
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Style preferences section */}
              <div className="space-y-6 pt-4">
                <StylePreferencesStep 
                  formValues={formData} 
                  handleChange={handleChange} 
                />
              </div>
            </div>
          );
        }
        
        // Skip style preferences step entirely (since it's combined with minimalism)
        if (currentStep === stylePrefsStep) {
          // Auto-advance to color analysis step
          setCurrentStep(colorAnalysisStep);
          return null;
        }
        
        // Color analysis
        if (currentStep === colorAnalysisStep) {
          return (
            <ColorAnalyzer 
              formValues={formData} 
              handleChange={handleChange} 
            />
          );
        }
        
        // Phone number entry
        if (currentStep === phoneStep) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {beta === 'yes' ? 'Email Verification' : 'Phone Verification'}
              </h2>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-gray-600">Your contact information is already verified.</p>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    {beta === 'yes' ? (
                      <p className="text-green-700">✓ Email: {formData.email || 'Verified'} <br /> ✓ Phone: {formData.phone || 'Verified'}</p>
                      
                    ) : (
                      <p className="text-green-700">✓ Phone: {formData.phone || 'Verified'}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    We'll send you a verification code to secure your account.
                  </p>
                  <div>
                    {beta === 'yes' ? (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007e90] focus:border-transparent"
                          placeholder="Enter your email address"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                          <input  
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007e90] focus:border-transparent"
                            placeholder="Enter your phone number"
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007e90] focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        }
        
        // Feedback
        if (currentStep === feedbackStep) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Additional Preferences</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us more about what you'd like us to know
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007e90] focus:border-transparent"
                  rows={4}
                  placeholder="Share any additional preferences or requirements..."
                />
              </div>
            </div>
          );
        }
        
        // OTP verification
        if (currentStep === otpStep) {
          const verificationMethod = beta === 'yes' ? 'email' : 'phone';
          const verificationContact = beta === 'yes' ? formData.email : formData.phone;
          
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Enter Verification Code</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We've sent a verification code to your {verificationMethod} ({verificationContact}).
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name={beta === 'yes' ? 'emailOtp' : 'otp'}
                    value={beta === 'yes' ? formData.emailOtp || '' : formData.otp || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007e90] focus:border-transparent text-center tracking-wider"
                    placeholder="Enter verification code"
                    maxLength={6}
                    disabled={isAuthenticated}
                  />
                </div>

                {/* Resend OTP Section */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-600">
                    Didn't receive the code?
                  </span>
                  <button
                    onClick={resendOtp}
                    disabled={resendCooldown > 0 || isResendingOtp || isAuthenticated}
                    className={`text-sm font-medium transition-colors ${
                      resendCooldown > 0 || isResendingOtp || isAuthenticated
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[#007e90] hover:text-[#006d7d] cursor-pointer'
                    }`}
                  >
                    {isResendingOtp 
                      ? 'Sending...'
                      : resendCooldown > 0 
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend Code'
                    }
                  </button>
                </div>
                
                {/* Success message for resend */}
                {resendSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Verification code sent successfully!
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        }
        
        // Default fallback
        return (
          <div className="text-center space-y-4 py-8">
            <h2 className="text-xl font-semibold">Step {currentStep}</h2>
            <p className="text-gray-600">
              This step will be implemented next...
            </p>
            <div className="text-sm text-gray-500 max-w-md mx-auto">
              <p>Current form data:</p>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs text-left overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
        );
    }
  };

    return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky Header */}
      <div className="bg-[#007e90] text-white p-4 md:p-6 sticky top-16 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-6">
            {/* Left side - Heading and Subtext */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-semibold text-white break-words">
                {(() => {
                  const firstDynamicStep = 8;
                  const minimalismStep = firstDynamicStep + dynamicSteps.length;
                  
                  if (currentStep <= STATIC_STEPS.length) {
                    return STATIC_STEPS[currentStep - 1];
                  } else if (currentStep >= firstDynamicStep && currentStep < minimalismStep) {
                    const dynamicIndex = currentStep - firstDynamicStep;
                    const style = dynamicSteps[dynamicIndex]?.style;
                    return style ? getDynamicStepHeading(style) : 'Style Preferences';
                  } else {
                    return getFinalStepHeading(currentStep, dynamicSteps.length);
                  }
                })()}
              </h2>
              <p className="text-sm md:text-base text-white/80 mt-1">
                {getStepDescription(currentStep, dynamicSteps)}
              </p>
              {/* multi-select hint for relevant steps */}
              {(() => {
                const firstDynamicStep = 8;
                const minimalismStep = firstDynamicStep + dynamicSteps.length;
                
                return ((currentStep >= 2 && currentStep <= 4) || 
                        currentStep === 7 || 
                        (currentStep >= firstDynamicStep && currentStep < minimalismStep) ||
                        currentStep === minimalismStep);
              })() && (
                <p className="text-xs text-white/70 mt-1 italic">
                  *You can select more than one option.
                </p>
              )}
            </div>
            
            {/* Right side - Step Count */}
            <div className="text-right">
              <div className="text-sm md:text-base font-medium text-white">
                Step {currentStep} of {STATIC_STEPS.length + dynamicSteps.length + 6}
              </div>
            </div>
          </div>
          
          {/* Linear Progress Bar */}
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ 
                  width: `${(currentStep / (STATIC_STEPS.length + dynamicSteps.length + 6)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 relative overflow-hidden [height:calc(100dvh-9rem)]">
        <div 
          ref={contentRef}

          className="absolute inset-0 overflow-y-auto"
          style={{ paddingBottom: '7rem' }} // Increased padding to ensure content doesn't get cut off

          data-current-step={currentStep}
          data-dynamic-steps-count={dynamicSteps.length}
        >
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}


            <div className="min-h-[100dvh] pb-4 ">

              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Scroll Arrow - shows when content is scrollable */}
        <ScrollArrow contentRef={contentRef} />
      </div>

      {/* Fixed Navigation */}
      <div className="bg-white border-t border-gray-200 p-4 md:p-6 fixed bottom-0 left-0 right-0 z-[100] shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                console.log('Previous button clicked, current step:', currentStep);
                setError(null); // Clear any existing errors when going back
                setIsSubmitting(false); // Ensure submitting state is reset when going back
                
                // Clean up any analysis state
                if ((window as any).triggerColorAnalysis) {
                  delete (window as any).triggerColorAnalysis;
                }
                
                // Clear any analysis data when going back from color analysis
                const firstDynamicStep = 8;
                const minimalismStep = firstDynamicStep + dynamicSteps.length;
                const stylePrefsStep = minimalismStep + 1;
                const colorAnalysisStep = stylePrefsStep + 1;
                
                if (currentStep === colorAnalysisStep) {
                  console.log('Going back from color analysis step, clearing data');
                  const syntheticEvent = {
                    target: {
                      name: 'colorAnalysis',
                      value: JSON.stringify({ isComplete: false, isReadyForAnalysis: false })
                    }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleChange(syntheticEvent);
                }
                
                let newStep = Math.max(1, currentStep - 1);
                
                // Skip the style preferences step when going backward (since it's combined with minimalism)
                if (newStep === stylePrefsStep) {
                  newStep = Math.max(1, newStep - 1); // Go to minimalism step instead
                }
                
                console.log('Setting new step:', newStep);
                setCurrentStep(newStep);
              }}
              disabled={currentStep === 1}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={async () => {
                if (!isStepValid()) {
                  setError('Please fill in all required fields');
                  return;
                }
                setError(null);
                
                // Calculate step positions
                const firstDynamicStep = 8;
                const minimalismStep = firstDynamicStep + dynamicSteps.length;
                const stylePrefsStep = minimalismStep + 1;
                const colorAnalysisStep = stylePrefsStep + 1;
                const phoneStep = colorAnalysisStep + 1;
                const feedbackStep = phoneStep + 1;
                const otpStep = feedbackStep + 1;
                
                try {
                  // Handle special cases
                  if (currentStep === colorAnalysisStep) {
                    // Handle color analysis step - API call BEFORE moving to next step
                    if ((window as any).triggerColorAnalysis) {
                      await (window as any).triggerColorAnalysis();
                    }
                    setCurrentStep(prev => prev + 1);
                    setMaxCompletedStep(prev => Math.max(prev, currentStep));
                  } else if (currentStep === phoneStep && !isAuthenticated) {
                    await sendOtp();
                  } else if (currentStep === feedbackStep && isAuthenticated) {
                    // For authenticated users, submit directly after feedback
                    setIsSubmitting(true); // Ensure button shows loading state
                    try {
                      await submitFormData();
                      router.push('/recommendations');
                    } catch (error) {
                      setIsSubmitting(false); // Reset if navigation fails
                      throw error;
                    }
                  } else if (currentStep === feedbackStep && !isAuthenticated) {
                    // For unauthenticated users, move to OTP step after feedback
                    setCurrentStep(prev => prev + 1);
                    setMaxCompletedStep(prev => Math.max(prev, currentStep));
                  } else if (currentStep === otpStep) {
                    await verifyOtpAndSubmit();
                  } else {
                    // Normal step progression - just move to next step without saving
                    setCurrentStep(prev => prev + 1);
                    setMaxCompletedStep(prev => Math.max(prev, currentStep));
                  }
                } catch (error) {
                  console.error('Error in step progression:', error);
                  setError(error instanceof Error ? error.message : 'An error occurred');
                }
              }}
              disabled={isSubmitting || !isStepValid()}
              className="px-6 py-2.5 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              {(() => {
                const firstDynamicStep = 8;
                const minimalismStep = firstDynamicStep + dynamicSteps.length;
                const stylePrefsStep = minimalismStep + 1;
                const colorAnalysisStep = stylePrefsStep + 1;
                const phoneStep = colorAnalysisStep + 1;
                const feedbackStep = phoneStep + 1;
                const otpStep = feedbackStep + 1;
                
                if (isSubmitting) {
                  if (currentStep === feedbackStep || currentStep === otpStep) {
                    return 'Completing Quiz...';
                  }
                  return 'Saving...';
                }
                if (currentStep === phoneStep && !isAuthenticated) return 'Send OTP';
                if (currentStep === feedbackStep && isAuthenticated) return 'Complete Quiz';
                if (currentStep === otpStep) return 'Complete Quiz';
                return 'Next';
              })()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 