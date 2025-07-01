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
        
        console.log('Calling getSimilarOutfits with ID:', outfitId);
        console.log('API call started, isLoading set to true');
        
        const result = await getSimilarOutfits(outfitId, 10, false); // Use cache
        console.log('getSimilarOutfits API call completed, result:', result);
        
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
              
              // Retry the API call with force refresh to clear cache
              try {
                setIsLoading(true);
                setSimilarOutfits([]);
                isApiCallInProgress.current = true;
                
                console.log('Retry: Calling getSimilarOutfits with ID:', outfitId);
                const result = await getSimilarOutfits(outfitId, 10, true); // Force refresh to clear cache
                console.log('Retry: getSimilarOutfits API call completed, result:', result);
                
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
          <Link href={`/looks/${outfit.outfit_data.main_outfit_id}`} className="block group h-full w-full">
            <div className="flex gap-2 h-[300px] ml-4 mr-4 mt-6 group-hover:scale-105 group-hover:shadow-lg transition-transform duration-200">
              {/* Top garment */}
              <div className="flex-1 relative">
                <Image
                  src={outfit.outfit_data.top.image}
                  alt={outfit.outfit_data.top.title}
                  fill
                  className="object-cover rounded-tl-lg rounded-bl-lg"
                />
              </div>
              {/* Bottom garment */}
              <div className="flex-1 relative">
                <Image
                  src={outfit.outfit_data.bottom.image}
                  alt={outfit.outfit_data.bottom.title}
                  fill
                  className="object-cover rounded-tr-lg rounded-br-lg"
                />
              </div>
            </div>
            <div className="text-center mt-2 text-sm font-medium text-[#007e90] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View Look
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SimilarOutfitsCarousel;
