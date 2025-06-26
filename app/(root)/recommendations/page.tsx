'use client'
import { Suspense } from "react";
import ErrorBoundary, { SectionErrorFallback } from "@/app/components/common/ErrorBoundary";
import PersonalizedStyleAdvice from "@/app/components/recommendations/PersonalizedStyleAdvice";
import PersonalityBasedTarotCards from "@/app/components/recommendations/PersonalityBasedTarotCards";
import CuratedOutfitsSection from "@/app/components/recommendations/CuratedOutfitsSection";
import { useStyleQuizData } from "@/lib/hooks/useStyleQuizData";
import SectionLoader from "@/app/components/common/SectionLoader";
import { cache } from "@/lib/utils/cache";

const Recommendations = () => {
  const { quizData, colorAnalysis, isLoading, error, refetch } = useStyleQuizData();

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
                className="px-4 py-2 bg-[#006d7d] text-white rounded-lg hover:bg-[#005a66] transition-colors text-sm"
              >
                Force Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleClearCache = () => {
    cache.clear();
    refetch(true); // Force refresh after clearing cache
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Heading section */}
      <div className="flex items-center justify-center mt-4">
        <h1 className="text-black font-[Boston] text-[30px] md:text-[40px] not-italic font-normal leading-normal [font-variant:all-small-caps] text-center">
          STYLIST SAYS
        </h1>
      </div>

      {/* Cache management section - only show when not loading */}
      {!isLoading && !error && (
        <div className="flex justify-center mt-4 mb-6">
          <button
            onClick={handleClearCache}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh All Data
          </button>
        </div>
      )}

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