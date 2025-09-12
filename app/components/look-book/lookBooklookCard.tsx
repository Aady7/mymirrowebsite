import React from 'react';
import Image from 'next/image';

interface LookBookCardProps {
  imageUrl: string;
  heading: string;
  backgroundColor?: string;
  avatarSticker?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onView?: () => void;
}

const LookBookCard: React.FC<LookBookCardProps> = ({ 
  imageUrl, 
  heading, 
  backgroundColor = "#B58CD2",
  avatarSticker,
  onEdit, 
  onDelete,
  onShare,
  onView
}) => {
  return (
    <div 
      className="relative w-full h-full rounded-3xl p-6 shadow-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
      style={{ backgroundColor }}
      onClick={onView}
    >
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-white font-bold text-lg sm:text-xl leading-tight max-w-[200px]">
          {heading}
        </h2>
        
        <div className="flex gap-2">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-105 transition shadow border-1 border-black"
              aria-label="Edit look"
            >
              ✏️
            </button>
          )}
          
          {onShare && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-105 transition shadow border-1 border-black"
              aria-label="Share look"
            >
              📎
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-105 transition shadow border-1 border-black"
              aria-label="Delete look"
            >
              🗑️
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
        
        {/* Multiple stickers around character - like reference image */}
        {avatarSticker && (
          <>
            <div className="absolute top-20 left-8 z-20 w-8 h-8">
              <Image
                src={avatarSticker}
                alt="Avatar sticker"
                fill
                className="object-contain opacity-80"
                sizes="32px"
              />
            </div>
            <div className="absolute top-24 right-10 z-20 w-6 h-6">
              <Image
                src={avatarSticker}
                alt="Avatar sticker"
                fill
                className="object-contain opacity-60"
                sizes="24px"
              />
            </div>
            <div className="absolute bottom-16 left-10 z-20 w-7 h-7">
              <Image
                src={avatarSticker}
                alt="Avatar sticker"
                fill
                className="object-contain opacity-70"
                sizes="28px"
              />
            </div>
            <div className="absolute bottom-20 right-8 z-20 w-8 h-8">
              <Image
                src={avatarSticker}
                alt="Avatar sticker"
                fill
                className="object-contain opacity-80"
                sizes="32px"
              />
            </div>
          </>
        )}
      </div>

      {/* Hover Overlay with View Button */}
      {onView && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-3xl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 transform scale-90 group-hover:scale-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Lookbook
          </button>
        </div>
      )}
      </div>
  );
};

export default LookBookCard;
