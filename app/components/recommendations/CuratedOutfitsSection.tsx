"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
// Removed imports for FashionTarot and Stylist as they're handled separately
import SectionLoader from "@/app/components/common/SectionLoader";
import SectionError from "@/app/components/common/SectionError";
import { useAuthenticatedOutfitData } from "@/lib/hooks/useAuthenticatedOutfitData";
import { generateOutfit, fetchUserOutfits } from "@/app/utils/outfitsapi";
import { cache, CACHE_KEYS } from "@/lib/utils/cache";
import { trackEvent } from "@/lib/utils/analytics";

const StylistSays = () => {
  const { outfitData, isLoading, error, refetch } = useAuthenticatedOutfitData();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [allOutfitsMode, setAllOutfitsMode] = useState(false);
  const [allOutfits, setAllOutfits] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Persist state in sessionStorage to maintain view when navigating back
  useEffect(() => {
    const savedState = sessionStorage.getItem('curatedOutfits_viewMode');
    const savedOutfits = sessionStorage.getItem('curatedOutfits_allOutfits');
    
    if (savedState === 'all' && savedOutfits) {
      try {
        const parsedOutfits = JSON.parse(savedOutfits);
        setAllOutfitsMode(true);
        setAllOutfits(parsedOutfits);
      } catch (error) {
        console.error('Error parsing saved outfits:', error);
        sessionStorage.removeItem('curatedOutfits_viewMode');
        sessionStorage.removeItem('curatedOutfits_allOutfits');
      }
    }
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    if (allOutfitsMode && allOutfits.length > 0) {
      sessionStorage.setItem('curatedOutfits_viewMode', 'all');
      sessionStorage.setItem('curatedOutfits_allOutfits', JSON.stringify(allOutfits));
    } else {
      sessionStorage.setItem('curatedOutfits_viewMode', 'limited');
      sessionStorage.removeItem('curatedOutfits_allOutfits');
    }
  }, [allOutfitsMode, allOutfits]);

  // Removed minHeight logic - using simple scroll-to-loader approach instead

  const handleRetry = () => {
    refetch(true); // Force refresh on retry
  };

  const handleRegenerate = async () => {
    if (!outfitData?.userId) return;
    
    setIsRegenerating(true);
    
    // Scroll to loader immediately so user can see the regeneration progress
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
    try {
      // Clear related cache before regenerating
      cache.remove(`${CACHE_KEYS.USER_OUTFITS}_${outfitData.userId}`);
      cache.remove(`${CACHE_KEYS.GENERATED_OUTFITS}_${outfitData.userId}`);
      
      // Clear sessionStorage to reset view mode
      sessionStorage.removeItem('curatedOutfits_viewMode');
      sessionStorage.removeItem('curatedOutfits_allOutfits');
      
      // Call generate outfit API with regenerate: true
      const response = await fetch('/api/mymirrobackend/create-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: outfitData.userId,
          regenerate: true 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate outfits');
      }

      // Track outfit generation
      trackEvent.generateOutfit(String(outfitData.userId));
      
      // Reset to limited view mode when regenerating
      setAllOutfitsMode(false);
      setAllOutfits([]);
      
      // Wait a moment for backend to process, then force refresh the outfit data
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refetch(true);
    } catch (error) {
      console.error('Error regenerating outfits:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleViewMore = async () => {
    if (!outfitData?.userId) return;
    
    setIsLoadingAll(true);
    setAllOutfitsMode(true);
    
    // Scroll to loader immediately so user can see the loading progress
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
    try {
      // Fetch all outfits for the user (no limit)
      const result = await fetchUserOutfits({ 
        userId: outfitData.userId,
        forceRefresh: false // Use cache for "View More" to improve performance
      });
      setAllOutfits(result?.outfits || []);
      
      // Only scroll if user is not already viewing the section
      setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const isInView = rect.top >= 0 && rect.top <= window.innerHeight;
          
          // Only scroll if the section is not in view
          if (!isInView) {
            containerRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }
      }, 300); // Increased delay to let content load first
    } catch (err) {
      // fallback: show error or fallback to current outfits
      setAllOutfits([]);
      setAllOutfitsMode(false); // Reset mode on error
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleShowLess = () => {
    setAllOutfitsMode(false);
    setAllOutfits([]);
    
    // Scroll back to the section since content has shrunk
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  // Only show full-page loader for initial loading, not for view-all or regenerate
  if (isLoading && !isLoadingAll && !isRegenerating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SectionLoader text="Loading your curated looks..." />
      </div>
    );
  }

  if (error) {
    return (
      <SectionError 
        title="Unable to load outfits"
        message={error}
        onRetry={handleRetry}
        showQuizButton={error.includes("style quiz")}
        onTakeQuiz={() => window.location.href = '/style-quiz-new'}
      />
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/*curated looks just for you*/}
        <div 
          ref={containerRef}
          className="p-2 mt-10 md:p-6 lg:p-8"
        >
          <div className="flex flex-col items-center justify-center space-y-1 md:space-y-3">
            {/* Heading in a fixed width to control centering */}
            <h1 className="text-center font-[Boston] text-[18px] md:text-[25px] not-italic font-normal leading-normal w-[290px] md:w-auto">
              CURATED LOOKS JUST FOR YOU
            </h1>

            {/* Paragraph aligned under "U" by padding-left */}
            <div className="text-center">
              <p className="font-[Boston] text-[13px] md:text-[18px] not-italic font-normal leading-normal max-w-[280px] md:max-w-none mx-auto">
                Handpicked outfit combinations tailored to your unique style profile
              </p>
            </div>
          </div>

          {/* Looks section container */}
          <div className="relative">
            {/* Loading overlay for seamless transitions */}
            {(isLoadingAll || isRegenerating) && (
              <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007e90]"></div>
                  <p className="text-lg font-medium text-gray-800">
                    {isRegenerating ? "Regenerating your outfits..." : "Loading all outfits..."}
                  </p>
                  <p className="text-sm text-gray-600 text-center">
                    {isRegenerating ? "Creating fresh outfit combinations for you" : "Fetching your complete outfit collection"}
                  </p>
                </div>
              </div>
            )}
            
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:mt-12 transition-all duration-300 ease-in-out">
              {(allOutfitsMode ? allOutfits : outfitData?.userOutfits || []).map((outfit, index) => (
              <div 
                key={outfit.main_outfit_id}
                className={`${
                  index === 0 ? 'md:col-span-2 lg:col-span-1' : 'md:col-span-1'
                } p-7 flex flex-col opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Look header section */}
                <div className="flex justify-between mb-2">
                  <h3 className="text-xs font-semibold md:text-lg">
                    LOOK {index + 1}
                  </h3>
                  <h3 className="text-xs font-semibold md:hidden  ">
                    {outfit.outfit_name}
                  </h3>
                </div>

                {/* Images container - Fixed height for all layouts */}
                <div className="h-[400px] flex-grow">
                  {/* Check if bottom_id is "0000" to show single dress layout */}
                  {(outfit.bottom.id === "0000" || outfit.bottom.id === "0") ? (
                    /* Single dress layout */
                    <div className="h-full relative">
                      <Image
                        src={outfit.top.image}
                        alt={outfit.top.title}
                        fill
                        className="object-cover border-0"
                      />
                    </div>
                  ) : (
                    /* Two-piece outfit layout */
                    <div className="flex gap-2 h-full">
                      {/* Top garment */}
                      <div className="flex-1 h-full relative">
                        <Image
                          src={outfit.top.image}
                          alt={outfit.top.title}
                          fill
                          className="object-cover border-0"
                        />
                      </div>
                      {/* Bottom garment */}
                      <div className="flex-1 h-full relative">
                        <Image
                          src={outfit.bottom.image}
                          alt={outfit.bottom.title}
                          fill
                          className="object-cover border-0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* View More Button */}
                <div className="flex justify-end mt-2">
                  <Link href={
                    (outfit.bottom.id === "0000" || outfit.bottom.id === "0") 
                      ? `/products/${outfit.top.id}` 
                      : `/looks/${outfit.main_outfit_id}`
                  }>
                    <Button className="bg-[#007e90] hover:bg-[#006d7d] rounded-none w-20 h-6 md:h-8 md:w-25 md:px-6 text-xs transition-colors">
                      EXPLORE
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* View More and Regenerate Buttons */}
          <div className="flex flex-row gap-4 justify-center items-center mt-8 px-4">
            {allOutfitsMode ? (
              <button
                onClick={handleShowLess}
                disabled={isLoadingAll || isRegenerating}
                className="flex-1 max-w-[200px] h-12 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors disabled:opacity-50"
              >
                Show Less
              </button>
            ) : (
              <button
                onClick={handleViewMore}
                disabled={isLoadingAll || isRegenerating}
                className="flex-1 max-w-[200px] h-12 px-4 md:px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors disabled:opacity-50 text-sm md:text-sm whitespace-nowrap"
              >
                {isLoadingAll ? 'Loading...' : 'More Outfits'}
              </button>
            )}
            <Button 
              onClick={handleRegenerate}
              disabled={isRegenerating || isLoadingAll}
              className="flex-1 max-w-[200px] h-12 px-4 bg-[#007e90] hover:bg-[#006d7d] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isRegenerating ? 'Regenerating...' : 'Regenerate Outfits'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StylistSays;
