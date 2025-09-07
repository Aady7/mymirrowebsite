"use client";
import React, { useState } from 'react';
import SingleViewportLayout from './SingleViewportLayout';

interface ColorAnalysisProps {
  onNext?: (data: ColorAnalysisData) => void;
  onBack?: () => void;
  initialData?: Partial<ColorAnalysisData>;
  currentStep?: number;
  totalSteps?: number;
}

export interface ColorAnalysisData {
  selectedTone: string;
  toneName: string;
}

// Skin tone colors matching the design
const SKIN_TONES = [
  { hex: "#F5E6D3", name: "Very Light" },
  { hex: "#E8C3B6", name: "Light" },
  { hex: "#E5BBB4", name: "Light Medium" },
  { hex: "#DCBAB3", name: "Medium Light" },
  { hex: "#C68B6A", name: "Medium" },
  { hex: "#BA8578", name: "Medium Tan" },
  { hex: "#B58578", name: "Medium Deep" },
  { hex: "#955D3B", name: "Deep" },
];

const ColorAnalysis: React.FC<ColorAnalysisProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 3,
  totalSteps = 8,
}) => {
  const [selectedTone, setSelectedTone] = useState<string>(
    initialData?.selectedTone || ''
  );
  const [error, setError] = useState<string>('');

  const handleToneSelect = (hex: string, name: string) => {
    setSelectedTone(hex);
    if (error) {
      setError('');
    }
  };

  const handleContinue = () => {
    if (!selectedTone) {
      setError('Please select your skin tone');
      return;
    }

    const selectedToneData = SKIN_TONES.find(tone => tone.hex === selectedTone);
    
    const data: ColorAnalysisData = {
      selectedTone,
      toneName: selectedToneData?.name || 'Unknown'
    };

    onNext?.(data);
  };

  const getSelectedToneName = () => {
    return SKIN_TONES.find(tone => tone.hex === selectedTone)?.name || '';
  };

  return (
    <SingleViewportLayout
      onNext={handleContinue}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={!!selectedTone}
      nextButtonText="Continue"
      showBackButton={currentStep > 1}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
          Colors that love you back
        </h1>
        <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
          Choose the one that's closest to your natural skin tone.
        </p>
      </div>

      {/* Skin Tone Selection */}
      <div className="mb-8">
        {/* Skin tone grid - 8 colors in a row */}
        <div className="grid grid-cols-8 gap-1 mb-4">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.hex}
              onClick={() => handleToneSelect(tone.hex, tone.name)}
              className={`
                w-full aspect-[1/3]  transition-all duration-200
                ${selectedTone === tone.hex
                  ? 'ring-2 ring-black ring-offset-2 scale-105'
                  : 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-1'
                }
              `}
              style={{ backgroundColor: tone.hex }}
              title={tone.name}
            />
          ))}
        </div>

        {/* Tip text */}
        <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-500 italic text-left">
          Tip: Choose the tone closest to your inner forearm or jawline.
        </p>
      </div>

      {/* Selected tone feedback */}
      {selectedTone && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: selectedTone }}
            />
            <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-700">
              Selected: {getSelectedToneName()}
            </p>
            <span className="text-green-500">✓</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-center">{error}</p>
        </div>
      )}
    </SingleViewportLayout>
  );
};

export default ColorAnalysis;