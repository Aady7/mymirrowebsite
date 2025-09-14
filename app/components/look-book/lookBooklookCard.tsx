import React, { useState, useEffect, useRef } from 'react';
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
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Validate and provide fallback for imageUrl
  const validImageUrl = (() => {
    if (!imageUrl) return '/assets/logo.png';
    
    try {
      // Try to create URL to validate
      new URL(imageUrl);
      return imageUrl;
    } catch {
      // If not a valid URL, check if it's a relative path
      if (imageUrl.startsWith('/')) return imageUrl;
      
      // Otherwise use fallback
      console.warn('Invalid image URL provided to LookBookCard:', imageUrl);
      return '/assets/logo.png';
    }
  })();

  const handleMenuAction = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  return (
    <div 
      className="relative w-full h-full rounded-3xl p-6 shadow-xl overflow-hidden group transition-all duration-300 hover:scale-105"
      style={{ backgroundColor }}
    >
      {/* Header with title and three-dot menu */}
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-white font-bold text-lg sm:text-xl leading-tight max-w-[200px]">
          {heading}
        </h2>
        
        {/* Three-dot menu */}
        {(onEdit || onShare || onDelete) && (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg"
              aria-label="More options"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[140px]">
                {onEdit && (
                  <button
                    onClick={() => handleMenuAction(onEdit)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={() => handleMenuAction(onShare)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => handleMenuAction(onDelete)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
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
            src={validImageUrl}
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

      {/* View Lookbook Button at Bottom */}
      {onView && (
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="w-full bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-3 rounded-xl font-semibold shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
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
