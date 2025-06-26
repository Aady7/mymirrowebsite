import React from 'react';

interface SectionErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
  showQuizButton?: boolean;
  onTakeQuiz?: () => void;
}

const SectionError: React.FC<SectionErrorProps> = ({ 
  title, 
  message, 
  onRetry, 
  showQuizButton = false, 
  onTakeQuiz 
}) => (
  <div className="flex flex-col items-center justify-center space-y-4 py-12">
    <div className="bg-[#007e90]/10 border border-[#007e90]/20 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-3">
        <svg className="w-5 h-5 text-[#007e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-sm font-medium text-[#006d7d]">{title}</h3>
      </div>
      <p className="text-sm text-[#007e90]/80 mb-4">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm"
        >
          Try Again
        </button>
        {showQuizButton && onTakeQuiz && (
          <button
            onClick={onTakeQuiz}
            className="px-4 py-2 bg-[#007e90]/20 text-[#006d7d] border border-[#007e90]/30 rounded-lg hover:bg-[#007e90]/30 transition-colors text-sm"
          >
            Take Style Quiz
          </button>
        )}
      </div>
    </div>
  </div>
);

export default SectionError; 