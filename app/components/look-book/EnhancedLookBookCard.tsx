import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedLookBookCardProps {
  id: string;
  imageUrl: string;
  heading: string;
  backgroundColor?: string;
  avatarSticker?: string;
  customAvatarUrl?: string; // New: Custom uploaded photo
  creatorName?: string;
  creatorType?: 'user' | 'influencer' | 'celebrity';
  verificationBadge?: 'verified' | 'gold' | 'diamond' | null;
  likesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isPremium?: boolean;
  priceTier?: 'free' | 'premium' | 'exclusive';
  bio?: string;
  socialLinks?: { instagram?: string; tiktok?: string; youtube?: string };
  onEdit?: () => void;
  onEnhancedEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onView?: () => void;
  onLike?: () => void;
  onUnlike?: () => void;
  currentUserId?: string;
  creatorId: string;
}

const EnhancedLookBookCard: React.FC<EnhancedLookBookCardProps> = ({ 
  id,
  imageUrl, 
  heading, 
  backgroundColor = "#B58CD2",
  avatarSticker,
  customAvatarUrl,
  creatorName = "Anonymous",
  creatorType = 'user',
  verificationBadge,
  likesCount,
  viewsCount,
  isLiked = false,
  isPremium = false,
  priceTier = 'free',
  bio,
  socialLinks,
  onEdit, 
  onEnhancedEdit,
  onDelete,
  onShare,
  onView,
  onLike,
  onUnlike,
  currentUserId,
  creatorId
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const [showCreatorInfo, setShowCreatorInfo] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwnLookbook = currentUserId === creatorId;

  useEffect(() => {
    setLocalIsLiked(isLiked);
    setLocalLikesCount(likesCount);
  }, [isLiked, likesCount]);

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

  const handleLikeToggle = () => {
    if (localIsLiked) {
      setLocalIsLiked(false);
      setLocalLikesCount(prev => prev - 1);
      onUnlike?.();
    } else {
      setLocalIsLiked(true);
      setLocalLikesCount(prev => prev + 1);
      onLike?.();
    }
  };

  // Validation for imageUrl
  const validImageUrl = (() => {
    if (!imageUrl) return '/assets/logo.png';
    
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      if (imageUrl.startsWith('/')) return imageUrl;
      console.warn('Invalid image URL provided to LookBookCard:', imageUrl);
      return '/assets/logo.png';
    }
  })();

  const handleMenuAction = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  // Get verification badge display
  const getVerificationBadge = () => {
    if (!verificationBadge) return null;
    
    const badges = {
      verified: { icon: '✓', color: 'bg-blue-500', label: 'Verified' },
      gold: { icon: '★', color: 'bg-yellow-500', label: 'Gold Creator' },
      diamond: { icon: '💎', color: 'bg-purple-500', label: 'Diamond Creator' }
    };
    
    const badge = badges[verificationBadge];
    return (
      <div 
        className={`absolute -top-2 -right-2 w-6 h-6 ${badge.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-30`}
        title={badge.label}
      >
        {badge.icon}
      </div>
    );
  };

  // Format numbers (1K, 1M, etc.)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div 
      className="relative w-full h-full rounded-3xl shadow-xl overflow-hidden group transition-all duration-300 hover:scale-105"
      style={{ backgroundColor }}
      whileHover={{ y: -2 }}
      layout
    >

      {/* Header with creator info and menu */}
      <div className="relative p-4 sm:p-6 pb-2">
        {/* Creator Info Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Creator Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                {customAvatarUrl ? (
                  <Image
                    src={customAvatarUrl}
                    alt={creatorName}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {creatorName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            {/* Creator Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-sm truncate">
                  {creatorName}
                </h3>
                {/* Verification Badge next to name */}
                {verificationBadge && (
                  <span className="text-white text-sm">
                    {verificationBadge === 'verified' && '✓'}
                    {verificationBadge === 'gold' && '⭐'}
                    {verificationBadge === 'diamond' && '💎'}
                  </span>
                )}
              </div>
              <p className="text-white/80 text-xs truncate">{heading}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Share button */}
            {onShare && (
              <div className="relative">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                    setShowShareTooltip(true);
                    setTimeout(() => setShowShareTooltip(false), 2000);
                  }}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Share lookbook"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </motion.button>
                
                {/* Share Tooltip */}
                <AnimatePresence>
                  {showShareTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50"
                    >
                      Link copied to clipboard!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Menu Button */}
            {((isOwnLookbook && (onEdit || onDelete)) || onEnhancedEdit) && (
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
              <AnimatePresence>
                {showMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[140px]"
                  >
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
                    {onEnhancedEdit && (
                      <button
                        onClick={() => handleMenuAction(onEnhancedEdit)}
                        className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Advanced Edit
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Enhanced Decorative Grid Pattern */}
      <div className="absolute top-20 left-0 w-full h-2/3 opacity-30 pointer-events-none">
        {/* Animated grid lines */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-16 right-16 h-0.5 bg-white"
            style={{ top: `${4.5 + i * 1.5}rem` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-0.5 bg-white"
            style={{ 
              left: `${5 + i * 2}rem`, 
              top: `${2 + i * 0.5}rem`,
              height: `${6 - Math.abs(i - 3.5) * 0.5}rem`
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.4 + i * 0.05 }}
          />
        ))}
      </div>

      {/* Main image container with enhanced styling */}
      <div className="relative flex justify-center items-end px-6">
        {/* Enhanced white semi-circle background with gradient */}
        <div className="absolute bottom-0 w-64 h-32 bg-gradient-to-t from-white to-white/95 rounded-t-full shadow-lg"></div>
        
        {/* Main image with hover effects */}
        <motion.div 
          className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={validImageUrl}
            alt={heading}
            fill
            className="object-contain drop-shadow-lg"
            sizes="(max-width: 640px) 144px, 160px"
          />
        </motion.div>
        
        {/* Enhanced stickers with animation */}
        {avatarSticker && (
          <>
            {[
              { top: '5rem', left: '2rem', size: 'w-8 h-8', opacity: 'opacity-80', delay: 0 },
              { top: '6rem', right: '2.5rem', size: 'w-6 h-6', opacity: 'opacity-60', delay: 0.1 },
              { bottom: '4rem', left: '2.5rem', size: 'w-7 h-7', opacity: 'opacity-70', delay: 0.2 },
              { bottom: '5rem', right: '2rem', size: 'w-8 h-8', opacity: 'opacity-80', delay: 0.3 },
            ].map((sticker, index) => (
              <motion.div
                key={index}
                className={`absolute z-20 ${sticker.size}`}
                style={{ 
                  top: sticker.top, 
                  bottom: sticker.bottom, 
                  left: sticker.left, 
                  right: sticker.right 
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: sticker.delay, type: "spring" }}
              >
                <Image
                  src={avatarSticker}
                  alt="Avatar sticker"
                  fill
                  className={`object-contain ${sticker.opacity}`}
                  sizes="32px"
                />
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Enhanced Bottom Section with Engagement Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/20 to-transparent">
        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {/* Likes */}
            <motion.button
              onClick={handleLikeToggle}
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              whileTap={{ scale: 0.9 }}
              disabled={!onLike && !onUnlike}
            >
              <motion.div
                animate={localIsLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <svg 
                  className={`w-5 h-5 ${localIsLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
                  fill={localIsLiked ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.div>
              <span className="text-white text-sm font-medium">
                {formatNumber(localLikesCount)}
              </span>
            </motion.button>

            {/* Views */}
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-white text-sm">
                {formatNumber(viewsCount)}
              </span>
            </div>
          </div>

          {/* Status Badges - Right side */}
          <div className="flex items-center gap-2">
            {/* Premium Badge */}
            {isPremium && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                {priceTier === 'exclusive' ? '💎' : '⭐'}
              </div>
            )}
            
            {/* Creator Type Badge */}
            {creatorType !== 'user' && (
              <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                {creatorType === 'influencer' ? '👑' : '⭐'}
              </div>
            )}
          </div>
        </div>

        {/* View Lookbook Button with enhanced styling */}
        {onView && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="w-full bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-3 rounded-xl font-semibold shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Lookbook
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedLookBookCard;