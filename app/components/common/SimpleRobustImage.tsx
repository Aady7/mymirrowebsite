"use client";

import { useState } from "react";
import Image from "next/image";

interface SimpleRobustImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  [key: string]: any;
}

const SimpleRobustImage = ({ 
  src, 
  alt, 
  className = "", 
  onLoad: customOnLoad,
  onError: customOnError,
  ...props 
}: SimpleRobustImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    console.log(`✅ Simple image loaded: ${src}`);
    setHasError(false);
    customOnLoad?.();
  };

  const handleImageError = () => {
    console.log(`❌ Simple image failed: ${src}`);
    setHasError(true);
    customOnError?.();
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={props.fill ? {} : { width: props.width, height: props.height }}
      >
        <div className="text-center p-2">
          <div className="text-gray-400 mb-1">
            <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500">Failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onLoad={handleImageLoad}
      onError={handleImageError}
      className={className}
      {...props}
    />
  );
};

export default SimpleRobustImage; 