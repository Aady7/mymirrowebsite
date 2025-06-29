'use client'
import { Suspense, useEffect, useState } from "react";
import ErrorBoundary, { SectionErrorFallback } from "@/app/components/common/ErrorBoundary";
import PersonalizedStyleAdvice from "@/app/components/recommendations/PersonalizedStyleAdvice";
import PersonalityBasedTarotCards from "@/app/components/recommendations/PersonalityBasedTarotCards";
import CuratedOutfitsSection from "@/app/components/recommendations/CuratedOutfitsSection";
import { useStyleQuizData } from "@/lib/hooks/useStyleQuizData";
import SectionLoader from "@/app/components/common/SectionLoader";

import SmartLoader from "@/app/components/loader/SmartLoader";

const Recommendations = () => {
  const { quizData, colorAnalysis, isLoading, error, refetch } = useStyleQuizData();
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isLoading) {
      setShowInitialLoader(true);
      timer = setTimeout(() => {
        if (!isLoading) setShowInitialLoader(false);
      }, 5000);
    } else {
      timer = setTimeout(() => setShowInitialLoader(false), 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  if (showInitialLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SmartLoader />
      </div>
    );
  }

  // Show loading state for the entire page while data is being fetched
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <SectionLoader text="Loading your style recommendations..." />
      </div>
    );
  }

  // Show error state for the entire page if data fetch fails
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="bg-[#007e90]/10 border border-[#007e90]/20 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <svg className="w-5 h-5 text-[#007e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-[#006d7d]">Unable to load recommendations</h3>
            </div>
            <p className="text-sm text-[#007e90]/80 mb-4">Error: {error}</p>
            <div className="flex gap-2">
              <button
                onClick={() => refetch(false)}
                className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => refetch(true)}
                className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm"
              >
                Force Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-7xl mx-auto">
      {/* Heading section */}
      <div className="flex items-center justify-center mt-4">
        <h1 className="text-black font-[Boston] text-[30px] md:text-[40px] not-italic font-normal leading-normal [font-variant:all-small-caps] text-center">
          STYLIST SAYS
        </h1>
      </div>



      {/* AI-Powered Style Advice section with individual error handling */}
      <ErrorBoundary fallback={SectionErrorFallback}>
        <PersonalizedStyleAdvice quizData={quizData} colorAnalysis={colorAnalysis} />
      </ErrorBoundary>

      {/* Personality-Based Tarot Cards section with individual error handling */}
      <ErrorBoundary fallback={SectionErrorFallback}>
        <PersonalityBasedTarotCards quizData={quizData} />
      </ErrorBoundary>

      {/* Curated Outfit Combinations section with individual error handling */}
      <ErrorBoundary fallback={SectionErrorFallback}>
        <CuratedOutfitsSection />
      </ErrorBoundary>
    </div>
  )
}

export default Recommendations