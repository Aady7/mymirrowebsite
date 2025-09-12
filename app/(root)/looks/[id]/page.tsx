"use client"
import { useParams, notFound } from 'next/navigation';
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCartArrowDown } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import SimilarOutfitsCarousel from '@/app/components/looks/SimilarOutfitsCarousel';
import { useAuth } from '@/lib/hooks/useAuth';
import SmartLoader from '@/app/components/loader/SmartLoader';
import StarRating from '@/app/components/starRating';
import LooksFeedback from '@/app/components/looks/LooksFeedback';
import { supabase } from '@/lib/supabase';
import AddToLookbookButton from '@/app/components/lookbook/AddToLookbookButton';
import { useNotification } from '@/app/components/common/NotificationContext';
import RobustImage from '@/app/components/common/RobustImage';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  created_at: string;
  title: string;
  name: string;
  overallRating: number;
  price: number;
  mrp: number;
  discount: string;
  sizesAvailable: string;
  productImages: string;
  specifications: string;
  tagged_products: {
    customer_short_description: string;
    customer_long_recommendation: string;
    product_key_attributes: string;
    // Enhanced fields from tagged_products
    primary_fabric?: string;
    fabric_texture?: string;
    fabric_weight?: string;
    fabric_care?: string;
    primary_color?: string;
    color_family?: string;
    primary_occasion?: string;
    formality_level?: string;
    fit_type?: string;
    style_category?: string;
    seasonal_appropriateness?: string;
    body_shape_compatibility?: string;
    comfort_level?: string;
    care_complexity?: string;
    versatility_score?: number;
    color_harmony?: string;
  };
}

interface LoadingState {
  [key: string]: boolean;
}

interface KeyAttributes {
  color?: string;
  fit?: string;
  fabric?: string;
  occasion?: string;
  [key: string]: string | undefined;
}

interface OutfitData {
  main_outfit_id: string;
  outfit_name: string;
  outfit_description?: string;
  why_picked_explanation?: string;
  top: {
    id: number;
    title: string;
    image: string;
    style: string;
  };
  bottom: {
    id: number;
    title: string;
    image: string;
    style: string;
  };
}

