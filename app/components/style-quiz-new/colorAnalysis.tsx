"use client";
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import QuizButton from './QuizButton';

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
            Colors that love you back
          </h1>
          <p className="text-gray-600 text-base">
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
                  w-full aspect-[1/3] rounded-sm transition-all duration-200
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
          <p className="text-xs text-gray-500 italic text-center">
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
              <p className="text-gray-700 font-medium">
                Selected: {getSelectedToneName()}
              </p>
              <span className="text-green-500">✓</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Additional spacing to push button to bottom */}
        <div className="flex-1" />
      </div>

      {/* Footer with Continue Button */}
      <div className="px-6 pb-8">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedTone}
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

export default ColorAnalysis;