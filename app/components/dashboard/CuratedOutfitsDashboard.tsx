"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import SectionLoader from "@/app/components/common/SectionLoader";
import SectionError from "@/app/components/common/SectionError";
import { useDashboardOutfits, getUserLikedCategories, DashboardOutfit } from "@/lib/hooks/useDashboardOutfits";
import { trackEvent } from "@/lib/utils/analytics";
import RobustImage from "@/app/components/common/RobustImage";

interface CuratedOutfitsDashboardProps {
  quizData?: any;
}

const CuratedOutfitsDashboard = ({ quizData }: CuratedOutfitsDashboardProps) => {
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [allOutfitsMode, setAllOutfitsMode] = useState(false);
  const [globalImageRefresh, setGlobalImageRefresh] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get user's liked categories from quiz data
  const likedCategories = getUserLikedCategories(quizData);
  
  // Fetch initial limited outfits
  const { 
    outfits: limitedOutfits, 
    isLoading, 
    error, 
    refetch 
  } = useDashboardOutfits({ 
    likedCategories, 
    limit: 6 
  });

  // Fetch all outfits when needed
  const { 
    outfits: allOutfits, 
    isLoading: isLoadingAllOutfits,
    error: allOutfitsError,
    refetch: refetchAll 
  } = useDashboardOutfits({ 
    likedCategories, 
    limit: 50 // Higher limit for "view all"
  });

  const handleRetry = () => {
    refetch(true); // Force refresh on retry
  };

  const handleViewMore = async () => {
    setIsLoadingAll(true);
    setAllOutfitsMode(true);
    
    // Scroll to loader immediately so user can see the loading progress
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest'
        });
      }
    }, 100);

    try {
      await refetchAll(false); // Use cache for "View More" to improve performance
      
      // Only scroll if user is not already viewing the section
      setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const isInView = rect.top >= 0 && rect.top <= window.innerHeight;
          
          if (!isInView) {
            containerRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest'
            });
          }
        }
      }, 300);
    } catch (err) {
      setAllOutfitsMode(false); // Reset mode on error
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleShowLess = () => {
    setAllOutfitsMode(false);
    
    // Scroll back to the section since content has shrunk
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    }, 100);
  };

  const currentOutfits = allOutfitsMode ? allOutfits : limitedOutfits;
  const currentLoading = allOutfitsMode ? isLoadingAllOutfits : isLoading;

  // Only show full-page loader for initial loading
  if (isLoading && !isLoadingAll) {
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
        <motion.div 
          ref={containerRef}
          className="p-2 mt-10 md:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gray-900/5 border border-gray-200 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-medium text-gray-700 tracking-wide">CURATED COLLECTION</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 tracking-tight"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.3 }
              }}
            >
              CURATED LOOKS
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-extralight text-gray-600">JUST FOR YOU</span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Handpicked outfit combinations based on your style preferences, designed to make you look and feel amazing
            </motion.p>
          </motion.div>

          {/* Looks section container */}
          <div className="relative">
            {/* Loading overlay for seamless transitions */}
            {isLoadingAll && (
              <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007e90]"></div>
                  <p className="text-lg font-medium text-gray-800">
                    Loading all outfits...
                  </p>
                  <p className="text-sm text-gray-600 text-center">
                    Fetching your complete outfit collection
                  </p>
                </div>
              </div>
            )}
            
            <motion.div 
              className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <AnimatePresence>
                {currentOutfits.map((outfit: DashboardOutfit, index: number) => {
                  return (
                    <motion.div 
                      key={outfit.id}
                      className="bg-white border border-gray-200/60 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden group"
                      initial={{ 
                        opacity: 0, 
                        y: 50,
                        scale: 0.95 
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: 1 
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: -20,
                        scale: 0.95 
                      }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1 + 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ 
                        y: -12,
                        scale: 1.02,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Card Header */}
                      <div className="p-8 pb-4">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-medium">{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-medium text-gray-900 tracking-wide">
                                LOOK {index + 1}
                              </h3>
                              <p className="text-sm text-gray-500 capitalize font-light">{outfit.category}</p>
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-gray-900/5 border border-gray-200 rounded-full">
                            <span className="text-xs font-medium text-gray-700 tracking-wide">CURATED</span>
                          </div>
                        </div>
                      </div>

                      {/* Images container with enhanced styling */}
                      <div className="px-8 pb-8">
                        <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 bg-gradient-to-br from-gray-50 to-white h-[450px]">
                          {/* Decorative overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {(outfit.bottom_id === 0 || outfit.bottom_id.toString() === "0000") ? (
                            /* Single dress layout with enhanced styling */
                            <div className="h-full relative">
                              <RobustImage
                                src={outfit.top.image}
                                alt={outfit.top.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {/* Product label overlay */}
                              <div className="absolute bottom-6 left-6 right-6 z-20">
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-200/60 shadow-lg">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {outfit.top.title}
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
                              <div className="flex-1 h-full relative">
                                <RobustImage
                                  src={outfit.top.image}
                                  alt={outfit.top.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Top label */}
                                <div className="absolute bottom-2 left-2 right-2 z-20">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-md p-2 shadow-sm">
                                    <p className="text-xs font-medium text-gray-800 truncate">
                                      {outfit.top.title}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* Bottom garment */}
                              <div className="flex-1 h-full relative">
                                <RobustImage
                                  src={outfit.bottom.image}
                                  alt={outfit.bottom.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Bottom label */}
                                <div className="absolute bottom-2 left-2 right-2 z-20">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-md p-2 shadow-sm">
                                    <p className="text-xs font-medium text-gray-800 truncate">
                                      {outfit.bottom.title}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-8">
                          <Link href={
                            (outfit.bottom_id === 0 || outfit.bottom_id.toString() === "0000") 
                              ? `/products/${outfit.top_id}` 
                              : `/looks/${outfit.id}`
                          }>
                            <motion.button
                              className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium py-4 px-8 rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl tracking-wide"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              EXPLORE THIS LOOK
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* View More Button */}
          <motion.div 
            className="flex justify-center mt-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {allOutfitsMode ? (
              <motion.button
                onClick={handleShowLess}
                disabled={isLoadingAll}
                className="px-12 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium rounded-xl shadow-xl transition-all duration-300 disabled:opacity-50 tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                SHOW LESS
              </motion.button>
            ) : (
              <motion.button
                onClick={handleViewMore}
                disabled={isLoadingAll}
                className="px-12 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium rounded-xl shadow-xl transition-all duration-300 disabled:opacity-50 tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoadingAll ? 'LOADING...' : 'MORE OUTFITS'}
              </motion.button>
            )}
          </motion.div>

        </motion.div>
      </div>
    </>
  );
};

export default CuratedOutfitsDashboard;
