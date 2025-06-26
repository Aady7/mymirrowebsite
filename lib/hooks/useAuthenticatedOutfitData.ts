import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { generateOutfit, fetchUserOutfits } from '@/app/utils/outfitsapi';
import { useAuth } from '@/lib/hooks/useAuth';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/utils/cache';
import { Outfit } from '@/lib/interface/outfit';

export interface AuthenticatedOutfitData {
  userId: number;
  userOutfits: Outfit[];
  generatedOutfit?: any;
}

export const useAuthenticatedOutfitData = () => {
  const { getSession } = useAuth();
  const [outfitData, setOutfitData] = useState<AuthenticatedOutfitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasFetchedRef = useRef(false);

  const fetchUserData = async (forceRefresh = false): Promise<AuthenticatedOutfitData | null> => {
    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = cache.get<AuthenticatedOutfitData>(CACHE_KEYS.USER_OUTFITS);
        if (cachedData) {
          console.log("Using cached authenticated outfit data");
          return cachedData;
        }
      } else {
        // Clear cache if force refresh is requested
        cache.remove(CACHE_KEYS.USER_OUTFITS);
        cache.remove(CACHE_KEYS.USER_ID);
        console.log("Force refreshing authenticated outfit data...");
      }

      console.log("Fetching authenticated outfit data from API...");

      // Get current session with refresh capability
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        // Try to refresh session
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshedSession?.user?.id) {
          throw new Error("Authentication failed. Please sign in again.");
        }
        // Use refreshed session for further operations
      }
      
      if (!session?.user?.id) {
        throw new Error("No session found. Please sign in again.");
      }

      console.log('Session found:', session.user.id);

      // Check if we have cached user mapping
      let userId = cache.get<number>(`${CACHE_KEYS.USER_ID}_${session.user.id}`);
      
      if (!userId) {
        // Fetch user ID from users_updated table
        const { data: userData, error: userError } = await supabase
          .from('users_updated')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (userError) {
          console.error('User fetch error:', userError);
          throw new Error(`Failed to fetch user data: ${userError.message}`);
        }
        
        if (!userData?.id) {
          throw new Error("User not found in database. Please complete the style quiz first.");
        }

        userId = userData.id;
        // Cache the user ID mapping for this session
        cache.set(`${CACHE_KEYS.USER_ID}_${session.user.id}`, userId, CACHE_TTL.LONG);
      }

      // Ensure userId is not null before proceeding
      if (!userId) {
        throw new Error('User ID is null');
      }

      console.log('User ID found:', userId);

      // Generate outfit using the fetched user ID
      let generatedOutfit = null;
      try {
        generatedOutfit = await generateOutfit(userId);
        console.log('Generated outfit:', generatedOutfit);
      } catch (outfitError) {
        console.error('Error generating outfit:', outfitError);
        // Don't throw here, just log the error and continue with fetching existing outfits
      }

      // Fetch user outfits using the same ID
      const userOutfitsResponse = await fetchUserOutfits({
        userId: userId,
        limit: 5
      });

      const outfitData: AuthenticatedOutfitData = {
        userId,
        userOutfits: userOutfitsResponse?.outfits || [],
        generatedOutfit
      };

      // Cache the outfit data
      cache.set(CACHE_KEYS.USER_OUTFITS, outfitData, CACHE_TTL.MEDIUM);
      console.log("Authenticated outfit data cached successfully");

      return outfitData;
    } catch (err) {
      console.error('Error fetching authenticated outfit data:', err);
      throw err;
    }
  };

  const initializeData = async (isRetry = false) => {
    // Prevent duplicate calls in React Strict Mode (unless it's a manual retry)
    if (!isRetry && hasFetchedRef.current) {
      return;
    }
    
    if (!isRetry) {
      hasFetchedRef.current = true;
    }
    
    try {
      setIsLoading(true);
      if (!isRetry) setError(null);
      
      const data = await fetchUserData(isRetry);
      if (data) {
        setOutfitData(data);
        setRetryCount(0); // Reset retry count on success
      }
    } catch (err) {
      console.error('Error initializing authenticated outfit data:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch outfit data";
      setError(errorMessage);
      
      // Reset the flag on error so retry can work
      if (!isRetry) hasFetchedRef.current = false;
      
      // If it's an authentication error and we haven't retried, try once more
      if (errorMessage.includes("Authentication failed") && retryCount < 1) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => initializeData(true), 1000);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const refetch = async (forceRefresh = false) => {
    try {
      setRetryCount(0);
      hasFetchedRef.current = false; // Reset flag for manual retry
      setError(null);
      setIsLoading(true);
      
      const data = await fetchUserData(forceRefresh);
      if (data) {
        setOutfitData(data);
      }
    } catch (err) {
      console.error('Error refetching authenticated outfit data:', err);
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