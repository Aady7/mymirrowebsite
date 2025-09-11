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
  hasExtendedFlow = false
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ minHeight: '100dvh' }}>
      {/* Progress Bar - Fixed at top */}
      <div className="flex-shrink-0 px-6 pt-4 pb-2">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          hasExtendedFlow={hasExtendedFlow}
        />
      </div>

      {/* Back Arrow - Below progress bar */}
      {showBackButton && (
        <div className="flex-shrink-0 px-6 pb-2">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors disabled:opacity-50"
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
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      )}

      {/* Content Area - Flexible height with max constraint */}
      <div className="flex-1 px-6 py-4 flex flex-col overflow-y-auto">
        {children}
      </div>

      {/* Footer with Continue Button - Fixed at bottom */}
      <div className="flex-shrink-0 px-6 py-3 bg-white border-t border-gray-100">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={onNext}
          disabled={!isFormValid || isLoading}
          className="w-full"
        >
          {isLoading ? 'Loading...' : nextButtonText}
        </QuizButton>
      </div>
    </div>
  );
};

export default SingleViewportLayout;
