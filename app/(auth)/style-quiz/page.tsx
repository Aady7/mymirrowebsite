"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback, use } from 'react';
import supabase from '@/lib/supabaseClient';
import { generateFitTags, generatePersonalityTags, generatePatternTags } from '@/app/utils/usermapping';
import { useRouter } from 'next/navigation';

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

const STATIC_STEPS = ['Your Info', 'Your Body Type', 'Size Preferences', 'Style Preferences', "Go-to Style"];

type DynamicStep = { style: string; options: string[] };

const BODY_TYPE_IMAGES = {
  'inverted triangle': '/body-types/inverted-triangle.png',
  'rectangle': '/body-types/rectangle.png',
  'oval': '/body-types/oval.png',
  'hourglass': '/body-types/hourglass.png',
  'triangle': '/body-types/triangle.png'
};

const SIZE_OPTIONS = {
  upperWear: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  waistSize: ['26', '28', '30', '32', '34', '36', '38', '40', '42']
};

const PERSONALITY_QUESTIONS = [
  {
    key: 'alarmResponse',
    label: 'Your alarm rings. You...',
    options: [
      'Snooze 5 times',
      'Jump out like a hero',
      'Check WhatsApp or Insta first',
      'Mentally plan your outfit',
    ],
  },
  {
    key: 'cancelPlansResponse',
    label: 'Your friend cancels plans. You...',
    options: [
      'Feel secretly relieved - solo time hits different',
      'Still getting ready. Plans or no plans',
      'Spam them with memes and voice notes',
      'That is my cue to finish a side project',
    ],
  },
  {
    key: 'friendsLateResponse',
    label: 'Your friends are running late. You are',
    options: [
      'Already there, slightly annoyed but chill',
      'Oh crap. I completely lost track of time',
      'Texting "on my way"… while still wrapped in a blanket',
      'Chilling. Music on, snacks ready. I like the wait',
    ],
  },
  {
    key: 'selfieFace',
    label: 'Go-to selfie face?',
    options: [
      'Smirk or pout',
      'Laughing candid',
      'Serious side profile',
      'Not into selfies',
    ],
  },
  {
    key: 'outfitPlanning',
    label: 'How often do you plan outfits?',
    options: [
      'Just for events',
      'Every. Single. Day.',
      'Whatever is clean',
      'Mood-based chaos',
    ],
  },
  {
    key: 'complimentOn',
    label: 'What do people compliment you on?',
    options: [
      'Love your style — always bold',
      'You are such a vibe booster',
      'You are so honest and grounded',
      'You have a really calming presence',
    ],
  },
];

const StyleQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({ outfitAdventurous: [], goToStyle: [] });
  const [dynamicSteps, setDynamicSteps] = useState<DynamicStep[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userTags, setUserTags] = useState<string[]>([]);
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

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned
    }
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
    }
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `+91 ${cleaned.slice(1)}`
    }
    return cleaned
  }

  const handleSendOtp = async () => {
    setIsSubmitting(true)
    setError(null)

    let cleanedPhone = formValues.phone?.replace(/\D/g, '') || ''
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.slice(1)
    }
    if (!cleanedPhone.startsWith('91')) {
      cleanedPhone = '91' + cleanedPhone
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+${cleanedPhone}`,
        options: { shouldCreateUser: true, channel: 'sms' }
      })

      if (error) {
        setError(error.message)
      } else {
        setOtpSent(true)
      }
    } catch (err) {
      setError('An error occurred while sending OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async () => {
    setIsSubmitting(true)
    setError(null)

    let cleanedPhone = formValues.phone?.replace(/\D/g, '') || ''
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.slice(1)
    }
    if (!cleanedPhone.startsWith('91')) {
      cleanedPhone = '91' + cleanedPhone
    }

    try {
     
      const { error } = await supabase.auth.verifyOtp({
        phone: `+${cleanedPhone}`,
        token: formValues.otp||'' ,
        type: 'sms'
      })

      if (error) {
        setError(error.message)
      } else {
        console.log("verified otp")
        router.push("/recommendations")
        
        
        

      }
    } catch (err) {
      setError('An error occurred while verifying OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendFormData = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formValues.name || !formValues.phone || !formValues.gender) {
        throw new Error('Please fill in all required fields');
      }

      // Generate fit tags
      const fitTags = generateFitTags({
        gender: formValues.gender,
        bodyType: formValues.bodyType || 'rectangle'
      });

      // Generate personality tags
      const personalityTags = generatePersonalityTags({
        alarmRings: formValues.alarmResponse?.toLowerCase() || '',
        friendCancels: formValues.cancelPlansResponse?.toLowerCase() || '',
        friendsLate: formValues.friendsLateResponse?.toLowerCase() || '',
        selfieFace: formValues.selfieFace?.toLowerCase() || '',
        planOutfit: formValues.outfitPlanning?.toLowerCase() || '',
        peopleCompliment: formValues.complimentOn?.toLowerCase() || ''
      });

      // Generate pattern tags
      const patternTags = generatePatternTags({
        gender: formValues.gender,
        personalityTags,
        styleTypes: formValues.goToStyle || []
      });

     const userTags=[{
      personality_tags: personalityTags,
     pattern_tags: patternTags,
     fit_tags:fitTags,

      

      
       
     }]

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
        usertags:userTags,
       
        // Add personality question responses
        alarmresponse: formValues.alarmResponse,
        cancelplansresponse: formValues.cancelPlansResponse,
        friendslateresponse: formValues.friendsLateResponse,
        selfieface: formValues.selfieFace,
        outfitplanning: formValues.outfitPlanning,
        complimenton: formValues.complimentOn
      };

      console.log('Cleaned Data:', cleanedData);

      // Add preferred items for each style
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
    // Personality questions
    const personalityIdx = currentStep - (5 + dynamicSteps.length) - 1;
    if (personalityIdx >= 0 && personalityIdx < PERSONALITY_QUESTIONS.length) {
      const key = PERSONALITY_QUESTIONS[personalityIdx].key;
      return !!formValues[key];
    }
    // Feedback step
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
              ?  ['tshirts', 'shirts', 'cargos', 'joggers and sweatpants', 'jeans', 'shorts']
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
          await handleSendOtp();
          return;
        } else {
          await handleVerifyOtp();
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
          return (
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  name="name" 
                  value={formValues.name || ''} 
                  onChange={handleChange} 
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2" 
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formValues.phone || ''} 
                  onChange={handleChange} 
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex space-x-4">
                {['male','female','other'].map(g => (
                  <label key={g} className="flex-1 flex items-center justify-center">
                    <input type="radio" name="gender" value={g} checked={formValues.gender===g} onChange={handleChange} className="hidden" />
                    <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
                      formValues.gender===g ? 'bg-[#007e90] text-white' : 'bg-white text-[#007e90] border-2 border-[#007e90]'
                    }`}>
                      <span className="text-sm font-medium">{g.charAt(0).toUpperCase()+g.slice(1)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        case 2:
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(BODY_TYPE_IMAGES).map(([type, image]) => (
                <label key={type} className="flex flex-col items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="bodyType" 
                    value={type} 
                    checked={formValues.bodyType===type} 
                    onChange={handleChange} 
                    className="hidden" 
                  />
                  <div className={`w-full aspect-[3/4] border-2 rounded-lg overflow-hidden transition-all ${
                    formValues.bodyType===type ? 'border-[#007e90] shadow-lg' : 'border-gray-200'
                  }`}>
                    <img 
                      src={image} 
                      alt={`${type} body type`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          );
        case 3:
          return (
            <div className="space-y-8 ">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Upper Wear Size</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {SIZE_OPTIONS.upperWear.map(size => (
                    <label key={size} className="flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="upperWear" 
                        value={size} 
                        checked={formValues.upperWear===size} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                        formValues.upperWear===size ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}>
                        {size}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Waist Size</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {SIZE_OPTIONS.waistSize.map(size => (
                    <label key={size} className="flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="waistSize" 
                        value={size} 
                        checked={formValues.waistSize===size} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                        formValues.waistSize===size ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}>
                        {size}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">How adventurous are you with your outfits?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['I stick with my go‑to styles','I try new look sometimes', 'I love bold, unique fashion'].map(level => (
                    <label key={level} className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        name="outfitAdventurous" 
                        value={level} 
                        checked={formValues.outfitAdventurous?.includes(level)} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${
                        formValues.outfitAdventurous?.includes(level) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}>
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Do you prefer minimalistic style?</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Yes', 'No'].map(option => (
                    <label key={option} className="flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="minimalistic" 
                        value={option} 
                        checked={formValues.minimalistic===option} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${
                        formValues.minimalistic===option ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}>
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        case 5:
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Select your go-to styles</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['streetwear', 'business casual', 'athleisure', ].map(style => (
                  <label key={style} className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      name="goToStyle" 
                      value={style} 
                      checked={formValues.goToStyle?.includes(style)} 
                      onChange={handleChange} 
                      className="hidden" 
                    />
                    <div className={`w-full py-4 px-6 rounded-lg text-center cursor-pointer transition-all ${
                      formValues.goToStyle?.includes(style) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                    }`}>
                      {style.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        default:
          return (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Additional Feedback</label>
              <textarea 
                name="feedback" 
                value={formValues.feedback || ''} 
                onChange={handleChange} 
                rows={4} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#007e90]"
                placeholder="Share any additional thoughts or preferences..."
              />
            </div>
          );
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
                <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${
                  formValues[key]?.includes(option) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}>
                  {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }
    // Personality questions
    const personalityIdx = currentStep - (5 + dynamicSteps.length) - 1;
    if (personalityIdx >= 0 && personalityIdx < PERSONALITY_QUESTIONS.length) {
      const q = PERSONALITY_QUESTIONS[personalityIdx];
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">{q.label}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map(option => (
              <label key={option} className="flex items-center justify-center">
                <input
                  type="radio"
                  name={q.key}
                  value={option}
                  checked={formValues[q.key] === option}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${
                  formValues[q.key] === option 
                    ? 'bg-[#007e90] text-white' 
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}>
                  {option}
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }
    // Feedback step
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="mt-1">
            <input
              type="tel"
              name="phone"
              value={formValues.phone || ''}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                handleChange({
                  target: { name: 'phone', value: formatted }
                } as ChangeEvent<HTMLInputElement>);
              }}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2"
              placeholder="+91 9876543210"
              pattern="^(\+91[\s-]?)?[0]?[789]\d{9}$"
              title="Please enter a valid Indian phone number"
            />
          </div>
        </div>

        {otpSent && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <div className="mt-1">
              <input
                type="text"
                name="otp"
                value={formValues.otp || ''}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2"
                placeholder="Enter 6-digit OTP"
                pattern="\d{6}"
                maxLength={6}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Collapsed on mobile, full on desktop */}
      <aside className="w-full md:w-1/3 bg-[#007e90] text-white p-3 md:p-5 md:min-h-screen">
        <ul className="flex md:block overflow-x-auto md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-4">
          {STATIC_STEPS.concat(
            dynamicSteps.map(ds => `Preferred ${ds.style}`), 
            PERSONALITY_QUESTIONS.map(q => q.label), 
            ['Additional Thoughts']
          ).map((title, i) => (
            <li 
              key={i} 
              className={`flex items-center shrink-0 ${
                i + 1 === currentStep 
                  ? 'bg-white text-[#007e90]' 
                  : i + 1 <= maxCompletedStep 
                    ? 'text-white' 
                    : 'text-gray-300'
              } p-2 rounded-lg`}
            >
              <div className={`w-8 h-8 border-2 flex items-center justify-center rounded-full ${
                i + 1 === currentStep 
                  ? 'border-[#007e90]' 
                  : 'border-white'
              }`}>
                {i + 1}
              </div>
              {/* Step title - hidden on mobile */}
              <span className="hidden md:inline ml-2">{title}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 relative">
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); nextStep(); }} className="h-full flex flex-col justify-between">
          <div className="content overflow-auto mb-20">
            {/* Current step title - shown on both mobile and desktop */}
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

            {/* Form content */}
            <div className="max-w-3xl mx-auto">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation buttons */}
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
