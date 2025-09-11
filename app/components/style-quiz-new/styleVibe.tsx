"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import SingleViewportLayout from './SingleViewportLayout';

interface StyleVibeProps {
  onNext?: (data: StyleVibeData) => void;
  onBack?: () => void;
  initialData?: Partial<StyleVibeData>;
  currentStep?: number;
  totalSteps?: number;
  gender?: 'Female' | 'Male' | 'Other' | '';
}

export interface StyleVibeData {
  styleVibes: string[];
}

// Define style vibes for each gender
const MALE_STYLE_VIBES = [
  {
    id: 'streetwear-casual',
    name: 'Streetwear Casual',
    image: '/assets/newstylequizimages/maleStyleVibe/streetwearcasual.svg',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal & clean',
    image: '/assets/newstylequizimages/maleStyleVibe/minimal&clean.svg',
  },
  {
    id: 'old-money',
    name: 'Old money',
    image: '/assets/newstylequizimages/maleStyleVibe/oldmoney.svg',
  },
  {
    id: 'sporty-athleisure',
    name: 'Sporty athleisure',
    image: '/assets/newstylequizimages/maleStyleVibe/sportyathleisure.svg',
  },
  {
    id: 'bold-statement',
    name: 'Bold & statement',
    image: '/assets/newstylequizimages/maleStyleVibe/bold&statement.svg',
  }
];

const FEMALE_STYLE_VIBES = [
  {
    id: 'streetwear-chic',
    name: 'Streetwear chic',
    image: '/assets/newstylequizimages/femaleStyleVibe/streetwearchic.svg',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal & clean',
    image: '/assets/newstylequizimages/femaleStyleVibe/minimal&aclean.svg',
  },
  {
    id: 'soft-feminine',
    name: 'Soft & feminine',
    image: '/assets/newstylequizimages/femaleStyleVibe/soft&feminine.svg',
  },
  {
    id: 'sporty-athleisure',
    name: 'Sporty athleisure',
    image: '/assets/newstylequizimages/femaleStyleVibe/sporty&athleisurefem.svg',
  },
  {
    id: 'bold-statement',
    name: 'Bold & statement',
    image: '/assets/newstylequizimages/femaleStyleVibe/bold&statementfem.svg',
  }
];

const StyleVibe: React.FC<StyleVibeProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 5,
  totalSteps = 8,
  gender = 'Male'
}) => {
  const [selectedVibes, setSelectedVibes] = useState<string[]>(
    initialData?.styleVibes || []
  );
  const [error, setError] = useState<string>('');

  // Get style vibes based on gender
  const getStyleVibes = () => {
    if (gender === 'Female') {
      return FEMALE_STYLE_VIBES;
    } else {
      // Default to male styles for 'Male', 'Other', or empty
      return MALE_STYLE_VIBES;
    }
  };

  const styleVibes = getStyleVibes();

  const handleVibeSelect = (vibeId: string) => {
    setSelectedVibes(prev => {
      if (prev.includes(vibeId)) {
        // Remove if already selected
        return prev.filter(id => id !== vibeId)
      } else {
        // Add if not selected
        return [...prev, vibeId]
      }
    });
    if (error) {
      setError('');
    }
  };

  const handleContinue = () => {
    if (selectedVibes.length === 0) {
      setError('Please select at least one style vibe');
      return;
    }

    const data: StyleVibeData = {
      styleVibes: selectedVibes
    };

    onNext?.(data);
  };

  return (
    <SingleViewportLayout
      onNext={handleContinue}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={selectedVibes.length > 0}
      nextButtonText="Continue"
      showBackButton={currentStep > 1}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
          Which style vibes do you relate to?
        </h1>
        <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
          Select all that apply
        </p>
      </div>

      {/* Style Vibes Grid */}
      <div className="mb-8 space-y-4">
        {/* Top row - 3 items */}
        <div className="grid grid-cols-3 gap-4">
          {styleVibes.slice(0, 3).map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => handleVibeSelect(vibe.id)}
              className={`
                w-full p-3 border-2 rounded-2xl transition-all duration-200 
                flex flex-col items-center text-center
                ${selectedVibes.includes(vibe.id) 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              {/* Style Image */}
              <div className="relative w-full aspect-[3/4] mb-3">
                <Image
                  src={vibe.image}
                  alt={vibe.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 120px"
                  unoptimized={true}
                />
              </div>
              
              {/* Style Name */}
              <h3 className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-black ">
                {vibe.name}
              </h3>
            </button>
          ))}
        </div>

        {/* Bottom row - 2 items centered */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-4 w-2/3">
            {styleVibes.slice(3, 5).map((vibe) => (
              <button
                key={vibe.id}
                onClick={() => handleVibeSelect(vibe.id)}
                className={`
                  w-full p-3 border-2 rounded-2xl transition-all duration-200 
                  flex flex-col items-center text-center
                  ${selectedVibes.includes(vibe.id) 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {/* Style Image */}
                <div className="relative w-full aspect-[3/4] mb-3">
                  <Image
                    src={vibe.image}
                    alt={vibe.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 30vw, 120px"
                  />
                </div>
                
                {/* Style Name */}
                <h3 className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-black">
                  {vibe.name}
                </h3>
              </button>
            ))}
          </div>
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

export default StyleVibe;
