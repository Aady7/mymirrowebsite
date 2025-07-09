import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/utils/cache';

// All outfit-related API functions go here

export const generateOutfit = async (userId: number, forceRefresh = false) => {
  const cacheKey = `${CACHE_KEYS.GENERATED_OUTFITS}_${userId}`;
  
  // Check cache first unless forcing refresh
  if (!forceRefresh) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('generateOutfit: Using cached data for user', userId);
      return cachedData;
    }
  } else {
    cache.remove(cacheKey);
  }
  
  console.log('generateOutfit: Making API call for user', userId);
  
  try {
    const res = await fetch('/api/mymirrobackend/create-outfit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('generateOutfit: API response received for user', userId);
    
    // Cache the result
    cache.set(cacheKey, data, CACHE_TTL.API_OUTFITS);
    console.log('generateOutfit: Data cached for user', userId);
    
    return data;
  } catch (error) {
    console.error('generateOutfit: API call failed for user', userId, error);
    throw error;
  }
};

export const getOutfitById = async (id: string, forceRefresh = false) => {
  const cacheKey = `${CACHE_KEYS.OUTFIT_DETAILS}_${id}`;
  
  // Check cache first unless forcing refresh
  if (!forceRefresh) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('getOutfitById: Using cached data for outfit', id);
      return cachedData;
    }
  } else {
    cache.remove(cacheKey);
  }
  
  console.log('getOutfitById: Making API call for outfit', id);
  
  try {
    const query = `/api/mymirrobackend/get-outfit?id=${id}`;
    const res = await fetch(query);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('getOutfitById: API response received for outfit', id);
    
    // Cache the result
    cache.set(cacheKey, data, CACHE_TTL.API_OUTFITS);
    console.log('getOutfitById: Data cached for outfit', id);
    
    return data;
  } catch (error) {
    console.error('getOutfitById: API call failed for outfit', id, error);
    throw error;
  }
};

export const getSimilarOutfits = async (id: string, count?: number, forceRefresh = false) => {
  const cacheKey = `${CACHE_KEYS.SIMILAR_OUTFITS}_${id}_${count || 'default'}`;
  
  // Check cache first unless forcing refresh
  if (!forceRefresh) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('getSimilarOutfits: Using cached data for outfit', id);
      return cachedData;
    }
  } else {
    cache.remove(cacheKey);
  }
  
  console.log('getSimilarOutfits: Making API call for outfit', id, 'with count', count);
  
  const query = `/api/mymirrobackend/get-similar-outfits?id=${id}${count ? `&count=${count}` : ''}`;
  
  // Add timeout to prevent hanging requests - 5 minutes for long-running API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
  
  try {
    const res = await fetch(query, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('getSimilarOutfits: API response received for outfit', id);
    
    // Cache the result
    cache.set(cacheKey, data, CACHE_TTL.API_SIMILAR);
    console.log('getSimilarOutfits: Data cached for outfit', id);
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('getSimilarOutfits: API call failed for outfit', id, error);
    throw error;
  }
};

export const fetchUserOutfits = async ({
  userId,
  limit,
  min_score,
  style,
  forceRefresh = false
}: {
  userId: number;
  limit?: number;
  min_score?: number;
  style?: string;
  forceRefresh?: boolean;
}) => {
  const cacheKey = `${CACHE_KEYS.USER_OUTFITS}_${userId}_${limit || 'all'}_${min_score || 'none'}_${style || 'all'}`;
  
  // Check cache first unless forcing refresh
  if (!forceRefresh) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('fetchUserOutfits: Using cached data for user', userId);
      return cachedData;
    }
  } else {
    cache.remove(cacheKey);
  }
  
  console.log('fetchUserOutfits: Making API call for user', userId, 'with params', { limit, min_score, style });
  
  try {
    const params = new URLSearchParams({ user_id: String(userId) });
    if (limit) params.append('limit', String(limit));
    if (min_score) params.append('min_score', String(min_score));
    if (style) params.append('style', style);

    const res = await fetch(`/api/mymirrobackend/get-outfits?${params.toString()}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('fetchUserOutfits: API response received for user', userId);
    
    // Cache the result
    cache.set(cacheKey, data, CACHE_TTL.API_OUTFITS);
    console.log('fetchUserOutfits: Data cached for user', userId);
    
    return data;
  } catch (error) {
    console.error('fetchUserOutfits: API call failed for user', userId, error);
    throw error;
  }
};
  