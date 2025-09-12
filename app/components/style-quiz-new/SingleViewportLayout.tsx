"use client";
import React from 'react';
import ProgressBar from './ProgressBar';
import QuizButton from './QuizButton';

interface SingleViewportLayoutProps {
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
  isFormValid?: boolean;
  isLoading?: boolean;
  nextButtonText?: string;
  showBackButton?: boolean;
  hasExtendedFlow?: boolean; // For users with inspired-by-vibe or self-expressive
  onStartOver?: () => void; // Function to reset quiz to beginning
}

const SingleViewportLayout: React.FC<SingleViewportLayoutProps> = ({
  children,
  onNext,
  onBack,
  currentStep = 1,
  totalSteps = 8,
  isFormValid = true,
  isLoading = false,
  nextButtonText = "Continue",
  showBackButton = true,
  hasExtendedFlow = false,
  onStartOver
}) => {
  return (
    <div className="min-h-screen flex flex-col md:bg-white/80 md:backdrop-blur-sm md:shadow-2xl md:rounded-2xl md:overflow-hidden" style={{ minHeight: '100dvh' }}>
      {/* Progress Bar - Fixed at top */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-4">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          hasExtendedFlow={hasExtendedFlow}
        />
      </div>

      {/* Back Arrow and Start Over - Below progress bar */}
      <div className="flex-shrink-0 px-4 pb-2 md:px-6 md:pb-4 flex justify-between items-center">
        {showBackButton && (
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50 group"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform duration-200"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        
        {/* Start Over Button - Show if we're past step 1 and onStartOver is provided */}
        {currentStep > 1 && onStartOver && (
          <button
            onClick={onStartOver}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            Start Over
          </button>
        )}
      </div>

      {/* Content Area - Flexible height with max constraint */}
      <div className="flex-1 px-4 py-4 md:px-6 md:py-6 flex flex-col overflow-y-auto">
        {children}
      </div>

      {/* Footer with Continue Button - Fixed at bottom */}
      <div className="flex-shrink-0 px-4 py-4 md:px-6 md:py-6 md:bg-gradient-to-r md:from-gray-50/50 md:to-white/50 md:border-t md:border-gray-200/50">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={onNext}
          disabled={!isFormValid || isLoading}
          className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? 'Loading...' : nextButtonText}
        </QuizButton>
      </div>
    </div>
  );
};

export default SingleViewportLayout;
