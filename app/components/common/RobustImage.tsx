"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface RobustImageProps {
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

const RobustImage = ({ 
  src, 
  alt, 
  className = "", 
  onLoad: customOnLoad,
  onError: customOnError,
  ...props 
}: RobustImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully: ${imageSrc}`);
    setIsLoading(false);
    setHasError(false);
    customOnLoad?.();
  };

  const handleImageError = () => {
    console.log(`Image failed to load: ${imageSrc}, retry count: ${retryCount}`);
    setIsLoading(false);
    
    if (retryCount < maxRetries) {
      // Add cache-busting parameter and retry
      const cacheBuster = `?retry=${retryCount + 1}&t=${Date.now()}`;
      const newSrc = src.includes('?') ? `${src}&cb=${Date.now()}` : `${src}${cacheBuster}`;
      setImageSrc(newSrc);
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      customOnError?.();
    }
  };

  const handleManualRetry = () => {
    setRetryCount(0);
    setHasError(false);
    setIsLoading(true);
    const cacheBuster = `?manual=${Date.now()}`;
    const newSrc = src.includes('?') ? `${src}&cb=${Date.now()}` : `${src}${cacheBuster}`;
    setImageSrc(newSrc);
  };

  // Reset when src prop changes
  useEffect(() => {
    console.log(`🖼️ RobustImage initializing with src: ${src}`);
    setImageSrc(src);
    setRetryCount(0);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={props.fill ? {} : { width: props.width, height: props.height }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 mb-2">Image unavailable</p>
          <button
            onClick={handleManualRetry}
            className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 border border-blue-300 rounded hover:border-blue-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={false}
        unoptimized={retryCount > 0} // Disable optimization on retries
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default RobustImage; 