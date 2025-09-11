import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  className = "" 
}) => {
  // Progress logic: personal(1) -> bodytype(2) -> coloranalysis(3) -> styleorigin(4) -> outfit swipe(5+) = complete
  const getCompletedSegments = () => {
    if (currentStep <= 4) {
      // Progress one step at a time for first 4 steps
      return currentStep;
    } else {
      // At outfit swipe (step 5+) and beyond, show all segments complete
      return 5;
    }
  };

  const completedSegments = getCompletedSegments();

  return (
    <div className={`w-full ${className}`}>
      <div className="flex w-full h-[5px] gap-[2px]">
        {Array.from({ length: 5 }, (_, index) => (
          <div 
            key={index}
            className={`h-full rounded-full ${
              index < completedSegments ? 'bg-green-500' : 'bg-gray-200'
            } ${
              index === 4 ? 'w-[126px]' : 'flex-1'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
