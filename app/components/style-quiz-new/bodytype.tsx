"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import ProgressBar from './ProgressBar';
import QuizButton from './QuizButton';

interface BodyTypeProps {
  onNext?: (data: BodyTypeData) => void;
  onBack?: () => void;
  initialData?: Partial<BodyTypeData>;
  currentStep?: number;
  totalSteps?: number;
  gender?: 'Female' | 'Male' | 'Other' | '';
}

export interface BodyTypeData {
  bodyType: string;
}

// Define body types for each gender
const MALE_BODY_TYPES = [
  {
    id: 'vshape',
    name: 'V-Shape',
    image: '/assets/newstylequizimages/maleBodyTypes/bodytypemalevshape.png',
    description: 'Broad shoulders, narrow waist'
  },
  {
    id: 'triangle',
    name: 'Triangle',
    image: '/assets/newstylequizimages/maleBodyTypes/bodytypemaletriangle.png',
    description: 'Narrow shoulders, wider hips'
  },
  {
    id: 'hourglass',
    name: 'Hourglass',
    image: '/assets/newstylequizimages/maleBodyTypes/bodytypemalehourglass.png',
    description: 'Balanced shoulders and hips'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    image: '/assets/newstylequizimages/maleBodyTypes/bodytypemalerectangle.png',
    description: 'Straight body shape'
  },
  {
    id: 'oval',
    name: 'Oval',
    image: '/assets/newstylequizimages/maleBodyTypes/bodytypemaleoval.png',
    description: 'Fuller midsection'
  }
];

const FEMALE_BODY_TYPES = [
  {
    id: 'hourglass',
    name: 'Hourglass',
    image: '/assets/newstylequizimages/femaleBodyTypes/bodytypefemalehourglass.png',
    description: 'Balanced shoulders and hips'
  },
  {
    id: 'pear',
    name: 'Pear',
    image: '/assets/newstylequizimages/femaleBodyTypes/bodytypefemalepear.png',
    description: 'Narrow shoulders, wider hips'
  },
  {
    id: 'apple',
    name: 'Apple',
    image: '/assets/newstylequizimages/femaleBodyTypes/bodytypefemaleapple.png',
    description: 'Fuller midsection'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    image: '/assets/newstylequizimages/femaleBodyTypes/bodytypefemalerectangle.png',
    description: 'Straight body shape'
  },
  {
    id: 'oval',
    name: 'Oval',
    image: '/assets/newstylequizimages/femaleBodyTypes/bodytypefemaleoval.png',
    description: 'Fuller midsection'
  }
];

const BodyType: React.FC<BodyTypeProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 2,
  totalSteps = 8,
  gender = 'Male'
}) => {
  const [selectedBodyType, setSelectedBodyType] = useState<string>(
    initialData?.bodyType || ''
  );
  const [error, setError] = useState<string>('');

  // Get body types based on gender
  const getBodyTypes = () => {
    if (gender === 'Female') {
      return FEMALE_BODY_TYPES;
    } else if (gender === 'Male') {
      return MALE_BODY_TYPES;
    } else {
      // For 'Other' or empty, show both options or default to male
      return MALE_BODY_TYPES;
    }
  };

  const bodyTypes = getBodyTypes();

  const handleBodyTypeSelect = (bodyTypeId: string) => {
    setSelectedBodyType(bodyTypeId);
    if (error) {
      setError('');
    }
  };

  const handleContinue = () => {
    if (!selectedBodyType) {
      setError('Please select your body type');
      return;
    }

    const data: BodyTypeData = {
      bodyType: selectedBodyType
    };

    onNext?.(data);
  };

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
            Let's get the fit right
          </h1>
          <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
            Pick the body type that feels closest to you, no stress, all styles welcome.
          </p>
        </div>

        {/* Body Type Selection Grid */}
        <div className="mb-8">
          {bodyTypes.length === 5 ? (
            /* Special layout for 5 items: 3 on top, 2 centered on bottom */
            <div className="space-y-4">
              {/* Top row - 3 items */}
              <div className="grid grid-cols-3 gap-4">
                {bodyTypes.slice(0, 3).map((bodyType) => (
                  <button
                    key={bodyType.id}
                    onClick={() => handleBodyTypeSelect(bodyType.id)}
                    className={`
                      w-full aspect-[3/4] border-2 rounded-2xl p-4 transition-all duration-200 
                      flex flex-col items-center justify-center space-y-3
                      ${selectedBodyType === bodyType.id 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {/* Body Type Image */}
                    <div className="relative w-16 h-20 mb-2">
                      <Image
                        src={bodyType.image}
                        alt={bodyType.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    
                    {/* Body Type Name */}
                    <span className="text-sm font-medium text-black">
                      {bodyType.name}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Bottom row - 2 items centered */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4 w-2/3">
                  {bodyTypes.slice(3, 5).map((bodyType) => (
                    <button
                      key={bodyType.id}
                      onClick={() => handleBodyTypeSelect(bodyType.id)}
                      className={`
                        w-full aspect-[3/4] border-2 rounded-2xl p-4 transition-all duration-200 
                        flex flex-col items-center justify-center space-y-3
                        ${selectedBodyType === bodyType.id 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      {/* Body Type Image */}
                      <div className="relative w-16 h-20 mb-2">
                        <Image
                          src={bodyType.image}
                          alt={bodyType.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                      
                      {/* Body Type Name */}
                      <span className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-black">
                        {bodyType.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Regular grid for other counts */
            <div className="grid grid-cols-2 gap-4">
              {bodyTypes.map((bodyType) => (
                <button
                  key={bodyType.id}
                  onClick={() => handleBodyTypeSelect(bodyType.id)}
                  className={`
                    w-full aspect-[3/4] border-2 rounded-2xl p-4 transition-all duration-200 
                    flex flex-col items-center justify-center space-y-3
                    ${selectedBodyType === bodyType.id 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {/* Body Type Image */}
                  <div className="relative w-16 h-20 mb-2">
                    <Image
                      src={bodyType.image}
                      alt={bodyType.name}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  
                  {/* Body Type Name */}
                  <span className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-black">
                    {bodyType.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Footer with Continue Button */}
      <div className="px-6 pb-8 flex justify-center">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedBodyType}
          className="w-full max-w-md"
        >
          Continue
        </QuizButton>
      </div>

      {/* Bottom Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default BodyType;
