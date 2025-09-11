"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import SingleViewportLayout from './SingleViewportLayout';

interface BodyTypeProps {
  onNext?: (data: BodyTypeData) => void;
  onBack?: () => void;
  initialData?: Partial<BodyTypeData>;
  currentStep?: number;
  totalSteps?: number;
  gender?: 'Female' | 'Male' | 'Other' | '';
  hasExtendedFlow?: boolean;
}

export interface BodyTypeData {
  bodyType: string;
}

// Define body types for each gender with unselected and selected images
const MALE_BODY_TYPES = [
  {
    id: 'invertedtriangle',
    name: 'V-Shape',
    unselectedImage: '/assets/newstylequizimages/maleBodyTypes/maleoptions/maleinvertedtriangle.svg',
    selectedImage: '/assets/newstylequizimages/maleBodyTypes/selectMale/selectmaleinvertedtriangle.svg',
    description: 'Broad shoulders, narrow waist'
  },
  {
    id: 'triangle',
    name: 'Triangle',
    unselectedImage: '/assets/newstylequizimages/maleBodyTypes/maleoptions/maletriangle.svg',
    selectedImage: '/assets/newstylequizimages/maleBodyTypes/selectMale/selectmaletriangle.svg',
    description: 'Narrow shoulders, wider hips'
  },
  {
    id: 'hourglass',
    name: 'Hourglass',
    unselectedImage: '/assets/newstylequizimages/maleBodyTypes/maleoptions/malehourglass.svg',
    selectedImage: '/assets/newstylequizimages/maleBodyTypes/selectMale/selectmalehourglass.svg',
    description: 'Balanced shoulders and hips'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    unselectedImage: '/assets/newstylequizimages/maleBodyTypes/maleoptions/malerectangle.svg',
    selectedImage: '/assets/newstylequizimages/maleBodyTypes/selectMale/selectmalerectangle.svg',
    description: 'Straight body shape'
  },
  {
    id: 'oval',
    name: 'Oval',
    unselectedImage: '/assets/newstylequizimages/maleBodyTypes/maleoptions/maleoval.svg',
    selectedImage: '/assets/newstylequizimages/maleBodyTypes/selectMale/selectmaleoval.svg',
    description: 'Fuller midsection'
  }
];

const FEMALE_BODY_TYPES = [
  {
    id: 'hourglass',
    name: 'Hourglass',
    unselectedImage: '/assets/newstylequizimages/femaleBodyTypes/femaleoptions/femhourglass.svg',
    selectedImage: '/assets/newstylequizimages/femaleBodyTypes/selectfem/selectfemhourglass.svg',
    description: 'Balanced shoulders and hips'
  },
  {
    id: 'pear',
    name: 'Pear',
    unselectedImage: '/assets/newstylequizimages/femaleBodyTypes/femaleoptions/femalepear.svg',
    selectedImage: '/assets/newstylequizimages/femaleBodyTypes/selectfem/selectfempear.svg',
    description: 'Narrow shoulders, wider hips'
  },
  {
    id: 'apple',
    name: 'Apple',
    unselectedImage: '/assets/newstylequizimages/femaleBodyTypes/femaleoptions/femaleapple.svg',
    selectedImage: '/assets/newstylequizimages/femaleBodyTypes/selectfem/selectfemaleapple.svg',
    description: 'Fuller midsection'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    unselectedImage: '/assets/newstylequizimages/femaleBodyTypes/femaleoptions/femalerectangle.svg',
    selectedImage: '/assets/newstylequizimages/femaleBodyTypes/selectfem/selectfemrectangle.svg',
    description: 'Straight body shape'
  },
  {
    id: 'oval',
    name: 'Oval',
    unselectedImage: '/assets/newstylequizimages/femaleBodyTypes/femaleoptions/femaleoval.svg',
    selectedImage: '/assets/newstylequizimages/femaleBodyTypes/selectfem/selectfemaleoval.svg',
    description: 'Fuller midsection'
  }
];

const BodyType: React.FC<BodyTypeProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 2,
  totalSteps = 8,
  gender = 'Male',
  hasExtendedFlow = false
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
    <SingleViewportLayout
      onNext={handleContinue}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={!!selectedBodyType}
      nextButtonText="Continue"
      showBackButton={currentStep > 1}
      hasExtendedFlow={hasExtendedFlow}
    >
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
                    aspect-[3/4] border-2 rounded-2xl p-2 transition-all duration-200 
                    flex flex-col items-center justify-center space-y-3 max-h-[118px] w-[98px]
                    ${selectedBodyType === bodyType.id 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {/* Body Type Image */}
                  <div className="relative w-[28.052px] max-h-[82px] mb-2 flex-grow">
                    <Image
                      src={selectedBodyType === bodyType.id ? bodyType.selectedImage : bodyType.unselectedImage}
                      alt={bodyType.name}
                      fill
                      className="object-contain"
                      sizes="64px"
                      unoptimized={true}
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
                      min-w-[98px] aspect-[3/4] border-2 rounded-2xl p-2 transition-all duration-200 
                      flex flex-col items-center justify-center space-y-3 max-h-[118px]
                      ${selectedBodyType === bodyType.id 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {/* Body Type Image */}
                    <div className="relative w-[28.052px] max-h-[82px] mb-1 flex-grow">
                      <Image
                        src={selectedBodyType === bodyType.id ? bodyType.selectedImage : bodyType.unselectedImage}
                        alt={bodyType.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                        unoptimized={true}
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
                  w-full aspect-[3/4] border-2 rounded-2xl p-2 transition-all duration-200 
                  flex flex-col items-center justify-center space-y-3 gap-[24px]  max-h-[118px]
                  ${selectedBodyType === bodyType.id 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {/* Body Type Image */}
                <div className="relative w-[28.052px] max-h-[82px] mb-1 flex-grow">
                  <Image
                    src={selectedBodyType === bodyType.id ? bodyType.selectedImage : bodyType.unselectedImage}
                    alt={bodyType.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                    unoptimized={true}
                  />
                </div>
                
                {/* Body Type Name */}
                <span className="text-[10px] font-[400] leading-[100%] tracking-[-0.02em] text-black">
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
    </SingleViewportLayout>
  );
};

export default BodyType;
