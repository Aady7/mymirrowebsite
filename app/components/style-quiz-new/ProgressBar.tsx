import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  hasExtendedFlow?: boolean; // For users with inspired-by-vibe or self-expressive
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  className = "",
  hasExtendedFlow = false
}) => {
  // Determine total segments based on flow type
  const totalSegments = hasExtendedFlow ? 6 : 5;
  
  // Progress logic based on flow type
  const getCompletedSegments = () => {
    if (hasExtendedFlow) {
      // Extended flow: personal(1) -> bodytype(2) -> coloranalysis(3) -> styleorigin(4) -> stylevibe(5) -> ansquestion(6) -> outfit swipe(7+) = complete
      if (currentStep <= 6) {
        return currentStep;
      } else {
        // At outfit swipe (step 7+) and beyond, show all segments complete
        return 6;
      }
    } else {
      // Standard flow: personal(1) -> bodytype(2) -> coloranalysis(3) -> styleorigin(4) -> outfit swipe(5+) = complete
      if (currentStep <= 4) {
        return currentStep;
      } else {
        // At outfit swipe (step 5+) and beyond, show all segments complete
        return 5;
      }
    }
  };

  const completedSegments = getCompletedSegments();
  const lastSegmentIndex = totalSegments - 1;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex w-full h-[5px] gap-[2px]">
        {Array.from({ length: totalSegments }, (_, index) => (
          <div 
            key={index}
            className={`h-full rounded-full ${
              index < completedSegments ? 'bg-green-500' : 'bg-gray-200'
            } ${
              index === lastSegmentIndex ? 'w-[126px]' : 'flex-1'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
