"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// Removed imports for FashionTarot and Stylist as they're handled separately
import SectionLoader from "@/app/components/common/SectionLoader";
import SectionError from "@/app/components/common/SectionError";
import { useAuthenticatedOutfitData } from "@/lib/hooks/useAuthenticatedOutfitData";
import { generateOutfit, fetchUserOutfits } from "@/app/utils/outfitsapi";
import { cache } from "@/lib/utils/cache";

const StylistSays = () => {
  const { outfitData, isLoading, error, refetch } = useAuthenticatedOutfitData();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [allOutfitsMode, setAllOutfitsMode] = useState(false);
  const [allOutfits, setAllOutfits] = useState<any[]>([]);

  const handleRetry = () => {
    refetch(true); // Force refresh on retry
  };

  const handleRegenerate = async () => {
    if (!outfitData?.userId) return;
    
    setIsRegenerating(true);
    try {
      // Clear all cache before regenerating
      cache.clear();
      
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

      // Force refresh the outfit data after regeneration
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
    try {
      // Fetch all outfits for the user (no limit)
      const result = await fetchUserOutfits({ userId: outfitData.userId });
      setAllOutfits(result?.outfits || []);
    } catch (err) {
      // fallback: show error or fallback to current outfits
      setAllOutfits([]);
    } finally {
      setIsLoadingAll(false);
    }
  };

  if (isLoading || isLoadingAll) {
    return <SectionLoader text="Loading your curated looks..." />;
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
      <div className="max-w-7xl mx-auto">
        {/*curated looks just for you*/}
        <div className="p-2 mt-10 md:p-6 lg:p-8">
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
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:mt-12">
            {(allOutfitsMode ? allOutfits : outfitData?.userOutfits || []).map((outfit, index) => (
              <div 
                key={outfit.main_outfit_id}
                className={`${
                  index === 0 ? 'md:col-span-2 lg:col-span-1' : 'md:col-span-1'
                } p-7 flex flex-col`}
              >
                {/* Look header section */}
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-semibold md:text-lg">
                    LOOK {index + 1}
                  </h3>
                  <h3 className="text-sm font-semibold md:hidden">
                    {outfit.outfit_name}
                  </h3>
                </div>

                {/* Images container - Fixed height for all layouts */}
                <div className="h-[400px] flex-grow">
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
                </div>

                {/* View More Button */}
                <div className="flex justify-end mt-2">
                  <Link href={`/looks/${outfit.main_outfit_id}`}>
                    <Button className="bg-[#007e90] hover:bg-[#006d7d] rounded-none w-20 h-6 md:h-8 md:w-25 md:px-6 text-xs transition-colors">
                      EXPLORE
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View More and Regenerate Buttons */}
          <div className="flex flex-row gap-4 justify-center items-center mt-8 px-4">
            {allOutfitsMode ? (
              <button
                onClick={() => { setAllOutfitsMode(false); setAllOutfits([]); }}
                className="flex-1 max-w-[200px] h-12 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                Show Less
              </button>
            ) : (
              <button
                onClick={handleViewMore}
                disabled={allOutfitsMode}
                className="flex-1 max-w-[200px] h-12 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors disabled:opacity-50"
              >
                More Outfits
              </button>
            )}
            <Button 
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex-1 max-w-[200px] h-12 px-8 bg-[#007e90] hover:bg-[#006d7d] text-white rounded-lg transition-colors disabled:opacity-50"
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
