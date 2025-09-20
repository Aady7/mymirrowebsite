"use client";

import React from 'react';
import BannerStyleReport from '@/app/components/style-report/BannerStyleReport';
import { useStyleQuizData } from '@/lib/hooks/useStyleQuizData';

const StyleReportPage = () => {
  const { quizData, isLoading, error } = useStyleQuizData();

  // Get username from style quiz data
  const userName = quizData?.name || 'User';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your style report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading style report: {error}</p>
          <p className="text-gray-600">Please complete the style quiz first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-1 ">
        {/* Banner - Full width with padding */}
        <div className="mb-3 ">
          <BannerStyleReport name={userName} />
        </div>
        
        {/* Style Report Section */}
        <div className="text-left px-4">
          <h2 
            className="text-2xl font-semibold text-black mb-2 tracking-normal text-left "
            style={{
              fontFamily: 'Boston',
              fontSize: '20px',
              fontWeight: 600
            }}
          >
            Style Report
          </h2>
          <p 
            className="text-black"
            style={{
              fontFamily: 'Boston',
              fontSize: '14px',
              fontWeight: 400
            }}
          >
            A snapshot of your fashion DNA, based on your answers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleReportPage;
