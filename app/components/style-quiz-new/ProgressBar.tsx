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
  // Create 6 segments for the progress bar
  const totalSegments = 6;
  const completedSegments = Math.min(Math.ceil((currentStep / totalSteps) * totalSegments), totalSegments);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex w-full h-3 gap-2">
        {Array.from({ length: totalSegments }, (_, index) => (
          <div 
            key={index}
            className={`flex-1 h-full rounded-full ${
              index < completedSegments ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
