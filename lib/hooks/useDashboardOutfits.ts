'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { cache, CACHE_KEYS } from '@/lib/utils/cache';

export interface DashboardOutfit {
  id: number;
  category: string;
  top_id: number;
  bottom_id: number;
  rank: number;
  top: {
    id: number;
    title: string;
    image: string;
    price: number;
    brand: string;
  };
  bottom: {
    id: number;
    title: string;
    image: string;
    price: number;
    brand: string;
  };
}

interface UseDashboardOutfitsProps {
  likedCategories?: string[];
  limit?: number;
  forceRefresh?: boolean;
}

export const useDashboardOutfits = ({ 
  likedCategories = [], 
  limit = 6, 
  forceRefresh = false 
}: UseDashboardOutfitsProps = {}) => {
  const [outfits, setOutfits] = useState<DashboardOutfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure likedCategories is always an array
  const safeLikedCategories = Array.isArray(likedCategories) ? likedCategories : [];
  const cacheKey = `${CACHE_KEYS.DASHBOARD_OUTFITS}_${safeLikedCategories.join(',')}_${limit}`;

  const fetchOutfits = async (useCache = true) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first unless force refresh
      if (useCache && !forceRefresh) {
        const cached = cache.get(cacheKey);
        if (cached) {
          setOutfits(cached);
          setIsLoading(false);
          return;
        }
      }

      // Build the query without relationships (fetch separately)
      let query = supabase
        .from('outfits_v2')
        .select(`
          id,
          category,
          top_id,
          bottom_id,
          rank
        `);

      // Filter by liked categories if provided
      if (safeLikedCategories.length > 0) {
        query = query.in('category', safeLikedCategories);
      }

      // Order by rank and limit
      query = query
        .order('rank', { ascending: true })
        .limit(limit);

      const { data: outfitData, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!outfitData || outfitData.length === 0) {
        setOutfits([]);
        cache.set(cacheKey, [], 30 * 60 * 1000);
        return;
      }

      // Get all unique product IDs
      const productIds = [...new Set([
        ...outfitData.map(outfit => outfit.top_id),
        ...outfitData.map(outfit => outfit.bottom_id).filter(id => id !== 0)
      ])];

      // Fetch product details separately
      const { data: productData, error: productError } = await supabase
        .from('products_v2')
        .select('id, title, name, price, mrp, product_images, specifications')
        .in('id', productIds);

      if (productError) {
        console.warn('Error fetching product details:', productError);
        // Continue with empty product data
      }

      // Create a map of products for quick lookup
      const productMap = new Map();
      (productData || []).forEach(product => {
        productMap.set(product.id, product);
      });

      const formattedOutfits: DashboardOutfit[] = outfitData.map(outfit => {
        const topProduct = productMap.get(outfit.top_id);
        const bottomProduct = outfit.bottom_id !== 0 ? productMap.get(outfit.bottom_id) : null;

        // Helper function to extract image from product_images jsonb
        const getProductImage = (product: any) => {
          if (!product?.product_images) return '/fallback.jpg';
          
          try {
            const images = Array.isArray(product.product_images) 
              ? product.product_images 
              : JSON.parse(product.product_images);
            
            return images && images.length > 0 ? images[0] : '/fallback.jpg';
          } catch (e) {
            return '/fallback.jpg';
          }
        };

        // Helper function to extract brand from specifications jsonb
        const getBrand = (product: any) => {
          if (!product?.specifications) return 'Unknown';
          
          try {
            const specs = typeof product.specifications === 'string' 
              ? JSON.parse(product.specifications) 
              : product.specifications;
            
            return specs?.brand || specs?.Brand || 'Unknown';
          } catch (e) {
            return 'Unknown';
          }
        };

        return {
          id: outfit.id,
          category: outfit.category,
          top_id: outfit.top_id,
          bottom_id: outfit.bottom_id,
          rank: outfit.rank,
          top: topProduct ? {
            id: topProduct.id,
            title: topProduct.title || topProduct.name || 'Untitled Product',
            image: getProductImage(topProduct),
            price: topProduct.price || 0,
            brand: getBrand(topProduct)
          } : { 
            id: outfit.top_id, 
            title: 'Product Not Found', 
            image: '/fallback.jpg', 
            price: 0, 
            brand: 'Unknown' 
          },
          bottom: bottomProduct ? {
            id: bottomProduct.id,
            title: bottomProduct.title || bottomProduct.name || 'Untitled Product',
            image: getProductImage(bottomProduct),
            price: bottomProduct.price || 0,
            brand: getBrand(bottomProduct)
          } : (outfit.bottom_id !== 0 ? {
            id: outfit.bottom_id, 
            title: 'Product Not Found', 
            image: '/fallback.jpg', 
            price: 0, 
            brand: 'Unknown' 
          } : { 
            id: 0, 
            title: 'N/A', 
            image: '/fallback.jpg', 
            price: 0, 
            brand: 'N/A' 
          })
        };
      });

      setOutfits(formattedOutfits);
      
      // Cache the results
      cache.set(cacheKey, formattedOutfits, 30 * 60 * 1000); // Cache for 30 minutes
      
    } catch (err) {
      console.error('Error fetching dashboard outfits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch outfits');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = (force = false) => {
    if (force) {
      cache.remove(cacheKey);
    }
    return fetchOutfits(!force);
  };

  useEffect(() => {
    fetchOutfits();
  }, [safeLikedCategories.join(','), limit]);

  return {
    outfits,
    isLoading,
    error,
    refetch
  };
};

// Helper function to get user's liked categories from style quiz data
export const getUserLikedCategories = (quizData: any): string[] => {
  try {
    // Check if outfit_swipe exists and has liked categories
    if (quizData?.outfit_swipe) {
      const swipeData = typeof quizData.outfit_swipe === 'string' 
        ? JSON.parse(quizData.outfit_swipe) 
        : quizData.outfit_swipe;
      
      const liked = swipeData?.liked;
      return Array.isArray(liked) ? liked : [];
    }
    
    // Fallback: use style_vibes from the new schema
    if (quizData?.style_vibes) {
      const styleVibes = typeof quizData.style_vibes === 'string'
        ? JSON.parse(quizData.style_vibes)
        : quizData.style_vibes;
      return Array.isArray(styleVibes) ? styleVibes : [];
    }
    
    // Additional fallback: use fashion_style if available (old schema)
    const fashionStyle = quizData?.fashion_style;
    return Array.isArray(fashionStyle) ? fashionStyle : [];
  } catch (error) {
    console.error('Error parsing user liked categories:', error);
    return [];
  }
};
