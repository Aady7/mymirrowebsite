import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/utils/cache';

export const getSimilarProducts = async ({
    productId,
    count = 10,
    diverse = true,
    personalized = false,
    forceRefresh = false
  }: {
    productId: string | number;
    count?: number;
    diverse?: boolean;
    personalized?: boolean;
    forceRefresh?: boolean;
  }) => {
    const cacheKey = `${CACHE_KEYS.SIMILAR_PRODUCTS}_${String(productId)}_${count}_${diverse}_${personalized}`;
    
    // Check cache first unless forcing refresh
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('getSimilarProducts: Using cached data for', cacheKey);
        return cachedData;
      }
    } else {
      cache.remove(cacheKey);
    }
    
    console.log('getSimilarProducts: Making API call for', cacheKey);
    
    const query = `/api/mymirrobackend/get-similar-products?id=${String(productId)}&count=${count}&diverse=${diverse}&personalized=${personalized}`;
    
    // Add timeout to prevent hanging requests - 5 minutes for long-running API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
    
    try {
      console.log('getSimilarProducts: Making API call to:', query);
      console.log('getSimilarProducts: Parameters:', { productId, count, diverse, personalized });
      
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
      console.log('getSimilarProducts: API response received:', data);
      
      // Cache the result
      cache.set(cacheKey, data, CACHE_TTL.API_SIMILAR);
      console.log('getSimilarProducts: Data cached for', cacheKey);
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('getSimilarProducts: API call failed:', error);
      throw error;
    }
  };
  