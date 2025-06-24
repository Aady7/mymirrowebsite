"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback, useRef } from 'react';
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
import { ArrowDown } from 'lucide-react';
import DynamicStylePreferenceStep from '@/app/components/style-quiz/DynamicStylePreferenceStep';
import ColorAnalyzer from '@/app/components/style-quiz/ColorAnalysis';

// Arrow down button component
const ScrollArrow = ({ contentRef }: { contentRef: React.RefObject<HTMLDivElement | null> }) => {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        // Check if we're near the bottom of the content area (within 50px)
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
        setAtBottom(isNearBottom);
      }
    };

    // Listen to scroll events on the content area
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // Call once on mount to set initial state
      handleScroll();

      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [contentRef]);

  return (
    <button
      type="button"
      disabled={atBottom}
      className={`fixed top-6/7 left-1/2 transform -translate-x-1/2 -translate-y-1/10 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${!atBottom
          ? 'bg-gray-300 text-black opacity-100 cursor-pointer hover:bg-gray-500'
          : 'text-gray-400 opacity-10 cursor-not-allowed'
        }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // Scroll to bottom of the content area
        if (contentRef.current) {
          contentRef.current.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }}
    >
      <ArrowDown size={15} />
    </button>
  );
};

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
      return `Let's Get to Know Your Skin Tone`;
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
  const [sessionID, setSessionID] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('userId', id);
    }
    setUserId(id);

    // Create or get styleQuizId
    let quizId = localStorage.getItem('styleQuizId');
    if (!quizId) {
      quizId = crypto.randomUUID();
      localStorage.setItem('styleQuizId', quizId);
    }

    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        // Pre-fill phone number if available
        if (session.user.phone) {
          setFormValues(prev => ({ ...prev, phone: session.user.phone }));
        }
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
     if (contentRef.current) {
       contentRef.current.scrollTo({
         top: 0,
         behavior: 'smooth'
       });
     }
   }, [currentStep]);

  //floating button ka logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const SCROLL_THRESHOLD = 150; // minimum scroll distance to trigger change
    const DEBOUNCE_DELAY = 150; // milliseconds to wait before updating

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollYRef.current;

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Only update after debounce delay and if scroll difference is significant
      timeoutId = setTimeout(() => {
        if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
          if (scrollDiff < 0) {
            setShowNavButtons(true);  // scrolling up → show
          } else if (scrollDiff > SCROLL_THRESHOLD) {
            setShowNavButtons(false); // scrolling down → hide
          }
        }
        lastScrollYRef.current = currentScrollY;
      }, DEBOUNCE_DELAY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
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
          // Get the styleQuizId from localStorage
          const styleQuizId = localStorage.getItem('styleQuizId');

          // Add user data to users table with styleQuizId
          console.log("Updating user data with styleQuizId:", styleQuizId);
          const { error: userError } = await supabase
            .from('users_updated')
            .upsert([{
              user_id: session?.user.id,
              phone_number: session?.user.phone,
              created_at: new Date().toISOString(),
              style_quiz_id: styleQuizId // Add the styleQuizId to users table
            }], {
              onConflict: 'user_id',
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

      // Get the session to access user ID
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id || '';

      interface DynamicStyleQuizData extends StyleQuizData {
        [key: string]: any;
      }

      const generateCaptions = (formValues: FormValues): { upperWearCaption: string; lowerWearCaption: string; fullBodyCaption: string } => {
        // Extract basic information
        const gender = formValues.gender || 'Not specified';
        const bodyShape = formValues.bodyType || 'Not specified';
        const upperFit = fitTags.upperWear?.join(', ') || 'Not specified';
        const lowerFit = fitTags.lowerWear?.join(', ') || 'Not specified';
        const fullBodyFit = fitTags.fullBody?.join(', ') || 'Not specified';
        const upperSize = formValues.upperWear || 'Not specified';
        const lowerWaistSize = formValues.waistSize || 'Not specified';

        // Extract personality tags
        const personalityTag1 = personalityTags[0] || 'Not specified';
        const personalityTag2 = personalityTags[1] || 'Not specified';

        // Extract fashion style
        const fashionStyle = formValues.goToStyle?.join(', ') || 'Not specified';

        // Extract color analysis
        let colorPalette = 'Not specified';
        if (formValues.color_analysis) {
          try {
            const colorData = typeof formValues.color_analysis === 'string'
              ? JSON.parse(formValues.color_analysis)
              : formValues.color_analysis;

            if (colorData.colors && Array.isArray(colorData.colors)) {
              colorPalette = colorData.colors
                .map((color: { hex: string }) => color.hex)
                .join(', ');
            }
          } catch (e) {
            console.error('Error parsing color analysis:', e);
          }
        }

        // Extract print preferences - now including all values
        const printType = printCharacteristics.printTypes?.join(', ') || 'Not specified';
        const printScale = printCharacteristics.printScales?.join(', ') || 'Not specified';
        const printDensity = printCharacteristics.printDensities?.join(', ') || 'Not specified';
        const patternPlacement = printCharacteristics.patternPlacements?.join(', ') || 'Not specified';
        const surfaceTexture = printCharacteristics.surfaceTextures?.join(', ') || 'Not specified';

        // Define apparel categories
        const upperWearItems = [
          'Blazers', 'Shirts', 'Turtlenecks', 'Polo T-shirts', 'Tank Tops', 'Tshirts', 'Tshirt', 'Shirt',
          'Crop Top', 'Tanks', 'Sports Bra', 'Cropped T-shirt'
        ];

        const lowerWearItems = [
          'Trousers', 'Jeans', 'Sweatpants', 'Shorts', 'Joggers', 'Leggings', 'Cargos', 'Cargoes',
          'Pants', 'Skirts'
        ];

        const fullBodyItems = [
          'Co-ords & Onesies', 'Dressses', 'Ethnics'
        ];

        // Extract specific wear interests
        let upperWearInterests: string[] = [];
        let lowerWearInterests: string[] = [];
        let fullBodyInterests: string[] = [];

        if (formValues.goToStyle) {
          formValues.goToStyle.forEach(style => {
            const key = `preferred_${style}`;
            if (formValues[key] && Array.isArray(formValues[key])) {
              formValues[key].forEach(item => {
                const normalizedItem = item.trim();
                if (upperWearItems.some(upperItem => normalizedItem.toLowerCase().includes(upperItem.toLowerCase()))) {
                  upperWearInterests.push(normalizedItem);
                } else if (lowerWearItems.some(lowerItem => normalizedItem.toLowerCase().includes(lowerItem.toLowerCase()))) {
                  lowerWearInterests.push(normalizedItem);
                } else if (fullBodyItems.some(fullBodyItem => normalizedItem.toLowerCase().includes(fullBodyItem.toLowerCase()))) {
                  fullBodyInterests.push(normalizedItem);
                }
              });
            }
          });
        }

        const upperSpecificInterests = upperWearInterests.length > 0
          ? upperWearInterests.join(', ')
          : 'Not specified';

        const lowerSpecificInterests = lowerWearInterests.length > 0
          ? lowerWearInterests.join(', ')
          : 'Not specified';

        const fullBodySpecificInterests = fullBodyInterests.length > 0
          ? fullBodyInterests.join(', ')
          : 'Not specified';

        // Determine minimalistic preference
        const minimalistic = formValues.minimalistic === 'Yes' ? 'minimalistic' : 'non-minimalistic';

        // Additional preferences
        const additionalPreferences = formValues.feedback || 'None';

        // Construct the captions
        const upperWearCaption = `${gender} with ${bodyShape} body shape seeking ${upperFit} fitting tops in size ${upperSize}. Style personality combines ${personalityTag1} and ${personalityTag2} traits with ${fashionStyle} aesthetic. Color palette features ${colorPalette}. Print preferences include ${printType} patterns at ${printScale} scale with ${printDensity} density and ${patternPlacement} positioning. Prefers ${surfaceTexture} fabric textures. Specific upper wear interests: ${upperSpecificInterests}. Styling approach: ${minimalistic} design.
Additional preferences: ${additionalPreferences}`;

        const lowerWearCaption = `${gender} with ${bodyShape} body shape seeking ${lowerFit} fitting bottoms with ${lowerWaistSize} waist size. Style personality combines ${personalityTag1} and ${personalityTag2} traits with ${fashionStyle} aesthetic. Color palette features ${colorPalette}. Prefers ${surfaceTexture} fabric textures. Specific lower wear interests: ${lowerSpecificInterests}. Styling approach: ${minimalistic} design.
Additional preferences: ${additionalPreferences}`;

        const fullBodyCaption = `${gender} with ${bodyShape} body shape seeking ${fullBodyFit} silhouette in size ${upperSize} with ${lowerWaistSize} waist measurement. Style personality combines ${personalityTag1} and ${personalityTag2} traits with ${fashionStyle} aesthetic. Color palette features ${colorPalette}. Print preferences include ${printType} patterns at ${printScale} scale with ${printDensity} density and ${patternPlacement} positioning. Prefers ${surfaceTexture} fabric textures. Specific dress interests: ${fullBodySpecificInterests}. Styling approach: ${minimalistic} design.
Additional preferences: ${additionalPreferences}`;

        return { upperWearCaption, lowerWearCaption, fullBodyCaption };
      };

      const styleQuizId = localStorage.getItem('styleQuizId');

      const { upperWearCaption, lowerWearCaption, fullBodyCaption } = generateCaptions(formValues);
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
        id: styleQuizId || undefined,
        name: formValues.name.trim(),
        phone_number: formValues.phone?.replace(/\D/g, '') || '',
        gender: formValues.gender,
        body_shape: formValues.bodyType,
        upper_size: formValues.upperWear,
        lower_waist_size: formValues.waistSize,
        outfit_adventurous: formValues.outfitAdventurous || [],
        minimalistic: formValues.minimalistic,
        fashion_style: formValues.goToStyle || [],
        feedback: formValues.feedback?.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_tags: userTags,
        weekend_preference: formValues.weekendPreference,
        shopping_style: formValues.shoppingStyle,
        workspace_style: formValues.workspaceStyle,
        friend_compliments: formValues.friendCompliments,
        work_outfit: formValues.workOutfit,
        wardrobe_content: formValues.wardrobeContent,
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

      const validApparelKeys = ['athleisure', 'streetwear', 'business_casual'];

      dynamicSteps.forEach(({ style }) => {
        const key = `preferred_${style}`;
        const dbKey = `apparel_pref_${style.replace(/\s+/g, '_')}`;

        if (validApparelKeys.includes(style.replace(/\s+/g, '_')) && formValues[key]) {
          cleanedData[dbKey] = formValues[key];
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
        throw new Error(insertError.message);
      }

    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your data');
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, dynamicSteps]);

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

    // Dynamic steps come right after Go To Style step (step 7)
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
    if (currentStep === otpSendStep) return !!formValues.phone || isAuthenticated;
    if (currentStep === otpVerifyStep) return !!formValues.otp || isAuthenticated;
    if (currentStep === feedbackStep) return true;

    return currentStep === getTotalSteps();
  }, [currentStep, dynamicSteps, formValues, isAuthenticated]);

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
        if (isAuthenticated) {
          // Skip OTP for authenticated users
          await sendFormData(); // save if needed
          router.push("/recommendations");
          return;
        }
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

      // Handle personality questions (multi-select)
      if (type === 'checkbox' && (currentStep >= 2 && currentStep <= 4)) {
        const currentArray = Array.isArray(prev[name]) ? [...prev[name]] : [];
        if (checked) {
          currentArray.push(value);
        } else {
          const index = currentArray.indexOf(value);
          if (index > -1) {
            currentArray.splice(index, 1);
          }
        }
        newVals[name] = currentArray;
      }
      // Handle other checkbox inputs
      else if (type === 'checkbox') {
        const arr = Array.isArray(prev[name]) ? [...prev[name]] : [];
        if (checked) arr.push(value);
        else arr.splice(arr.indexOf(value), 1);
        newVals[name] = arr;
      }
      // Handle all other inputs
      else {
        newVals[name] = value;
      }
      return newVals;
    });

    // Skip auto-next for steps that need multiple inputs or selections
    const skipAutoNext = [
      'name',
      'gender',
      'phone',
      'otp',
      'feedback',
      'colorAnalysis',
      'minimalistic',
      'outfitAdventurous'

    ].includes(name);

    // Also skip if the step is the GoToStyle step (multiple checkboxes)
    const isGoToStyleStep = currentStep === 7;

    // Or if it's a dynamic style preference step (multiple options)
    const isDynamicStyleStep = currentStep > 7 && currentStep <= 7 + dynamicSteps.length;

    // Skip auto-next for personality questions (steps 2-4) since they're now multi-select
    const isPersonalityStep = currentStep >= 2 && currentStep <= 4;

    if (currentStep === 6) {
      const updatedValues = { ...formValues, [name]: value }
      const bothSizeQuestionsAnswered =
        !!updatedValues.upperWear && !!updatedValues.waistSize;
      if (!bothSizeQuestionsAnswered) {
        console.log("Both size questions must be answered before proceeding to the next step");
        return;
      }
    }

    if (!skipAutoNext && !isGoToStyleStep && !isDynamicStyleStep && !isPersonalityStep) {
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
  }, [sendFormData, currentStep, setCurrentStep, setMaxCompletedStep]);

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
                  <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all text-[14px] ${formValues.minimalistic === option
                    ? 'bg-[#007e90] text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                    }`}>
                    {option}
                  </div>
                </label>
              ))}
            </div>
            <div className="pt-8">
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
            {isAuthenticated ? (
              <>
                <h3 className="text-[25px] font-medium text-gray-900">Phone Number Verified</h3>
                <p className="text-[14px] text-gray-600">Your phone number is already verified. You can proceed to the next step.</p>
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-[14px] text-green-700">
                    ✓ Phone: {formValues.phone || 'Verified'}
                  </p>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
                className="mt-1 px-4 py-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007e90] focus:ring-[#007e90] text-[16px]"
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
                disabled={isAuthenticated}
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
                        return "Help us to know what's on your mind";

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
                  {/* multi-select hint for relevant steps */}
                  {((currentStep >= 2 && currentStep <= 4) || currentStep === 7 || currentStep == 8 || (currentStep > 8 && currentStep <= 8 + dynamicSteps.length)) && (
                    <p className="text-xs text-white/70 mt-1 italic">
                      *You can select more than one option.
                    </p>
                  )}
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
              <div ref={contentRef} className="absolute inset-0 overflow-y-auto">
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

              {/* show the Arrow button for multiple choice sections */}
              {((currentStep >= 2 && currentStep <= 4) || currentStep === 8 || (currentStep > 9 && currentStep <= 8 + dynamicSteps.length)) && (
                <ScrollArrow contentRef={contentRef} />
              )}
            </div>

            {/* Spacer to prevent content from being hidden behind navigation */}
            <div className="h-20"></div>

            {/* Navigation Buttons */}
            <div
              className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-transform duration-300 ${showNavButtons ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
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