const LookPage = () => {
  // Safe debug logging function that only runs on client


  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  console.log('🆔 LookPage ID from params:', { 
    rawParams: params, 
    id, 
    idType: typeof id, 
    idNumber: Number(id), 
    isValidNumber: id ? !isNaN(Number(id)) : false 
  });
  const { getSession } = useAuth();
  const { showNotification } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<string | null>(null);
  const [outfitData, setOutfitData] = useState<OutfitData | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoadingOutfit, setIsLoadingOutfit] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const hasFetched = useRef(false);
  const currentId = useRef<string>('');
  const [showLoader, setShowLoader] = useState(true);
  const [activeCarouselOutfitId, setActiveCarouselOutfitId] = useState<string | null>(null);
  const [expandedRecommendations, setExpandedRecommendations] = useState<Record<number, boolean>>({});
  
  // Add ref to prevent duplicate API calls
  const hasFetchedOutfit = useRef(false);

  // Memoize the carousel callback to prevent unnecessary re-renders
  const handleActiveOutfitChange = useCallback((outfitId: string | null) => {
    console.log('🎯 Active outfit change from carousel:', outfitId);
    setActiveCarouselOutfitId(outfitId);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        const { session } = await getSession();
        console.log('📋 Session result:', !!session?.user);
        
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
          console.log('✅ User authenticated:', session.user.id);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
          console.log('❌ No user found');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        console.log('🏁 Auth check complete, setting isCheckingAuth to false');
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [getSession]);

  // Fetch outfit data directly from Supabase (more efficient)
  useEffect(() => {
    console.log('📊 Data fetch effect triggered. Auth status:', { isAuthenticated, isCheckingAuth });
    
    // Only fetch data if user is authenticated and not checking auth
    if (!isAuthenticated || isCheckingAuth) {
      console.log('⏸️ Skipping data fetch - not authenticated or still checking');
      // Reset loading state when not authenticated
      if (!isCheckingAuth && !isAuthenticated) {
        setIsLoadingOutfit(false);
      }
      return;
    }
    
    const fetchOutfitData = async () => {
      try {
        console.log('🚀 Starting outfit data fetch for ID:', id);
        setIsLoadingOutfit(true);
        setError(null);
        
        if (!id) {
          console.log('❌ No ID provided');
          setIsLoadingOutfit(false);
          return;
        }
        
        // Prevent duplicate calls for the same ID
        if (hasFetchedOutfit.current && currentId.current === String(id)) {
          console.log('⚡ Duplicate call prevented for ID:', id);
          setIsLoadingOutfit(false);
          return;
        }

        console.log('📦 Fetching outfit data...');
        hasFetchedOutfit.current = true;
        currentId.current = String(id);

        let outfitData;
        let outfitError;

        // Check if this is a similar outfit ID
        if (id.startsWith('similar_main_')) {
          console.log('🔍 Detected similar outfit ID pattern');
          const similarId = id.replace('similar_main_', 'similar_');
          console.log('🎯 Transformed ID for similar outfits query:', similarId);

          // Fetch from similaroutfit table
          const { data: similarData, error: similarError } = await supabase
            .from('similar_outfits')
            .select('*')
            .eq('similar_outfit_id', similarId)
            .single();

          console.log('📋 Similar outfit query result:', { similarData, similarError });
          outfitData = similarData;
          outfitError = similarError;
        } else {
          // First try to fetch from user_outfits table
          const { data: userData, error: userError } = await supabase
            .from('user_outfits')
            .select(`
              main_outfit_id,
              outfit_name,
              outfit_description,
              why_picked_explanation,
              top_id,
              bottom_id,
              top_image,
              bottom_image,
              top_style,
              bottom_style,
              top_title,
              bottom_title
            `)
            .eq('main_outfit_id', id)
            .single();

          console.log('📋 User outfit query result:', { userData, userError });
          
          // If not found in user_outfits, try outfits_v2 table
          if (userError && userError.code === 'PGRST116') {
            console.log('🔍 Not found in user_outfits, trying outfits_v2...');
            // First fetch outfit data
            const { data: v2OutfitData, error: v2OutfitError } = await supabase
              .from('outfits_v2')
              .select('id, category, top_id, bottom_id')
              .eq('id', id)
              .single();

            let v2Data = null;
            let v2Error = v2OutfitError;

            if (!v2OutfitError && v2OutfitData) {
              // Fetch product details separately
              const productIds = [v2OutfitData.top_id, v2OutfitData.bottom_id].filter(id => id !== 0);
              const { data: productData, error: productError } = await supabase
                .from('products_v2')
                .select('id, title, name, price, product_images, specifications')
                .in('id', productIds);

              if (!productError && productData) {
                const productMap = new Map();
                productData.forEach(product => {
                  productMap.set(product.id, product);
                });

                // Helper functions
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

                const topProduct = productMap.get(v2OutfitData.top_id);
                const bottomProduct = v2OutfitData.bottom_id !== 0 ? productMap.get(v2OutfitData.bottom_id) : null;

                v2Data = {
                  ...v2OutfitData,
                  top: topProduct ? {
                    id: topProduct.id,
                    title: topProduct.title || topProduct.name || 'Untitled Product',
                    image: getProductImage(topProduct),
                    price: topProduct.price || 0,
                    brand: getBrand(topProduct)
                  } : null,
                  bottom: bottomProduct ? {
                    id: bottomProduct.id,
                    title: bottomProduct.title || bottomProduct.name || 'Untitled Product',
                    image: getProductImage(bottomProduct),
                    price: bottomProduct.price || 0,
                    brand: getBrand(bottomProduct)
                  } : null
                };
              }
            }

            console.log('📋 Outfits v2 query result:', { v2Data, v2Error });
            
            if (!v2Error && v2Data) {
              // Transform v2 data to match expected format
              outfitData = {
                main_outfit_id: v2Data.id.toString(),
                outfit_name: v2Data.category + ' Look',
                outfit_description: `A curated ${v2Data.category.toLowerCase()} outfit handpicked just for you.`,
                why_picked_explanation: `Style Match - This ${v2Data.category.toLowerCase()} look matches your style preferences | Curated Selection - Handpicked from our premium collection`,
                top_id: v2Data.top_id,
                bottom_id: v2Data.bottom_id,
                top_image: Array.isArray(v2Data.top) ? v2Data.top[0]?.image : v2Data.top?.image,
                bottom_image: Array.isArray(v2Data.bottom) ? v2Data.bottom[0]?.image : v2Data.bottom?.image,
                top_style: v2Data.category,
                bottom_style: v2Data.category,
                top_title: Array.isArray(v2Data.top) ? v2Data.top[0]?.title : v2Data.top?.title,
                bottom_title: Array.isArray(v2Data.bottom) ? v2Data.bottom[0]?.title : v2Data.bottom?.title,
              };
              outfitError = null;
            } else {
              outfitData = userData;
              outfitError = userError;
            }
          } else {
            outfitData = userData;
            outfitError = userError;
          }
        }

        if (outfitError) throw outfitError;
        if (!outfitData) throw new Error('Outfit not found');

        console.log('✅ Outfit data fetched successfully:', outfitData);

        // Transform the data to match the expected format
        if (outfitData.similar_outfit_id) {
          const transformedOutfit = {
            main_outfit_id: outfitData.similar_outfit_id,
            outfit_name: outfitData.outfit_name,
            outfit_description: outfitData.outfit_description,
            why_picked_explanation: outfitData.why_picked_explanation, 
            top: {
              id: outfitData.similar_top_id,
              title: outfitData?.top_title||'No title',
              image: outfitData.similar_top_image||'No image',
              style: outfitData?.top_style||'No style',
            },
            bottom: {
              id: outfitData.similar_bottom_id,
              title: outfitData?.bottom_title||'No title',
              image: outfitData.similar_bottom_image||'No image',
              style: outfitData?.bottom_style||'No style',
            }
          }
          setOutfitData(transformedOutfit);
        } else{
          const transformedOutfit = {
            main_outfit_id: outfitData.main_outfit_id,
            outfit_name: outfitData.outfit_name,
            outfit_description: outfitData.outfit_description,
            why_picked_explanation: outfitData.why_picked_explanation,
            top: {
              id: outfitData.top_id,
              title: outfitData.top_title,
              image: outfitData.top_image,
              style: outfitData.top_style,
            },
            bottom: {
              id: outfitData.bottom_id,
              title: outfitData.bottom_title,
              image: outfitData.bottom_image,
              style: outfitData.bottom_style,
            }
          };
  
          setOutfitData(transformedOutfit);

        }

       

        // Fetch product details in the same effect
        let productIds: number[] = [];
        if (outfitData.similar_outfit_id) {
          productIds = [outfitData.similar_top_id, outfitData.similar_bottom_id];
        } else {
          // For dresses (bottom_id = 0000), only fetch the top product
          if (String(outfitData.bottom_id) === "0000" || outfitData.bottom_id === 0) {
            productIds = [outfitData.top_id];
          } else {
            productIds = [outfitData.top_id, outfitData.bottom_id];
          }
        }
        
        console.log('🛒 Fetching products for IDs:', productIds);
        console.log('🔍 Outfit data check - bottom_id:', outfitData.bottom_id, 'is dress:', (String(outfitData.bottom_id) === "0000" || outfitData.bottom_id === 0));
        
        // First try to fetch from products_v2 table directly
        let { data: productsV2Data, error: productsV2Error } = await supabase
          .from('products_v2')
          .select('*')
          .in('id', productIds);

        // Then fetch tagged_products data separately
        let { data: taggedProductsData, error: taggedError } = await supabase
          .from('tagged_products')
          .select('*')
          .in('product_id', productIds);

        let productsData: Product[] | null = null;
        let productsError: Error | null = null;

        // Transform products_v2 data to match expected Product interface
        if (!productsV2Error && productsV2Data && productsV2Data.length > 0) {
          console.log('✅ Found products in products_v2 table:', productsV2Data.length);
          
          // Create a map of tagged_products data for quick lookup
          const taggedMap = new Map();
          if (taggedProductsData) {
            taggedProductsData.forEach(tp => {
              taggedMap.set(tp.product_id, tp);
            });
          }
          
          productsData = productsV2Data.map(p => {
            const taggedData = taggedMap.get(p.id);
            
            // Helper to extract images
            const getImages = () => {
              if (!p.product_images) return ['/fallback.jpg'];
              try {
                const images = Array.isArray(p.product_images) 
                  ? p.product_images 
                  : JSON.parse(p.product_images);
                return images && images.length > 0 ? images : ['/fallback.jpg'];
              } catch (e) {
                return ['/fallback.jpg'];
              }
            };

            const images = getImages();

            return {
              id: p.id,
              created_at: p.created_at || new Date().toISOString(),
              title: p.title || p.name || 'Untitled Product',
              name: p.title || p.name || 'Untitled Product',
              overallRating: p.overall_rating || 4.5,
              price: p.price || 0,
              mrp: p.mrp || p.price || 0,
              discount: p.discount || '0%',
              sizesAvailable: p.sizes_available || JSON.stringify(['S', 'M', 'L', 'XL']),
              productImages: JSON.stringify(images),
              specifications: JSON.stringify(p.specifications || {}),
              tagged_products: taggedData ? {
                customer_short_description: taggedData.customer_short_description || '',
                customer_long_recommendation: taggedData.customer_long_recommendation || '',
                product_key_attributes: taggedData.product_key_attributes || '{}',
                // Enhanced fields from tagged_products
                primary_fabric: taggedData.primary_fabric,
                fabric_texture: taggedData.fabric_texture,
                fabric_weight: taggedData.fabric_weight,
                fabric_care: taggedData.fabric_care,
                primary_color: taggedData.primary_color,
                color_family: taggedData.color_family,
                primary_occasion: taggedData.primary_occasion,
                formality_level: taggedData.formality_level,
                fit_type: taggedData.fit_type,
                style_category: taggedData.style_category,
                seasonal_appropriateness: taggedData.seasonal_appropriateness,
                body_shape_compatibility: taggedData.body_shape_compatibility,
                comfort_level: taggedData.comfort_level,
                care_complexity: taggedData.care_complexity,
                versatility_score: taggedData.versatility_score,
                color_harmony: taggedData.color_harmony
              } : {
                customer_short_description: '',
                customer_long_recommendation: '',
                product_key_attributes: '{}'
              }
            };
          });
        } else {
          console.log('⚠️ No products found in products_v2 table, trying products table...');
          
          // Fallback: try to fetch from products table with tagged_products join
          const { data: fallbackProductsData, error: fallbackError } = await supabase
            .from('products')
            .select(`
              *,
              tagged_products (
                customer_short_description,
                product_key_attributes,
                customer_long_recommendation
              )
            `)
            .in('id', productIds) as { 
              data: Product[] | null; 
              error: Error | null 
            };

          productsData = fallbackProductsData;
          productsError = fallbackError;
        }

        // If still no products found, try products_v2 table directly
        if (!productsData || productsData.length === 0) {
          console.log('🔍 No products found in products table, trying products_v2...');
          const { data: v2ProductsData, error: v2ProductsError } = await supabase
            .from('products_v2')
            .select('*')
            .in('id', productIds);

          if (!v2ProductsError && v2ProductsData && v2ProductsData.length > 0) {
            // Transform v2 products to match expected format
            productsData = v2ProductsData.map(p => {
              // Helper to extract brand from specifications
              const getBrand = () => {
                if (!p.specifications) return 'Unknown';
                try {
                  const specs = typeof p.specifications === 'string' 
                    ? JSON.parse(p.specifications) 
                    : p.specifications;
                  return specs?.brand || specs?.Brand || 'Unknown';
                } catch (e) {
                  return 'Unknown';
                }
              };

              // Helper to extract images
              const getImages = () => {
                if (!p.product_images) return ['/fallback.jpg'];
                try {
                  const images = Array.isArray(p.product_images) 
                    ? p.product_images 
                    : JSON.parse(p.product_images);
                  return images && images.length > 0 ? images : ['/fallback.jpg'];
                } catch (e) {
                  return ['/fallback.jpg'];
                }
              };

              const brand = getBrand();
              const images = getImages();

              return {
                id: p.id,
                created_at: p.created_at || new Date().toISOString(),
                title: p.title || p.name || 'Untitled Product',
                name: p.title || p.name || 'Untitled Product',
                overallRating: p.overall_rating || 4.5,
                price: p.price || 0,
                mrp: p.mrp || p.price || 0,
                discount: p.discount || '0%',
                sizesAvailable: p.sizes_available || JSON.stringify(['S', 'M', 'L', 'XL']),
                productImages: JSON.stringify(images),
                specifications: JSON.stringify(p.specifications || {}),
                tagged_products: {
                  customer_short_description: brand,
                  customer_long_recommendation: `Premium ${p.category || 'fashion'} item from ${brand}`,
                  product_key_attributes: JSON.stringify({
                    brand: brand,
                    category: p.category || 'Fashion'
                  })
                }
              };
            });
            productsError = null;
          }
        }

        console.log('📋 Products query result:', { productsCount: productsData?.length, productsError });

        if (productsError) throw productsError;
        if (!productsData) throw new Error('No products found');

        // Sort products so top comes first, then bottom
        const sortedProducts = productsData.sort((a, b) => {
          const topId = String(outfitData.top_id);
          const bottomId = String(outfitData.bottom_id);
          const aId = String(a.id);
          const bId = String(b.id);
          if (aId === topId) return -1;
          if (bId === topId) return 1;
          if (aId === bottomId) return 1;
          if (bId === bottomId) return -1;
          return 0;
        });

        setProducts(sortedProducts);
        setTotalPrice(sortedProducts.reduce((sum, product) => sum + product.price, 0));
        console.log('✅ All data loaded successfully');

      } catch (err) {
        console.error('💥 Error fetching outfit data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load outfit');
        hasFetchedOutfit.current = false; // Reset on error to allow retry
        notFound();
      } finally {
        console.log('🏁 Setting isLoadingOutfit to false');
        setIsLoadingOutfit(false);
      }
    };

    fetchOutfitData();
    
    // Cleanup function to reset refs when component unmounts or id changes
    return () => {
      if (currentId.current !== String(id)) {
        hasFetchedOutfit.current = false;
      }
    };
  }, [id, isAuthenticated, isCheckingAuth]); // Include auth states in dependencies

  useEffect(() => {
    console.log('🔄 Loader effect triggered:', { isLoadingOutfit, isCheckingAuth });
    
    let timer: NodeJS.Timeout | null = null;
    if (isLoadingOutfit || isCheckingAuth) {
      console.log('📱 Setting showLoader to true');
      setShowLoader(true);
      timer = setTimeout(() => {
        if (!isLoadingOutfit && !isCheckingAuth) {
          console.log('⏰ Timer: Setting showLoader to false');
          setShowLoader(false);
        }
      }, 5000);
    } else {
      console.log('📱 Setting showLoader to false immediately');
      setShowLoader(false);
    }
    return () => {
      if (timer) {
        console.log('🧹 Clearing timer');
        clearTimeout(timer);
      }
    };
  }, [isLoadingOutfit, isCheckingAuth]);

  console.log('🎯 Render state:', { 
    showLoader, 
    isAuthenticated, 
    isCheckingAuth, 
    isLoadingOutfit, 
    hasError: !!error,
    hasOutfitData: !!outfitData 
  });

  // Show loading while checking authentication
  if (showLoader) {
    console.log('🔄 Showing loader');
    return <SmartLoader />;
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your personalized looks.
          </p>
          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="block w-full py-3 px-6 bg-black text-white text-center rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="block w-full py-3 px-6 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingOutfit) return <SmartLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Look</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const parseImages = (imgs: string): string[] => {
    try {
      const arr = JSON.parse(imgs);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const getValidImageUrl = (image: string | undefined | null): string => {
    if (!image || image === 'none' || image === 'undefined') {
      return '/fallback.jpg';
    }
      // Allow absolute URLs
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
    // Ensure relative URLs have a leading slash
    if (!image.startsWith('/')) {
      return '/' + image;
    }
  
    return image;
  };



  const parseSizes = (sizesStr: any): { size: string; price: number }[] => {
    // Handle different input types
    if (!sizesStr) {
      return [];
    }

    // If it's already an array, process it directly
    if (Array.isArray(sizesStr)) {
      return sizesStr.map(sizeStr => {
        // Check if the size string contains price information
        if (typeof sizeStr === 'string' && sizeStr.includes('Rs.')) {
          const [size, priceStr] = sizeStr.split('Rs.');
          const price = parseInt(priceStr.trim(), 10);
          return {
            size: size.trim(),
            price: isNaN(price) ? 0 : price
          };
        }
        // Handle regular size strings without price
        return {
          size: String(sizeStr),
          price: 0
        };
      });
    }

    // If it's a string, try to parse it
    if (typeof sizesStr === 'string') {
      try {
        const parsedSizes = JSON.parse(sizesStr);
        if (Array.isArray(parsedSizes)) {
          return parsedSizes.map(sizeStr => {
            // Check if the size string contains price information
            if (typeof sizeStr === 'string' && sizeStr.includes('Rs.')) {
              const [size, priceStr] = sizeStr.split('Rs.');
              const price = parseInt(priceStr.trim(), 10);
              return {
                size: size.trim(),
                price: isNaN(price) ? 0 : price
              };
            }
            // Handle regular size strings without price
            return {
              size: String(sizeStr),
              price: 0
            };
          });
        }
      } catch {
        // Fallback: treat as comma-separated string
        return sizesStr
          .split(',')
          .map(s => ({ size: s.trim(), price: 0 }))
          .filter(s => s.size !== '');
      }
    }

    // If it's an object or other type, try to convert to string
    try {
      const stringValue = String(sizesStr);
      return stringValue
        .split(',')
        .map(s => ({ size: s.trim(), price: 0 }))
        .filter(s => s.size !== '');
    } catch {
      return [];
    }
  };

  const handleSizeSelect = (productId: number, selectedSize: string, price: number) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: selectedSize }));
    
    // Update product price when size is selected
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId 
          ? { ...p, price: price || p.price } // Use provided price or keep original if no price
          : p
      )
    );

    // Recalculate total price
    setTotalPrice(prevProducts => 
      products.reduce((sum, product) => {
        if (product.id === productId) {
          return sum + (price || product.price);
        }
        return sum + product.price;
      }, 0)
    );
  };

  const parseKeyAttributes = (attributes: string): KeyAttributes => {
    try {
      return JSON.parse(attributes) as KeyAttributes;
    } catch {
      return {};
    }
  };

  const parseWhyPickedExplanation = (explanation: string): Array<{title: string, description: string}> => {
    if (!explanation) return [];
    
    // Split by " | " to get individual sections
    const sections = explanation.split(' | ');
    
    return sections.map(section => {
      // Split by " - " to separate title from description
      const [title, ...descriptionParts] = section.split(' - ');
      const description = descriptionParts.join(' - '); // In case there are multiple " - " in description
      
      return {
        title: title.trim(),
        description: description.trim()
      };
    }).filter(item => item.title && item.description);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Premium Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gray-900/5 border border-gray-200 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-gray-700 tracking-wide">YOUR CURATED LOOK</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight"
            whileHover={{ scale: 1.01 }}
          >
            {outfitData?.outfit_name || 'Premium Look'}
          </motion.h1>
          
          <motion.div 
            className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Products Container */}
        {products.length === 1 ? (
          /* Single Product Layout (Dress/One-piece) */
          <div className="space-y-12">
            {products.map((product, idx) => {
            const sizes = parseSizes(product.sizesAvailable);
        
        // Determine the correct image URL for this product
        let imageUrl: string | undefined;
        if (product.id === outfitData?.top.id) {
          imageUrl = outfitData?.top.image;
        } else if (product.id === outfitData?.bottom.id) {
          imageUrl = outfitData?.bottom.image;
        } else {
          // Fallback to product's own images if available
          const productImages = parseImages(product.productImages);
          imageUrl = productImages.length > 0 ? productImages[0] : undefined;
        }
        
        const validImageUrl = getValidImageUrl(imageUrl);
        console.log(product)

      
        let KeyAttributes: KeyAttributes = {};
        let longRecommendation = '';
        const taggedProductsArray = Array.isArray(product.tagged_products)
          ? product.tagged_products
          : product.tagged_products
            ? [product.tagged_products]
            : [];
        
        if (taggedProductsArray.length > 0) {
        
          KeyAttributes = parseKeyAttributes(taggedProductsArray[0].product_key_attributes);
          longRecommendation = taggedProductsArray[0].customer_long_recommendation;
        }
       
        
            return (
              <motion.div 
                key={product.id} 
                className="bg-white border border-gray-200/60 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className={`flex flex-col lg:flex-row gap-8 p-8 ${product.id == outfitData?.top.id ? 'lg:flex-row-reverse' : ''}`}>            
                  {/* Product Image */}
                  <motion.div 
                    className="relative w-full lg:w-[350px] h-[400px] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/60"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/products/${product.id}`}> 
                      <RobustImage 
                        src={validImageUrl}
                        alt={product.name || 'Product Image'} 
                        fill 
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>
                  </motion.div>
                  
                  {/* Product Details */}
                  <div className="flex flex-col flex-1 space-y-6">
                    {/* Product Title */}
                    <motion.h2 
                      className="text-2xl font-light text-gray-900 tracking-tight"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      {product.name}
                    </motion.h2>
                    
                    {/* Customer Short Description */}
                    {taggedProductsArray.length > 0 && taggedProductsArray[0].customer_short_description && (
                      <motion.div 
                        className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/60"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <p className="text-sm text-gray-700 font-light leading-relaxed italic">
                          {taggedProductsArray[0].customer_short_description}
                        </p>
                      </motion.div>
                    )}

                    {/* Enhanced Product Details */}
                    <motion.div 
                      className="bg-white border border-gray-200/60 rounded-xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <h3 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">PRODUCT DETAILS</h3>
                      {/* Primary details from enhanced tagged_products */}
                      {taggedProductsArray.length > 0 && (
                        <ul className="space-y-3">
                          {taggedProductsArray[0].primary_color && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Color:</span>
                              <span className="text-gray-600">{taggedProductsArray[0].primary_color}</span>
                              {taggedProductsArray[0].color_family && (
                                <span className="text-gray-400 text-sm">({taggedProductsArray[0].color_family})</span>
                              )}
                            </li>
                          )}
                          
                          {taggedProductsArray[0].primary_fabric && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Fabric:</span>
                              <span className="text-gray-600">{taggedProductsArray[0].primary_fabric}</span>
                              {taggedProductsArray[0].fabric_texture && (
                                <span className="text-gray-400 text-sm">({taggedProductsArray[0].fabric_texture})</span>
                              )}
                            </li>
                          )}
                          
                          {taggedProductsArray[0].fit_type && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Fit:</span>
                              <span className="text-gray-600">{taggedProductsArray[0].fit_type}</span>
                            </li>
                          )}
                          
                          {taggedProductsArray[0].primary_occasion && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Occasion:</span>
                              <span className="text-gray-600">{taggedProductsArray[0].primary_occasion}</span>
                            </li>
                          )}
                          
                          {taggedProductsArray[0].seasonal_appropriateness && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Season:</span>
                              <span className="text-gray-600">{taggedProductsArray[0].seasonal_appropriateness}</span>
                            </li>
                          )}
                          
                          {taggedProductsArray[0].care_complexity && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Care:</span>
                              <span className="text-gray-600">{taggedProductsArray[0].care_complexity}</span>
                            </li>
                          )}
                        </ul>
                      )}
                    </motion.div>

                    {/* Fallback to legacy key attributes if enhanced data not available */}
                    {(!taggedProductsArray.length || !taggedProductsArray[0].primary_color) && (KeyAttributes.color || KeyAttributes.fit || KeyAttributes.fabric || KeyAttributes.occasion) && (
                      <div className="bg-white border border-gray-200/60 rounded-xl p-6 mt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">BASIC DETAILS</h3>
                        <ul className="space-y-3">
                          {KeyAttributes.color && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Color:</span>
                              <span className="text-gray-600">{KeyAttributes.color}</span>
                            </li>
                          )}
                          {KeyAttributes.fit && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Fit:</span>
                              <span className="text-gray-600">{KeyAttributes.fit}</span>
                            </li>
                          )}
                          {KeyAttributes.fabric && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Fabric:</span>
                              <span className="text-gray-600">{KeyAttributes.fabric}</span>
                            </li>
                          )}
                          {KeyAttributes.occasion && (
                            <li className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900 min-w-[60px]">Occasion:</span>
                              <span className="text-gray-600">{KeyAttributes.occasion}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Customer Long Recommendation - Expandable */}
                    {taggedProductsArray.length > 0 && taggedProductsArray[0].customer_long_recommendation && (
                      <motion.div 
                        className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/60"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <button
                          onClick={() => setExpandedRecommendations(prev => ({
                            ...prev,
                            [product.id]: !prev[product.id]
                          }))}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium mb-3"
                        >
                          <span>{expandedRecommendations[product.id] ? 'Hide' : 'Show'} Detailed Recommendation</span>
                          <span className="text-xs">{expandedRecommendations[product.id] ? '▲' : '▼'}</span>
                        </button>
                        
                        {expandedRecommendations[product.id] && (
                          <motion.div 
                            className="bg-white rounded-lg p-4 border border-gray-200/60"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                              {taggedProductsArray[0].customer_long_recommendation}
                            </p>
                            
                            {/* Additional metrics */}
                            {(taggedProductsArray[0].versatility_score || taggedProductsArray[0].style_category || taggedProductsArray[0].formality_level) && (
                              <div className="pt-3 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  {taggedProductsArray[0].versatility_score && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Versatility:</span>
                                      <span className="font-medium">{Math.round(taggedProductsArray[0].versatility_score * 100)}%</span>
                                    </div>
                                  )}
                                  {taggedProductsArray[0].style_category && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Style:</span>
                                      <span className="font-medium">{taggedProductsArray[0].style_category}</span>
                                    </div>
                                  )}
                                  {taggedProductsArray[0].formality_level && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Formality:</span>
                                      <span className="font-medium">{taggedProductsArray[0].formality_level}</span>
                                    </div>
                                  )}
                                  {taggedProductsArray[0].fabric_weight && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Weight:</span>
                                      <span className="font-medium">{taggedProductsArray[0].fabric_weight}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Size Selection and Purchase */}
                    <div className="mt-8 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">SELECT SIZE</h4>
                        <div className="flex flex-wrap gap-2">
                          {parseSizes(product.sizesAvailable).map(({ size, price }) => (
                            <motion.button
                              key={size}
                              onClick={() => handleSizeSelect(product.id, size, price)}
                              className={`px-4 py-2 border text-sm rounded-lg transition-all duration-200 ${
                                selectedSizes[product.id] === size
                                  ? 'bg-gray-900 text-white border-gray-900'
                                  : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/60">
                        <div className="flex items-center gap-2 mb-4">
                          <FaIndianRupeeSign className="text-gray-900" />
                          <span className="text-2xl font-light text-gray-900">{product.price}</span>
                          {product.mrp > product.price && (
                            <span className="text-lg text-gray-500 line-through ml-2">{product.mrp}</span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <AddToLookbookButton
                            itemId={String(product.id)}
                            itemType="product"
                            className="px-4 py-3"
                          />
                          
                          <Link href={`/products/${product.id}`} className="flex-1">
                            <motion.button
                              className="w-full py-3 bg-white text-gray-900 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              VIEW DETAILS
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        ) : (
          /* Two-piece Outfit Layout (Top + Bottom side by side) */
          <motion.div 
            className="bg-white border border-gray-200/60 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            {/* Outfit Header */}
            <div className="p-8 pb-4 text-center border-b border-gray-200/60">
              <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Complete Outfit</h2>
              <p className="text-gray-600 font-light">Two pieces designed to work together</p>
            </div>

            {/* Side by Side Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/60">
              {products.map((product, idx) => {
                const sizes = parseSizes(product.sizesAvailable);
                
                // Determine the correct image URL for this product
                let imageUrl: string | undefined;
                if (product.id === outfitData?.top.id) {
                  imageUrl = outfitData?.top.image;
                } else if (product.id === outfitData?.bottom.id) {
                  imageUrl = outfitData?.bottom.image;
                } else {
                  const productImages = parseImages(product.productImages);
                  imageUrl = productImages.length > 0 ? productImages[0] : undefined;
                }
                
                const validImageUrl = getValidImageUrl(imageUrl);
                const taggedProductsArray = Array.isArray(product.tagged_products)
                  ? product.tagged_products
                  : product.tagged_products
                    ? [product.tagged_products]
                    : [];
                
                let KeyAttributes: KeyAttributes = {};
                if (taggedProductsArray.length > 0) {
                  KeyAttributes = parseKeyAttributes(taggedProductsArray[0].product_key_attributes);
                }

                const isTopWear = product.id === outfitData?.top.id;

                return (
                  <motion.div 
                    key={product.id}
                    className="p-8 space-y-6"
                    initial={{ opacity: 0, x: isTopWear ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.2 + 0.4 }}
                  >
                    {/* Product Type Badge */}
                    <div className="text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-gray-900/5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide">
                        {isTopWear ? 'TOP WEAR' : 'BOTTOM WEAR'}
                      </span>
                    </div>

                    {/* Product Image */}
                    <motion.div 
                      className="relative w-full h-[300px] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/60 mx-auto max-w-[250px]"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/products/${product.id}`}> 
                        <RobustImage 
                          src={validImageUrl}
                          alt={product.name || 'Product Image'} 
                          fill 
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </Link>
                    </motion.div>

                    {/* Product Details */}
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 tracking-tight">
                        {product.name}
                      </h3>
                      
                      {/* Short Description */}
                      {taggedProductsArray.length > 0 && taggedProductsArray[0].customer_short_description && (
                        <p className="text-sm text-gray-600 font-light leading-relaxed italic">
                          {taggedProductsArray[0].customer_short_description}
                        </p>
                      )}

                      {/* Key Details */}
                      {taggedProductsArray.length > 0 && (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200/60">
                          <div className="space-y-2 text-sm">
                            {taggedProductsArray[0].primary_color && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Color:</span>
                                <span className="font-medium text-gray-900">{taggedProductsArray[0].primary_color}</span>
                              </div>
                            )}
                            {taggedProductsArray[0].primary_fabric && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Fabric:</span>
                                <span className="font-medium text-gray-900">{taggedProductsArray[0].primary_fabric}</span>
                              </div>
                            )}
                            {taggedProductsArray[0].fit_type && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Fit:</span>
                                <span className="font-medium text-gray-900">{taggedProductsArray[0].fit_type}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Size Selection */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">SELECT SIZE</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {parseSizes(product.sizesAvailable).map(({ size, price }) => (
                            <motion.button
                              key={size}
                              onClick={() => handleSizeSelect(product.id, size, price)}
                              className={`px-3 py-2 border text-sm rounded-lg transition-all duration-200 ${
                                selectedSizes[product.id] === size
                                  ? 'bg-gray-900 text-white border-gray-900'
                                  : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200/60">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <FaIndianRupeeSign className="text-gray-900" />
                          <span className="text-xl font-light text-gray-900">{product.price}</span>
                          {product.mrp > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">{product.mrp}</span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <AddToLookbookButton
                            itemId={String(product.id)}
                            itemType="product"
                            className="w-full px-4 py-2 text-sm"
                          />
                          
                          <Link href={`/products/${product.id}`}>
                            <motion.button
                              className="w-full py-2 bg-white text-gray-900 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              VIEW DETAILS
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-red-700">{error}</span>
              <motion.button 
                onClick={() => setError(null)} 
                className="ml-4 text-red-600 hover:text-red-800 text-xl font-light"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Add All Button */}
        <motion.div 
          className="mt-12 bg-white border border-gray-200/60 rounded-2xl p-8 shadow-xl shadow-gray-900/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Save This Look</h3>
            <p className="text-sm text-gray-500 font-light">
              Add this complete outfit to your lookbook collection
            </p>
          </div>
          
          <AddToLookbookButton
            itemId={id as string}
            itemType="outfit"
            className="w-full py-4"
          />
        </motion.div>

        {/* Rating and Feedback */}
        <motion.div 
          className="mt-12 bg-white border border-gray-200/60 rounded-2xl p-8 shadow-xl shadow-gray-900/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {id && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6 tracking-wide">RATING & FEEDBACK</h3>
              <StarRating 
                productId={String(id)} 
                productType="look" 
                topId={outfitData?.top.id.toString()}
                bottomId={outfitData?.bottom.id.toString()}
              />
            </>
          )}
          <div className='mt-8 flex items-center justify-center'>
            {id && currentUser ? (
              <LooksFeedback 
                onClose={() => { }} 
                userId={currentUser.id || ''}
                lookId={id}
                topId={outfitData?.top.id.toString()}
                bottomId={outfitData?.bottom.id.toString()}
              />
            ) : (
              <div className="text-sm text-gray-500 font-light">
                {!id ? 'No outfit ID available' : !currentUser ? 'Please log in to give feedback' : ''}
              </div>
            )}
          </div>
        </motion.div>

        {/* Description and Why Picked Section */}
        {(outfitData?.outfit_description || outfitData?.why_picked_explanation) && (
          <motion.div 
            className="mt-12 bg-white border border-gray-200/60 rounded-2xl p-8 shadow-xl shadow-gray-900/5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {/* Description */}
            {outfitData?.outfit_description && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 tracking-wide">LOOK DESCRIPTION</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {outfitData.outfit_description}
                </p>
              </div>
            )}

            {/* Why This Look Was Picked For You */}
            {outfitData?.why_picked_explanation && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6 tracking-wide">WHY THIS LOOK WAS PICKED FOR YOU</h3>
                <div className="space-y-6">
                  {parseWhyPickedExplanation(outfitData.why_picked_explanation).map((item, index) => (
                    <motion.div 
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200/60"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    >
                      <h4 className="font-medium text-gray-900 mb-3 tracking-wide">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Similar Outfits Section - Only show for normal outfits, not similar outfits */}
        {/* Temporarily hidden - similar outfits causing 404 errors */}
        {/* {!id?.startsWith('similar_main_') && (
          <motion.div 
            className="mt-12 bg-white border border-gray-200/60 rounded-2xl p-8 shadow-xl shadow-gray-900/5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-6 tracking-wide">YOU MAY ALSO LIKE</h3>
            <SimilarOutfitsCarousel onActiveOutfitChange={handleActiveOutfitChange} />
          </motion.div>
        )} */}
      </motion.div>
    </div>
  );
};

export default LookPage;
