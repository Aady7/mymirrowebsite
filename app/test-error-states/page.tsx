'use client'
import React from 'react';
import Link from 'next/link';

const ErrorStatesDemo = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">API Error Handling Demo</h1>
        <p className="text-gray-600">This page shows how different API failures are handled in the recommendations page</p>
        <Link href="/recommendations" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          ← Back to Recommendations
        </Link>
      </div>

      {/* Scenario 1: Main Page Error (Style Quiz Data Failure) */}
      <section className="border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">1. Main Page Error (Style Quiz Data Failure)</h2>
        <p className="text-sm text-gray-600 mb-4">When the main style quiz data fails to load, the entire page shows this error:</p>
        
                 <div className="max-w-7xl mx-auto">
           <div className="flex justify-center items-center py-12">
             <div className="bg-[#007e90]/10 border border-[#007e90]/20 rounded-lg p-6 max-w-md mx-auto">
               <div className="flex items-center space-x-3 mb-3">
                 <svg className="w-5 h-5 text-[#007e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <h3 className="text-sm font-medium text-[#006d7d]">Unable to load recommendations</h3>
               </div>
               <p className="text-sm text-[#007e90]/80 mb-4">Error: Failed to fetch style quiz data</p>
               <button className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm">
                 Try Again
               </button>
             </div>
           </div>
         </div>
      </section>

      {/* Scenario 2: Individual Section Error */}
      <section className="border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-orange-600">2. Individual Section Error (Tarot Cards Processing)</h2>
        <p className="text-sm text-gray-600 mb-4">When a specific section fails, only that section shows an error while others continue working:</p>
        
                 <div className="flex justify-center items-center py-8">
           <div className="bg-[#007e90]/10 border border-[#007e90]/20 rounded-lg p-6 max-w-md mx-auto">
             <div className="flex items-center space-x-3 mb-3">
               <svg className="w-5 h-5 text-[#007e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <h3 className="text-sm font-medium text-[#006d7d]">Unable to load section</h3>
             </div>
             <p className="text-sm text-[#007e90]/80 mb-4">No personality tags found for tarot cards</p>
             <button className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm">
               Try Again
             </button>
           </div>
         </div>
      </section>

      {/* Scenario 3: Outfit API Failure */}
      <section className="border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-600">3. Outfit API Failure</h2>
        <p className="text-sm text-gray-600 mb-4">When outfit generation or fetching fails:</p>
        
        <div className="p-2 mt-10 md:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center space-x-3 mb-3">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-red-800">Unable to load outfits</h3>
              </div>
              <p className="text-sm text-red-600 mb-4">Failed to fetch user outfits</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario 4: Authentication Error */}
      <section className="border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-yellow-600">4. Authentication Error</h2>
        <p className="text-sm text-gray-600 mb-4">When user authentication fails:</p>
        
        <div className="p-2 mt-10 md:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center space-x-3 mb-3">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-red-800">Unable to load outfits</h3>
              </div>
              <p className="text-sm text-red-600 mb-4">Authentication failed. Please sign in again.</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Try Again
                </button>
                <Link href="/style-quiz-new">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Take Style Quiz
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario 5: No Data Available */}
      <section className="border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-600">5. No Data Available (Graceful Fallback)</h2>
        <p className="text-sm text-gray-600 mb-4">When no outfits are available, but no error occurred:</p>
        
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-gray-600 font-medium mb-2">No outfits available yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              We're working on creating personalized looks for you. Please check back soon!
            </p>
            <button className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm">
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Loading States */}
      <section className="border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">6. Loading States</h2>
        <p className="text-sm text-gray-600 mb-4">Different loading states shown while APIs are being called:</p>
        
        <div className="space-y-4">
          {/* Main page loading */}
          <div className="border border-gray-100 rounded p-4">
            <h4 className="font-medium mb-2">Main Page Loading:</h4>
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007e90]"></div>
              <span className="ml-3 text-gray-600">Loading your style recommendations...</span>
            </div>
          </div>

                     {/* Section loading */}
           <div className="border border-gray-100 rounded p-4">
             <h4 className="font-medium mb-2">Individual Section Loading:</h4>
             <div className="flex flex-col items-center justify-center space-y-4 py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007e90]"></div>
               <p className="text-gray-600">Loading your curated looks...</p>
             </div>
           </div>
        </div>
      </section>

      <div className="text-center pt-8">
        <Link href="/recommendations" className="inline-block px-6 py-3 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors">
          View Live Recommendations Page
        </Link>
      </div>
    </div>
  );
};

export default ErrorStatesDemo; 