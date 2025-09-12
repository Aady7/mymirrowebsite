"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AddToLookbookModal from './AddToLookbookModal';

interface AddToLookbookButtonProps {
  itemId: string;
  itemType: 'outfit' | 'product';
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AddToLookbookButton: React.FC<AddToLookbookButtonProps> = ({
  itemId,
  itemType,
  className = '',
  iconOnly = false,
  size = 'md'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (iconOnly) {
    return (
      <>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`${sizeClasses[size]} ${className} ${
            showSuccess 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          } rounded-full flex items-center justify-center shadow-sm transition-all duration-200`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {showSuccess ? (
            <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </motion.button>

        <AddToLookbookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemId={itemId}
          itemType={itemType}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className={`${className} ${
          showSuccess 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white'
        } px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showSuccess ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Lookbook
          </>
        )}
      </motion.button>

      <AddToLookbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemId={itemId}
        itemType={itemType}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default AddToLookbookButton;
