"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import ProgressBar from './ProgressBar';
import QuizButton from './QuizButton';

interface StyleOriginProps {
  onNext?: (data: StyleOriginData) => void;
  onBack?: () => void;
  initialData?: Partial<StyleOriginData>;
  currentStep?: number;
  totalSteps?: number;
  gender?: 'Female' | 'Male' | 'Other' | '';
}

export interface StyleOriginData {
  styleOrigin: string;
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
  gender = 'Male'
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>(
    initialData?.styleOrigin || ''
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
    setSelectedStyle(styleId);
    if (error) {
      setError('');
    }
  };

  const handleContinue = () => {
    if (!selectedStyle) {
      setError('Please select your style origin');
      return;
    }

    const data: StyleOriginData = {
      styleOrigin: selectedStyle
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
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
                  ${selectedStyle === style.id 
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
                  />
                </div>
                
                {/* Style Name */}
                <h3 className="text-xs font-semibold text-black leading-tight">
                  {style.name}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Footer with Continue Button */}
      <div className="px-6 pb-8">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedStyle}
          className="w-full"
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

export default StyleOrigin;