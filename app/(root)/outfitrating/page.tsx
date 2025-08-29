"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';

const OutfitRatingIndexPage = () => {
  const router = useRouter();
  const { getSession } = useAuth();

  useEffect(() => {
    const redirectToFirstUnratedOutfit = async () => {
      try {
        // Get user session
        const { session } = await getSession();
        
        if (!session?.user) {
          router.push('/mobile-sign-in');
          return;
        }

        // Fetch all outfits from user_outfits table (regardless of user)
        const { data: allOutfits, error: outfitsError } = await supabase
          .from('user_outfits')
          .select('main_outfit_id')
          .order('created_at', { ascending: true });

        if (outfitsError) {
          console.error('Error fetching outfits:', outfitsError);
          return;
        }

        if (!allOutfits || allOutfits.length === 0) {
          // No outfits found, redirect to a no-outfits page or back
          router.push('/');
          return;
        }

        // Get all rated outfit IDs for this user
        const { data: ratedOutfits, error: ratingsError } = await supabase
          .from('outfit_rating_advance')
          .select('outfit_id')
          .eq('user_id', session.user.id);

        if (ratingsError) {
          console.error('Error fetching ratings:', ratingsError);
          // If there's an error fetching ratings, just go to the first outfit
          router.push(`/outfitrating/${allOutfits[0].main_outfit_id}`);
          return;
        }

        // Create a set of rated outfit IDs for quick lookup
        const ratedOutfitIds = new Set(
          ratedOutfits?.map(rating => rating.outfit_id) || []
        );

        // Find the first unrated outfit
        const firstUnratedOutfit = allOutfits.find(
          outfit => !ratedOutfitIds.has(outfit.main_outfit_id)
        );

        if (firstUnratedOutfit) {
          // Redirect to the first unrated outfit
          router.push(`/outfitrating/${firstUnratedOutfit.main_outfit_id}`);
        } else {
          // All outfits have been rated
          console.log('All outfits have been rated');
          // You could redirect to a completion page or back to home
          router.push('/');
        }

      } catch (error) {
        console.error('Error in redirectToFirstUnratedOutfit:', error);
        router.push('/');
      }
    };

    redirectToFirstUnratedOutfit();
  }, [getSession, router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007e90] mx-auto"></div>
        <p className="mt-4 text-gray-600">Finding your next outfit to rate...</p>
      </div>
    </div>
  );
};

export default OutfitRatingIndexPage;
