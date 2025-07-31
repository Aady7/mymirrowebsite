import React from 'react';
import Image from 'next/image';

interface LookBookOutfitProps {
  leftImageUrl: string;
  rightImageUrl: string;
  outfitName: string;
}

const LookBookOutfit: React.FC<LookBookOutfitProps> = ({ 
  leftImageUrl, 
  rightImageUrl, 
  outfitName 
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto bg-[#B58CD2] rounded-3xl p-2 pb-4 shadow-xl overflow-hidden">
      {/* Grid container for side-by-side images */}
      <div className="grid grid-cols-2 gap-2 mb-6 h-[328px]">
        {/* Left Image */}
        <div className="relative w-full  bg-white rounded-2xl overflow-hidden">
          <Image
            src={leftImageUrl}
            alt={`${outfitName} left`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 140px, 160px"
          />
        </div>

        {/* Right Image */}
        <div className="relative w-full bg-white rounded-2xl overflow-hidden">
          <Image
            src={rightImageUrl}
            alt={`${outfitName} right`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 140px, 160px"
          />
        </div>
      </div>

      {/* Outfit Name - Bottom Left */}
      <div className="text-left">
        <h3 className="text-black font-bold text-lg sm:text-xl tracking-wide uppercase">
          {outfitName}
        </h3>
      </div>
    </div>
  );
};

export default LookBookOutfit;
