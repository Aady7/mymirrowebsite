'use client'
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ErrorBoundary, { SectionErrorFallback } from "@/app/components/common/ErrorBoundary";
import PersonalizedStyleAdvice from "@/app/components/recommendations/PersonalizedStyleAdvice";
// import PersonalityBasedTarotCards from "@/app/components/recommendations/PersonalityBasedTarotCards";
import CuratedOutfitsDashboard from "@/app/components/dashboard/CuratedOutfitsDashboard";
import { useStyleQuizData } from "@/lib/hooks/useStyleQuizData";
import SectionLoader from "@/app/components/common/SectionLoader";
import { trackEvent } from "@/lib/utils/analytics";

import SmartLoader from "@/app/components/loader/SmartLoader";

const Dashboard = () => {
  const { quizData, colorAnalysis, isLoading, error, refetch } = useStyleQuizData();
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    // Show initial loader for minimum time
    timer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 2000);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Track dashboard page view when data is loaded
  useEffect(() => {
    if (!isLoading && !error && quizData) {
      trackEvent.viewRecommendations(); // Reuse the same event or create a new one
    }
  }, [isLoading, error, quizData]);

  // Debug logging for style quiz data
  useEffect(() => {
    console.log('🔍 Dashboard Debug - Style Quiz Data:', {
      isLoading,
      error,
      quizData: quizData ? {
        gender: quizData.gender,
        outfit_swipe: quizData.outfit_swipe,
        style_vibes: quizData.style_vibes,
        fashion_style: quizData.fashion_style,
        personality_ques: quizData.personality_ques,
        // Log all available keys
        availableKeys: Object.keys(quizData)
      } : null,
      colorAnalysis
    });
  }, [isLoading, error, quizData, colorAnalysis]);

  // Show initial loader for minimum time to provide smooth UX
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
        <SectionLoader text="Loading your style dashboard..." />
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
              <h3 className="text-sm font-medium text-[#006d7d]">Unable to load dashboard</h3>
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth feel
      }
    }
  };

  const headingVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      <motion.div 
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Header Section */}
        <motion.div 
          className="relative pt-8 sm:pt-16 pb-8 sm:pb-12 text-center"
          variants={headingVariants}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/5 to-transparent rounded-3xl"></div>
          
          <motion.div className="relative z-10">
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900/5 to-gray-800/5 border border-gray-200 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-medium text-gray-700">PERSONALIZED FOR YOU</span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.3 }
              }}
            >
              YOUR STYLE
              <br />
              <span className="font-extralight text-gray-600">
                DASHBOARD
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Discover your perfect style with AI-powered recommendations
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Sections Container */}
        <div className="space-y-8 sm:space-y-16 pb-12 sm:pb-24">
          {/* AI-Powered Style Advice section */}
          <motion.div 
            variants={sectionVariants}
            className="bg-white border border-gray-200/60 rounded-2xl shadow-2xl shadow-gray-900/5 overflow-hidden"
          >
            <ErrorBoundary fallback={SectionErrorFallback}>
              <PersonalizedStyleAdvice quizData={quizData} colorAnalysis={colorAnalysis} />
            </ErrorBoundary>
          </motion.div>

          {/* Temporarily hidden - Personality-Based Tarot Cards section */}
          {/* <motion.div 
            variants={sectionVariants}
            className="bg-white border border-gray-200/60 rounded-2xl shadow-2xl shadow-gray-900/5 overflow-hidden"
          >
            <ErrorBoundary fallback={SectionErrorFallback}>
              <PersonalityBasedTarotCards quizData={quizData} />
            </ErrorBoundary>
          </motion.div> */}

          {/* Curated Outfit Combinations section */}
          <motion.div 
            variants={sectionVariants}
            className="bg-white border border-gray-200/60 rounded-2xl shadow-2xl shadow-gray-900/5 overflow-hidden"
          >
            <ErrorBoundary fallback={SectionErrorFallback}>
              <CuratedOutfitsDashboard quizData={quizData} />
            </ErrorBoundary>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
