"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStyleQuizData } from '@/lib/hooks/useStyleQuizData';
import { FaThumbsUp, FaThumbsDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from 'react-hot-toast';

interface Outfit {
    id: string;
    name: string;
    topid: string;
    bottomid: string;
}

interface ImageUrl {
    top_image_url: string;
    bottom_image_url: string;
}

const OutfitRatingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getSession } = useAuth();
  const { quizData, isLoading: quizLoading } = useStyleQuizData();

  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<ImageUrl>({
    top_image_url: '',
    bottom_image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Rating states
  const [overallRating, setOverallRating] = useState<'up' | 'down' | null>(null);
  const [colorRating, setColorRating] = useState<number>(0);
  const [styleRating, setStyleRating] = useState<number>(0);
  const [fitRating, setFitRating] = useState<number>(0);
  const [occasionRating, setOccasionRating] = useState<number>(0);
  
  // Navigation states
  const [allOutfits, setAllOutfits] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  // Fetch everything once id is ready
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching data for outfit ID:", id);

        // Fetch user session
        const { session } = await getSession();
        console.log("Session:", session);

        if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            setUser(null);
          router.push('/mobile-sign-in');
          return;
        }

        // Fetch outfit data
        console.log("Fetching outfit from user_outfits table...");
        const { data: outfitData, error: outfitError } = await supabase
          .from('user_outfits')
          .select('main_outfit_id, outfit_name, top_id, bottom_id')
          .eq('main_outfit_id', id)
          .single();

        console.log("Outfit query result:", { outfitData, outfitError });

        if (outfitError) {
          console.error('Outfit fetch error:', outfitError);
          setError(`Failed to fetch outfit: ${outfitError.message}`);
          return;
        }

        if (!outfitData) {
          setError('Outfit not found');
          return;
        }

        console.log("Outfit data found:", outfitData);

        setOutfit({
          id: outfitData.main_outfit_id,
          name: outfitData.outfit_name,
          topid: outfitData.top_id,
          bottomid: outfitData.bottom_id,
        });

        // Fetch image URLs
        console.log("Fetching images for product IDs:", [outfitData.top_id, outfitData.bottom_id]);
        const { data: imageData, error: imageError } = await supabase
          .from('tagged_products')
          .select('product_id, image_url')
          .in('product_id', [outfitData.top_id, outfitData.bottom_id]);

        console.log("Image query result:", { imageData, imageError });

        if (imageError) {
          console.error('Image fetch error:', imageError);
          setError(`Failed to fetch images: ${imageError.message}`);
          return;
        }

        if (imageData && imageData.length > 0) {
          // Convert IDs to strings for comparison
          const topIdStr = String(outfitData.top_id);
          const bottomIdStr = String(outfitData.bottom_id);
          
          console.log("Looking for top ID:", topIdStr, "bottom ID:", bottomIdStr);
          console.log("Available product IDs:", imageData.map(item => String(item.product_id)));
          
          const top = imageData.find(item => String(item.product_id) === topIdStr);
          const bottom = imageData.find(item => String(item.product_id) === bottomIdStr);

          console.log("Found images:", { top, bottom });
  
        setImageUrls({
          top_image_url: top?.image_url || '',
          bottom_image_url: bottom?.image_url || '',
        });
          console.log("Image URLs set:", {
            top_image_url: top?.image_url || '',
            bottom_image_url: bottom?.image_url || '',
          });
      } else {
          console.log("No images found for products");
          setImageUrls({
            top_image_url: '',
            bottom_image_url: '',
          });
        }

        // Set username from quiz data
        if (quizData?.name) {
          setUserName(quizData.name);
        }

        // Fetch navigation data after user is authenticated
        if (session?.user) {
          await fetchUnratedOutfits(session.user.id);
        }

      } catch (error) {
        console.error('Error in fetchData:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getSession, router, quizData]);

  const handleOverallRating = (rating: 'up' | 'down') => {
    setOverallRating(rating);
  };

  const getRatingLabel = (value: number): string => {
    if (value <= 20) return "VERY BAD";
    if (value <= 40) return "BAD";
    if (value <= 60) return "OKAY";
    if (value <= 80) return "GOOD";
    return "VERY GOOD";
  };

  const submitRating = async () => {
    if (!outfit || !user) return;

    try {
      const { error } = await supabase
        .from('outfit_rating_advance')
        .insert({
          user_id: user.id,
          outfit_id: outfit.id,
          overall_rating: overallRating === 'up' ? 5 : 1,
          color_combination_rating: colorRating,
          style_rating: styleRating,
          fit_rating: fitRating,
          occasion_rating: occasionRating,
          top_id: outfit.topid,
          bottom_id: outfit.bottomid
        });

      if (error) throw error;
      
      toast.success('Rating submitted successfully!' ,{
        position: 'top-right',
      });
     
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  // Navigation functions
  const fetchUnratedOutfits = async (userId: string) => {
    try {
      // Fetch all outfits (regardless of user)
      const { data: allOutfits, error: outfitsError } = await supabase
        .from('user_outfits')
        .select('main_outfit_id')
        .order('created_at', { ascending: true });

      if (outfitsError) throw outfitsError;

      // Get all rated outfit IDs for this user
      const { data: ratedOutfits, error: ratingsError } = await supabase
        .from('outfit_rating_advance')
        .select('outfit_id')
        .eq('user_id', userId);

      if (ratingsError) throw ratingsError;

      // Create a set of rated outfit IDs for quick lookup
      const ratedOutfitIds = new Set(
        ratedOutfits?.map(rating => rating.outfit_id) || []
      );

      // Filter out already rated outfits
      const unratedOutfits = allOutfits?.filter(
        outfit => !ratedOutfitIds.has(outfit.main_outfit_id)
      ) || [];

      const unratedOutfitIds = unratedOutfits.map(outfit => outfit.main_outfit_id);
      setAllOutfits(unratedOutfitIds);

      // Find current outfit index
      const currentIdx = unratedOutfitIds.findIndex(outfitId => outfitId === id);
      setCurrentIndex(currentIdx);
      setHasPrevious(currentIdx > 0);
      setHasNext(currentIdx < unratedOutfitIds.length - 1);

      console.log('Navigation state:', {
        total: unratedOutfitIds.length,
        current: currentIdx,
        hasPrevious: currentIdx > 0,
        hasNext: currentIdx < unratedOutfitIds.length - 1
      });

    } catch (error) {
      console.error('Error fetching unrated outfits:', error);
    }
  };

  const navigateToOutfit = (direction: 'next' | 'previous') => {
    if (direction === 'next' && hasNext && currentIndex < allOutfits.length - 1) {
      const nextOutfitId = allOutfits[currentIndex + 1];
      router.push(`/outfitrating/${nextOutfitId}`);
    } else if (direction === 'previous' && hasPrevious && currentIndex > 0) {
      const previousOutfitId = allOutfits[currentIndex - 1];
      router.push(`/outfitrating/${previousOutfitId}`);
    }
  };

  const submitAndGoNext = async () => {
    await submitRating();
    
    // Wait a bit for the rating to be saved, then navigate
    setTimeout(() => {
      if (hasNext) {
        navigateToOutfit('next');
      } else {
        // No more outfits, redirect to home or completion page
        toast.success('All outfits rated! Great job!', {
          position: 'top-right',
        });
        router.push('/');
      }
    }, 1000);
  };

  // Loading state
  if (loading || quizLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007e90] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading outfit details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => router.back()} 
            className="bg-[#007e90] text-white px-4 py-2 rounded hover:bg-[#006d7d]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No outfit found
  if (!outfit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Outfit not found</p>
          <button 
            onClick={() => router.back()} 
            className="bg-[#007e90] text-white px-4 py-2 rounded hover:bg-[#006d7d]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Final UI
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8">
        {/* Header */}
        <h1 className="text-[30px] font-bold mb-6   font-[Boston]">
          STYLED FOR {userName?.toUpperCase() || 'YOU'}
        </h1>
        
        {/* Navigation Info */}
        {allOutfits.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigateToOutfit('previous')}
              disabled={!hasPrevious}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasPrevious 
                  ? 'bg-[#007e90] text-white hover:bg-[#006d7d]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaChevronLeft size={14} />
              Previous
            </button>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">
                {currentIndex + 1} of {allOutfits.length} outfits
              </span>
            </div>
            
            <button
              onClick={() => navigateToOutfit('next')}
              disabled={!hasNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasNext 
                  ? 'bg-[#007e90] text-white hover:bg-[#006d7d]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <FaChevronRight size={14} />
            </button>
          </div>
        )}
      
        {/* Outfit Images */}
        <div className="flex flex-row items-center gap-2 justify-center pl-8 pr-8 mb-8">
          {imageUrls.top_image_url ? (
            <img src={imageUrls.top_image_url} alt="Top" className="max-w-44 rounded-none shadow" />
          ) : (
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Top Image</span>
            </div>
          )}
          {imageUrls.bottom_image_url ? (
            <img src={imageUrls.bottom_image_url} alt="Bottom" className="max-w-44 rounded-none shadow" />
          ) : (
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Bottom Image</span>
            </div>
          )}
        </div>

        {/* Overall Rating - Thumbs Up/Down */}
        <div className="mb-8">
          <div className="flex justify-center w-44 mx-auto ">
            <div className="flex bg-[#007e90] p-1 m-2 rounded-4xl pl-3 pr-3 pt-2 pb-2 w-full  ">
              <button
                onClick={() => handleOverallRating('up')}
                className={`flex items-center justify-center w-16 h-12 rounded-l-3xl transition-colors ${
                  overallRating === 'up' 
                    ? 'bg-[#5ba8b4] text-gray-700' 
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                <FaThumbsUp size={22} color='white'/>
              </button>
              <div className="w-px bg-gray-400 m-2 rounded-l-2xl"></div>
              <button
                onClick={() => handleOverallRating('down')}
                className={`flex items-center justify-center w-16 h-12 rounded-r-3xl transition-colors ${
                  overallRating === 'down' 
                    ? 'bg-[#68a5af] text-gray-700' 
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                <FaThumbsDown size={24} color='white'/>
              </button>
            </div>
          </div>
        </div>

        {/* Rating Categories */}
        <div className="space-y-6">
          {/* Color Combination */}
          <div className="border-t pt-6">
            <h3 className="text-[20px] font-bold text-black uppercase mb-8">COLOR COMBINATION</h3>
            <div className="relative">
            <div className="flex justify-between text-[12px] text-black mt-2 mb-2">
                <span>VERY BAD</span>
                <span>BAD</span>
                <span>OKAY</span>
                <span>GOOD</span>
                <span>VERY GOOD</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={colorRating}
                onChange={(e) => setColorRating(parseInt(e.target.value))}
                className="w-full h-2 bg-[#5ba8b4] rounded-lg appearance-none cursor-pointer slider"
              />
            
              <div className="text-center mt-2 text-sm font-medium">
                {getRatingLabel(colorRating)}
              </div>
            </div>
          </div>

          {/* Style */}
          <div className="border-t pt-6">
            <h3 className="text-[20px] font-bold text-black uppercase mb-8">STYLE</h3>
            <div className="relative">
            <div className="flex justify-between text-[12px] text-black mt-2 mb-2">
                <span>VERY BAD</span>
                <span>BAD</span>
                <span>OKAY</span>
                <span>GOOD</span>
                <span>VERY GOOD</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={styleRating}
                onChange={(e) => setStyleRating(parseInt(e.target.value))}
                className="w-full h-2 bg-[#5ba8b4] rounded-lg appearance-none cursor-pointer slider"
              />
              
              <div className="text-center mt-2 text-sm font-medium">
                {getRatingLabel(styleRating)}
              </div>
            </div>
          </div>

          {/* Fit */}
          <div className="border-t pt-6">
            <h3 className="text-[20px] font-bold text-black uppercase mb-8">FIT</h3>
            <div className="relative">
            <div className="flex justify-between text-[12px] text-black mt-2 mb-2">
                <span>VERY BAD</span>
                <span>BAD</span>
                <span>OKAY</span>
                <span>GOOD</span>
                <span>VERY GOOD</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fitRating}
                onChange={(e) => setFitRating(parseInt(e.target.value))}
                className="w-full h-2 bg-[#5ba8b4] rounded-lg appearance-none cursor-pointer slider"
              />
             
              <div className="text-center mt-2 text-sm font-medium">
                {getRatingLabel(fitRating)}
              </div>
            </div>
          </div>

          {/* Occasion */}
          <div className="border-t pt-6">
            <h3 className="text-[20px] font-bold text-black uppercase mb-8">OCCASION</h3>
            <div className="relative">
                <span className='text-[20px] text-black mb-2 '>Everday Wear</span>
            <div className="flex justify-between text-[12px] text-black mt-2 mb-2 ">
                <span>VERY BAD</span>
                <span>BAD</span>
                <span>OKAY</span>
                <span>GOOD</span>
                <span>VERY GOOD</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={occasionRating}
                onChange={(e) => setOccasionRating(parseInt(e.target.value))}
                className="w-full h-2 bg-[#5ba8b4] rounded-lg appearance-none cursor-pointer slider "
              />
             
              <div className="text-center mt-2 text-sm font-medium">
                {getRatingLabel(occasionRating)}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex gap-4 justify-center">
            <button
              onClick={submitRating}
              disabled={!overallRating}
              className="bg-[#007e90] text-white px-6 py-3 rounded-lg hover:bg-[#006d7d] disabled:bg-[#5ba8b4] disabled:cursor-not-allowed font-medium"
            >
              Submit Rating
            </button>
            
            {hasNext && (
              <button
                onClick={submitAndGoNext}
                disabled={!overallRating}
                className="bg-[#5ba8b4] text-white px-6 py-3 rounded-lg hover:bg-[#4a959e] disabled:bg-[#a0c4c7] disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                Submit & Next
                <FaChevronRight size={14} />
              </button>
            )}
          </div>
          
          {!hasNext && allOutfits.length > 0 && (
            <p className="text-sm text-gray-600">
              This is the last outfit to rate!
            </p>
          )}
        </div>
    </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #007e90;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #007e90;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default OutfitRatingPage;
