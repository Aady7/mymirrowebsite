"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { getSimilarOutfits } from "@/app/utils/outfitsapi";

// Global cache to prevent duplicate API calls across component instances
const globalApiCache = new Map<string, {
  promise: Promise<any> | null;
  data: any;
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to get similar outfits with global caching
const getCachedSimilarOutfits = async (outfitId: string, count: number = 10) => {
  const cacheKey = `${outfitId}_${count}`;
  const now = Date.now();
  
  // Check if we have cached data that's still valid
  const cached = globalApiCache.get(cacheKey);
  if (cached) {
    // If we have a valid cached result, return it
    if (cached.data && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('getCachedSimilarOutfits: Returning cached data for', cacheKey);
      return cached.data;
    }
    
    // If there's an ongoing promise, wait for it
    if (cached.promise) {
      console.log('getCachedSimilarOutfits: Waiting for ongoing API call for', cacheKey);
      return await cached.promise;
    }
  }
  
  // Create new API call promise
  console.log('getCachedSimilarOutfits: Making new API call for', cacheKey);
  const apiPromise = getSimilarOutfits(outfitId, count);
  
  // Store the promise immediately to prevent duplicate calls
  globalApiCache.set(cacheKey, {
    promise: apiPromise,
    data: null,
    timestamp: now
  });
  
  try {
    const result = await apiPromise;
    
    // Cache the result
    globalApiCache.set(cacheKey, {
      promise: null,
      data: result,
      timestamp: now
    });
    
    console.log('getCachedSimilarOutfits: API call completed and cached for', cacheKey);
    return result;
  } catch (error) {
    // Remove failed promise from cache
    globalApiCache.delete(cacheKey);
    throw error;
  }
};

interface SimilarOutfit {
  outfit_data: {
    main_outfit_id: string;
    top: {
      id: string;
      title: string;
      image: string;
    };
    bottom: {
      id: string;
      title: string;
      image: string;
    };
  };
  similarity_score: number;
}

interface SimilarOutfitsCarouselProps {
  onActiveOutfitChange?: (outfitId: string | null) => void;
}

const SimilarOutfitsCarousel = ({ onActiveOutfitChange }: SimilarOutfitsCarouselProps) => {
  const { id } = useParams();
  const [similarOutfits, setSimilarOutfits] = useState<SimilarOutfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  
  // Add ref to prevent duplicate API calls
  const hasFetched = useRef(false);
  const currentId = useRef<string | null>(null);
  const isApiCallInProgress = useRef(false);
  
  console.log('SimilarOutfitsCarousel render:', { 
    id, 
    isLoading, 
    outfitsCount: similarOutfits.length, 
    error,
    hasFetched: hasFetched.current,
    currentId: currentId.current,
    isApiCallInProgress: isApiCallInProgress.current
  });



  useEffect(() => {
    if (!id) return;
    
    const outfitId = String(id);
    console.log('useEffect triggered for ID:', outfitId);
    
    // Reset state when ID changes
    if (currentId.current !== outfitId) {
      console.log('ID changed, resetting state');
      hasFetched.current = false;
      isApiCallInProgress.current = false;
      setIsLoading(true);
      setSimilarOutfits([]);
      setError(null);
    }

    // Call the function directly to avoid dependency issues
    const callFetch = async () => {
      if (!outfitId) {
        setIsLoading(false);
        return;
      }
      
      // Prevent duplicate calls for the same ID
      if (hasFetched.current && currentId.current === outfitId) {
        console.log('Already fetched data for this ID, skipping');
        setIsLoading(false);
        return;
      }
      
      // Prevent multiple simultaneous API calls
      if (isApiCallInProgress.current) {
        console.log('API call already in progress, skipping duplicate call');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        setSimilarOutfits([]); // Clear previous data
        isApiCallInProgress.current = true;
        
        console.log('Calling getCachedSimilarOutfits with ID:', outfitId);
        console.log('API call started, isLoading set to true');
        
        const result = await getCachedSimilarOutfits(outfitId, 10);
        console.log('getCachedSimilarOutfits API call completed, result:', result);
        
        // Mark as fetched only after successful API call
        hasFetched.current = true;
        currentId.current = outfitId;
        
        if (result && result.similar_outfits) {
          console.log('Setting similar outfits:', result.similar_outfits.length, 'items');
          setSimilarOutfits(result.similar_outfits);
          setActiveSlideIndex(0); // Reset to first slide
        } else {
          console.log('No similar_outfits in result, setting empty array');
          setSimilarOutfits([]);
          setActiveSlideIndex(0);
        }
      } catch (err) {
        console.error('Error fetching similar outfits:', err);
        setError('Failed to load similar looks');
        hasFetched.current = false; // Reset on error to allow retry
        currentId.current = null;
      } finally {
        console.log('Setting isLoading to false');
        setIsLoading(false);
        isApiCallInProgress.current = false;
      }
    };

    callFetch();
    
    // Cleanup function to reset refs when component unmounts or id changes
    return () => {
      if (currentId.current !== outfitId) {
        hasFetched.current = false;
        isApiCallInProgress.current = false;
      }
    };
  }, [id]); // Only depend on id

  // Notify parent about active outfit changes
  useEffect(() => {
    const filteredOutfits = similarOutfits.filter(outfit => outfit.outfit_data.main_outfit_id !== id);
    if (filteredOutfits.length > 0 && activeSlideIndex < filteredOutfits.length) {
      const activeOutfit = filteredOutfits[activeSlideIndex];
      onActiveOutfitChange?.(activeOutfit.outfit_data.main_outfit_id);
    } else {
      onActiveOutfitChange?.(null);
    }
  }, [activeSlideIndex, similarOutfits, id, onActiveOutfitChange]);

  if (error) {
    console.log('SimilarOutfitsCarousel: Showing error');
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600 mb-2">{error}</p>
          <button
            onClick={async () => {
              if (!id) return;
              
              const outfitId = String(id);
              setError(null);
              hasFetched.current = false;
              currentId.current = null;
              isApiCallInProgress.current = false;
              
              // Clear cache for this outfit to force fresh API call
              const cacheKey = `${outfitId}_10`;
              globalApiCache.delete(cacheKey);
              console.log('Retry: Cleared cache for', cacheKey);
              
              // Retry the API call
              try {
                setIsLoading(true);
                setSimilarOutfits([]);
                isApiCallInProgress.current = true;
                
                console.log('Retry: Calling getCachedSimilarOutfits with ID:', outfitId);
                const result = await getCachedSimilarOutfits(outfitId, 10);
                console.log('Retry: getCachedSimilarOutfits API call completed, result:', result);
                
                hasFetched.current = true;
                currentId.current = outfitId;
                
                if (result && result.similar_outfits) {
                  setSimilarOutfits(result.similar_outfits);
                } else {
                  setSimilarOutfits([]);
                }
              } catch (err) {
                console.error('Retry: Error fetching similar outfits:', err);
                setError('Failed to load similar looks');
                hasFetched.current = false;
                currentId.current = null;
              } finally {
                setIsLoading(false);
                isApiCallInProgress.current = false;
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while API call is in progress
  if (isLoading) {
    console.log('SimilarOutfitsCarousel: Still loading, showing loader');
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007e90]"></div>
        <p className="text-gray-600">Loading similar looks...</p>
      </div>
    );
  }

  // Filter out current outfit if it exists in similarOutfits
  const filteredOutfits = similarOutfits.filter(outfit => outfit.outfit_data.main_outfit_id !== id);
  console.log('Filtered outfits:', { total: similarOutfits.length, filtered: filteredOutfits.length });

  // Only show "no results" if we're not loading AND have actually completed the fetch
  if (!isLoading && filteredOutfits.length === 0 && hasFetched.current) {
    console.log('SimilarOutfitsCarousel: Showing no results (completed fetch)');
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">No similar looks found</p>
      </div>
    );
  }

  console.log('SimilarOutfitsCarousel: Showing carousel with', filteredOutfits.length, 'outfits');
  
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={12}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
      }}
      pagination={{ clickable: true }}
      navigation={true}
      loop={true}
      onSlideChange={(swiper) => {
        setActiveSlideIndex(swiper.realIndex);
      }}
      className="w-full max-w-none relative group mt-8"
    >
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          width: 25px !important;
          height: 25px !important;
          background: none !important;
          opacity: 1;
          transition: opacity 0.3s;
          top: 50% !important;
        }
        
        .swiper-button-next {
          right: -8px !important;
        }
        
        .swiper-button-prev {
          left: -8px !important;
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 14px !important;
          font-weight: bold;
          color: #333;
        }

        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }
      `}</style>

      {filteredOutfits.map((outfit) => (
        <SwiperSlide key={outfit.outfit_data.main_outfit_id}>
          <div className="flex gap-2 h-[300px] ml-4 mr-4 mt-6">
            {/* Top garment */}
            <div className="flex-1 relative">
              <Image
                src={outfit.outfit_data.top.image}
                alt={outfit.outfit_data.top.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Bottom garment */}
            <div className="flex-1 relative">
              <Image
                src={outfit.outfit_data.bottom.image}
                alt={outfit.outfit_data.bottom.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SimilarOutfitsCarousel;
