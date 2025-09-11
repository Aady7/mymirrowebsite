"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import SingleViewportLayout from './SingleViewportLayout';

interface StyleOriginProps {
  onNext?: (data: StyleOriginData) => void;
  onBack?: () => void;
  initialData?: Partial<StyleOriginData>;
  currentStep?: number;
  totalSteps?: number;
  gender?: 'Female' | 'Male' | 'Other' | '';
  hasExtendedFlow?: boolean;
}

export interface StyleOriginData {
  styleOrigin: string[];
}

// Define style origins for each gender
const MALE_STYLES = [
  {
    id: 'trend-focused',
    name: 'Trend-Focused',
    image: '/assets/newstylequizimages/malestyle/maletrendfocused.svg',
    description: 'Staying current with the latest fashion trends'
  },
  {
    id: 'inspired-by-vibe',
    name: 'Inspired by a Vibe',
    image: '/assets/newstylequizimages/malestyle/meninspiredbyavibe.svg',
    description: 'Drawing inspiration from moods and atmospheres'
  },
  {
    id: 'self-expressive',
    name: 'Self-Expressive',
    image: '/assets/newstylequizimages/malestyle/menselfexpressive.svg',
    description: 'Expressing your unique personality through style'
  }
];

const FEMALE_STYLES = [
  {
    id: 'trend-focused',
    name: 'Trend-Focused',
    image: '/assets/newstylequizimages/femalestyle/femaletrendfocused.svg',
    description: 'Staying current with the latest fashion trends'
  },
  {
    id: 'inspired-by-vibe',
    name: 'Inspired by a Vibe',
    image: '/assets/newstylequizimages/femalestyle/femaleinspiredbyvibe.svg',
    description: 'Drawing inspiration from moods and atmospheres'
  },
  {
    id: 'self-expressive',
    name: 'Self-Expressive',
    image: '/assets/newstylequizimages/femalestyle/femaleselfexpressive.svg',
    description: 'Expressing your unique personality through style'
  }
];

const StyleOrigin: React.FC<StyleOriginProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 4,
  totalSteps = 8,
  gender = 'Male',
  hasExtendedFlow = false
}) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    initialData?.styleOrigin || []
  );
  const [error, setError] = useState<string>('');

  // Get styles based on gender
  const getStyles = () => {
    if (gender === 'Female') {
      return FEMALE_STYLES;
    } else {
      // Default to male styles for 'Male', 'Other', or empty
      return MALE_STYLES;
    }
  };

  const styles = getStyles();

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        // Remove if already selected
        return prev.filter(id => id !== styleId);
      } else {
        // Add if not selected
        return [...prev, styleId];
      }
    });
    if (error) {
      setError('');
    }
  };

  const handleContinue = () => {
    if (selectedStyles.length === 0) {
      setError('Please select at least one style origin');
      return;
    }

    const data: StyleOriginData = {
      styleOrigin: selectedStyles
    };

    onNext?.(data);
  };

  return (
    <SingleViewportLayout
      onNext={handleContinue}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={selectedStyles.length > 0}
      nextButtonText="Continue"
      showBackButton={currentStep > 1}
      hasExtendedFlow={hasExtendedFlow}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
          Where does your style come from?
        </h1>
      </div>

      {/* Style Options Grid */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={`
                w-full p-3 border-2 rounded-2xl transition-all duration-200 
                flex flex-col items-center text-center
                ${selectedStyles.includes(style.id) 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              {/* Style Image */}
              <div className="relative w-full aspect-square mb-3">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 120px"
                  unoptimized={true}
                />
              </div>
              
              {/* Style Name */}
              <h3 className="text-[14px] font-[400] leading-tight tracking-[-0.02em] text-black">
                {style.name}
              </h3>
            </button>
          ))}
        </div>
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

export default StyleOrigin;