import React from 'react';
import Image from 'next/image';

interface LookBookCardProps {
  imageUrl: string;
  heading: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LookBookCard: React.FC<LookBookCardProps> = ({ 
  imageUrl, 
  heading, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto bg-[#B58CD2] rounded-3xl p-6 shadow-xl overflow-hidden">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-white font-bold text-lg sm:text-xl leading-tight max-w-[200px]">
          {heading}
        </h2>
        
        <div className="flex gap-3">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="w-10 h-10 bg-white bg-opacity-40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-60 transition-all duration-200 shadow-lg"
              aria-label="Edit look"
            >
              <Image
                src="/LookBook/edit.svg"
                alt="Edit"
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={onDelete}
              className="w-10 h-10 bg-white bg-opacity-40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-60 transition-all duration-200 shadow-lg"
              aria-label="Delete look"
            >
              <Image
                src="/LookBook/delete.svg"
                alt="Delete"
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
          )}
        </div>
      </div>

      {/* Decorative grid pattern - positioned above white semicircle */}
      <div className="absolute top-8 left-0 w-full h-2/3 opacity-50 pointer-events-none">
        {/* Horizontal grid lines - full width */}
       
        <div className="absolute top-18 left-16 right-16  h-0.5 bg-white"></div>
        <div className="absolute top-24 left-16 right-16 h-0.5 bg-white"></div>
        <div className="absolute top-30 left-16 right-16 h-0.5 bg-white"></div>
        <div className="absolute top-36 left-16 right-16 h-0.5 bg-white"></div>
        
        {/* Vertical grid lines - varying heights, shorter on sides, longer in middle */}
       
        <div className="absolute top-34 left-20 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-30 left-24 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-24 left-28 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-20 left-32 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-15 left-36 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-10 left-44 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-10 left-52 w-0.5 h-28 bg-white"></div>
        <div className="absolute top-15 left-60 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-20 left-64 w-0.5 h-24 bg-white"></div>
        <div className="absolute top-24 left-68 w-0.5 h-20 bg-white"></div>
        <div className="absolute top-30 left-72 w-0.5 h-24 bg-white"></div>
                 <div className="absolute top-34 left-76 w-0.5 h-24 bg-white"></div>
      </div>

      {/* Main image container with white semi-circle background */}
      <div className="relative flex justify-center items-end">
        {/* White semi-circular background */}
        <div className="absolute bottom-0 w-64 h-32 bg-white rounded-t-full"></div>
        
        {/* Main image */}
        <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 mb-6">
          <Image
            src={imageUrl}
            alt={heading}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 144px, 160px"
          />
        </div>
         
        </div>
      </div>
  );
};

export default LookBookCard;
