import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { generateOutfit, fetchUserOutfits } from '@/app/utils/outfitsapi';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/utils/cache';

export interface OutfitData {
  userId: string;
  userOutfits: any[];
  generatedOutfit?: any;
}

export const useOutfitData = () => {
  const [outfitData, setOutfitData] = useState<OutfitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchUserData = async (forceRefresh = false): Promise<OutfitData | null> => {
    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = cache.get<OutfitData>(CACHE_KEYS.USER_OUTFITS);
        if (cachedData) {
          console.log("Using cached outfit data");
          return cachedData;
        }
      } else {
        // Clear cache if force refresh is requested
        cache.remove(CACHE_KEYS.USER_OUTFITS);
        cache.remove(CACHE_KEYS.USER_ID);
        console.log("Force refreshing outfit data...");
      }

      console.log("Fetching outfit data from API...");

      // Check if we have cached user ID
      let userId = cache.get<string>(CACHE_KEYS.USER_ID);
      
      if (!userId) {
        // Fetch user ID from users_updated table
        const { data: userData, error: userError } = await supabase
          .from('users_updated')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (userError) {
          console.error('User fetch error:', userError);
          throw new Error(`Failed to fetch user data: ${userError.message}`);
        }

        if (!userData?.id) {
          throw new Error('No user found');
        }

        userId = userData.id;
        // Cache the user ID for future use
        cache.set(CACHE_KEYS.USER_ID, userId, CACHE_TTL.LONG);
      }

      // Ensure userId is not null before proceeding
      if (!userId) {
        throw new Error('User ID is null');
      }

      // Generate outfit using the fetched user ID
      let generatedOutfit = null;
      try {
        generatedOutfit = await generateOutfit(parseInt(userId));
      } catch (outfitError) {
        console.error('Error generating outfit:', outfitError);
        // Don't throw here, just log the error and continue with fetching existing outfits
      }

      // Fetch user outfits using the same ID
      const userOutfits = await fetchUserOutfits({
        userId: parseInt(userId),
        limit: 10
      });

      const outfitData: OutfitData = {
        userId: userId,
        userOutfits: userOutfits || [],
        generatedOutfit
      };

      // Cache the outfit data
      cache.set(CACHE_KEYS.USER_OUTFITS, outfitData, CACHE_TTL.MEDIUM);
      console.log("Outfit data cached successfully");

      return outfitData;
    } catch (err) {
      console.error('Error fetching outfit data:', err);
      throw err;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Prevent duplicate calls in React Strict Mode
      if (hasFetchedRef.current) {
        return;
      }
      
      hasFetchedRef.current = true;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await fetchUserData();
        if (data) {
          setOutfitData(data);
        }
      } catch (err) {
        console.error('Error initializing outfit data:', err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch outfit data";
        setError(errorMessage);
        // Reset the flag on error so retry can work
        hasFetchedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const refetch = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      hasFetchedRef.current = false; // Reset flag for manual retry
      
      const data = await fetchUserData(forceRefresh);
      if (data) {
        setOutfitData(data);
      }
    } catch (err) {
      console.error('Error refetching outfit data:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to refetch outfit data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    outfitData,
    isLoading,
    error,
    refetch
  };
}; 