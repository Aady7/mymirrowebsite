"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
// Removed imports for FashionTarot and Stylist as they're handled separately
import SectionLoader from "@/app/components/common/SectionLoader";
import SectionError from "@/app/components/common/SectionError";
import { useAuthenticatedOutfitData } from "@/lib/hooks/useAuthenticatedOutfitData";

const StylistSays = () => {
  const { outfitData, isLoading, error, refetch } = useAuthenticatedOutfitData();

  const handleRetry = () => {
    refetch(true); // Force refresh on retry
  };

  if (isLoading) {
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
            {outfitData?.userOutfits.map((outfit, index) => (
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
                    <Button className="bg-black rounded-none w-20 h-6 md:h-8 md:w-25 md:px-6 text-xs">
                      VIEW MORE
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StylistSays;
