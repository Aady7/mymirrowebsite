'use client'
import { Suspense, useEffect, useState } from "react";
import StylistSays from "@/app/components/recommendations/stylistSays"
import MultiLoader from "@/app/components/multiLoader";
import { useSearchParams } from "next/navigation";

const Recommendations = () => {
  const [showMultiLoader, setShowMultiLoader] = useState(true); // Start with true to prevent flash
  const [isReady, setIsReady] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is coming from style quiz
    const fromStyleQuiz = searchParams.get('from') === 'style-quiz';
    const hasStyleQuizId = localStorage.getItem('styleQuizId');
    
    // Show MultiLoader if coming from style quiz or if styleQuizId exists
    if (fromStyleQuiz || hasStyleQuizId) {
      setShowMultiLoader(true);
      // Clear the styleQuizId after showing loader to prevent showing it again
      if (hasStyleQuizId) {
        localStorage.removeItem('styleQuizId');
      }
    } else {
      // If not coming from style quiz, don't show loader
      setShowMultiLoader(false);
    }
    
    setIsReady(true);
  }, [searchParams]);

  // Don't render anything until we've determined whether to show loader
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        {/* Empty loading state */}
      </div>
    );
  }

  if (showMultiLoader) {
    return (
      <MultiLoader>
        <StylistSays />
      </MultiLoader>
    );
  }

  return (
    <Suspense fallback={<MultiLoader />}>
      <StylistSays/>
    </Suspense>
  )
}

export default Recommendations