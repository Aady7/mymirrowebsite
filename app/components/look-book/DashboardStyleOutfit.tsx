import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface DashboardStyleOutfitProps {
  leftImageUrl: string;
  rightImageUrl: string;
  outfitName: string;
  topTitle?: string;
  bottomTitle?: string;
  category?: string;
  onView?: () => void;
}

const DashboardStyleOutfit: React.FC<DashboardStyleOutfitProps> = ({ 
  leftImageUrl, 
  rightImageUrl, 
  outfitName,
  topTitle,
  bottomTitle,
  category,
  onView
}) => {
  // Check if it's a single piece (dress) or two-piece outfit
  const isSinglePiece = !rightImageUrl || rightImageUrl === leftImageUrl || rightImageUrl === '/assets/logo.png';

  return (
    <motion.div 
      className={`group ${onView ? 'cursor-pointer' : ''}`}
      whileHover={{ scale: onView ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (onView) {
          e.preventDefault();
          e.stopPropagation();
          onView();
        }
      }}
    >
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/60 transition-all duration-300 ${onView ? 'hover:shadow-xl hover:border-gray-300' : ''}`}>
        {/* Images container with enhanced styling */}
        <div className="px-6 pt-6 pb-4">
          <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 bg-gradient-to-br from-gray-50 to-white h-[400px]">
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {isSinglePiece ? (
              /* Single dress layout with enhanced styling */
              <div className="h-full relative">
                <Image
                  src={leftImageUrl}
                  alt={topTitle || outfitName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Product label overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200/60 shadow-lg">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {topTitle || outfitName}
                    </p>
                    <p className="text-xs text-gray-500 font-light">
                      Single Piece
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Two-piece outfit layout with enhanced styling */
              <div className="flex gap-1 h-full">
                {/* Top garment */}
                <div className="flex-1 relative">
                  <Image
                    src={leftImageUrl}
                    alt={topTitle || `${outfitName} top`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
                {/* Bottom garment */}
                <div className="flex-1 relative">
                  <Image
                    src={rightImageUrl}
                    alt={bottomTitle || `${outfitName} bottom`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Outfit info section */}
        <div className="px-6 pb-6">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight break-words">
              {outfitName}
            </h3>
            {category && (
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                {category}
              </p>
            )}
            {onView && (
              <p className="text-xs text-gray-400 mt-2">
                Click to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardStyleOutfit;
