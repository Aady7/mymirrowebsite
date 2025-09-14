import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PrivacyToggleProps {
  isPublic: boolean;
  onToggle: (isPublic: boolean) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const PrivacyToggle: React.FC<PrivacyToggleProps> = ({
  isPublic,
  onToggle,
  disabled = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      await onToggle(!isPublic);
    } catch (error) {
      console.error('Error toggling privacy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Privacy Status Badge */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isPublic ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className={`text-sm font-medium ${isPublic ? 'text-green-700' : 'text-yellow-700'}`}>
          {isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {/* Toggle Switch */}
      <motion.button
        onClick={handleToggle}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
          ${isPublic ? 'bg-green-600' : 'bg-gray-300'}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
        `}
        whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      >
        <motion.span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
            ${isPublic ? 'translate-x-6' : 'translate-x-1'}
          `}
          layout
        />
        
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.button>

      {/* Privacy Description */}
      <div className="flex flex-col">
        <p className="text-xs text-gray-600">
          {isPublic ? 'Anyone can view this lookbook' : 'Only you can view this lookbook'}
        </p>
        {isPublic && (
          <p className="text-xs text-gray-500">
            Shareable via direct link
          </p>
        )}
      </div>
    </div>
  );
};

export default PrivacyToggle;
