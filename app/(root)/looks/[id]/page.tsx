"use client"
import { useParams, notFound } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCartArrowDown } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import SimilarOutfitsCarousel from '@/app/components/looks/SimilarOutfitsCarousel';
import { addToCart } from '@/lib/utils/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import SmartLoader from '@/app/components/loader/SmartLoader';
import StarRating from '@/app/components/starRating';
import LooksFeedback from '@/app/components/looks/LooksFeedback';
import { supabase } from '@/lib/supabase';

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
  
  // Add ref to prevent duplicate API calls
  const hasFetchedOutfit = useRef(false);

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

        console.log('📦 Fetching outfit data from Supabase...');
        hasFetchedOutfit.current = true;
        currentId.current = String(id);

        // Fetch outfit data directly from Supabase instead of API + separate call
        const { data: outfitData, error: outfitError } = await supabase
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

        console.log('📋 Outfit query result:', { outfitData, outfitError });

        if (outfitError) throw outfitError;
        if (!outfitData) throw new Error('Outfit not found');

        console.log('✅ Outfit data fetched successfully');

        // Transform the data to match the expected format
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

        // Fetch product details in the same effect
        const productIds = [outfitData.top_id, outfitData.bottom_id];
        console.log('🛒 Fetching products for IDs:', productIds);
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            tagged_products (
              customer_short_description
            )
          `)
          .in('id', productIds) as { 
            data: Product[] | null; 
            error: Error | null 
          };

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

  const getValidImageUrl = (image: string | undefined): string => {
    if (!image || image === 'none' || image === 'undefined') {
      return '/fallback.jpg';
    }
    return image;
  };

  const handleAddProduct = async (idx: number) => {
    const size = selectedSizes[idx];
    if (!size) { 
      setError('Please select a size'); 
      return; 
    }
    
    setLoading(prev => ({ ...prev, [idx]: true }));
    setError(null);

    try {
      const { session, error: sessionError } = await getSession();
      
      if (sessionError || !session?.user?.id) {
        setError('Please sign in first');
        return;
      }

      const prod = products.find(p => p.id === idx);
      if (!prod) {
        setError('Product not found');
        return;
      }

      const { success, error: cartError } = await addToCart(session.user.id, prod.id, size);
      
      if (!success) {
        setError(cartError || 'Failed to add to cart');
      } 
    } catch (err) {
      setError('An error occurred while adding to cart');
    } finally {
      setLoading(prev => ({ ...prev, [idx]: false }));
    }
  };

  const handleAddAll = async () => {
    const allSelected = products.every((_, i) => selectedSizes[i]);
    if (!allSelected) { 
      setError('Please select sizes for all items'); 
      return; 
    }

    setLoading(prev => ({ ...prev, all: true }));
    setError(null);

    try {
      const { session, error: sessionError } = await getSession();
      
      if (sessionError || !session?.user?.id) {
        setError('Please sign in first');
        return;
      }

      const results = await Promise.all(
        products.map((p, i) => addToCart(session.user.id, p.id, selectedSizes[i]))
      );

      if (!results.every(r => r.success)) {
        setError('Some items failed to add to cart');
      }
    } catch (err) {
      setError('An error occurred while adding items to cart');
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  const parseSizes = (sizesStr: string): string[] => {
    try {
      const parsedSizes = JSON.parse(sizesStr);
      return Array.isArray(parsedSizes) ? parsedSizes : [];
    } catch {
      return sizesStr
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
    }
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
    <>
      {/* Header */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-[26px]">{outfitData?.outfit_name}</span>
      </div>
      <hr className="border-t-1 border-black w-[90%] mx-auto" />

      {/* Products */}
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

        let description = '';
        const taggedProductsArray = Array.isArray(product.tagged_products)
          ? product.tagged_products
          : product.tagged_products
            ? [product.tagged_products]
            : [];
        
        if (taggedProductsArray.length > 0) {
          description = taggedProductsArray[0].customer_short_description || '';
        }
        
        return (
          <div key={product.id} className={`flex w-full mt-8 mb-2 gap-2 ${product.id == outfitData?.top.id ? 'flex-row-reverse' : ''}`}>            
            <div className="relative w-[221px] h-[260.5px] overflow-hidden">
              <Image 
                src={validImageUrl}
                alt={product.name || 'Product Image'} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="relative flex flex-col flex-1 max-w-[400px] h-[280.5px] pl-2 pr-2">
              <h1 className="text-lg text-left mb-1 mt-0 text-[14px] font-bold">{product.name}</h1>
              {description ? (
                <p className="text-xs text-gray-700 mb-2">{description}</p>
              ) : (
                <p className="text-xs text-gray-400 mb-2 italic">No description available.</p>
              )}
              
              {/* Flexible spacer to push sizes and price to bottom */}
              <div className="flex-1"></div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {parseSizes(product.sizesAvailable).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                    className={`w-8 h-8 flex items-center justify-center border text-xs rounded transition-colors ${
                      selectedSizes[product.id] === size
                        ? 'bg-[#007e90] text-white border-[#007e90]'
                        : 'bg-white text-black border-gray-300 hover:border-[#007e90]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <h4 className="flex text-black font-[Boston] text-[20px] font-semibold [font-variant:all-small-caps] mb-2">
                  <FaIndianRupeeSign className="h-4 mt-2" /> {product.price}
                </h4>

                <div className="flex flex-row gap-2 items-center">
                  <button
                    onClick={() => handleAddProduct(product.id)}
                    disabled={loading[product.id] || !selectedSizes[product.id]}
                    className="flex items-center justify-center h-9 w-9 bg-[#007e90] text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#006d7d] transition-colors rounded"
                  >
                    <FaCartArrowDown className="h-4 w-4" />
                  </button>
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <button
                      className="w-full h-9 bg-white text-[#007e90] border border-[#007e90] text-xs font-medium rounded hover:bg-[#e6f7fa] transition-colors"
                    >
                      VIEW MORE
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-900 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Add All Button */}
      <div className="px-6 py-4 mt-8">
        <button
          onClick={handleAddAll}
          disabled={loading.all || products.some((_, i) => !selectedSizes[i])}
          className="w-full py-3 bg-[#007e90] text-white font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#006d7d]"
        >
          {loading.all ? 'Adding All...' : `ADD ALL TO CART - ₹${totalPrice}`}
        </button>
      </div>

      {/* Rating and Feedback */}
      <div className="px-6 py-4">
        {id && (
          <StarRating productId={String(id)} productType="look" />
        )}
        <div className='mt-6 flex items-center justify-center px-[8rem]'>
          {id && currentUser ? (
            <LooksFeedback 
              onClose={() => { }} 
              userId={currentUser.id || ''}
              lookId={id}
            />
          ) : (
            <div className="text-sm text-gray-500">
              {!id ? 'No outfit ID available' : !currentUser ? 'Please log in to give feedback' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Description and Why Picked Section */}
      <div className="px-6 py-4">
        {/* Description */}
        {outfitData?.outfit_description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">DESCRIPTION</h2>
            <p className="text-gray-700 leading-relaxed">
              {outfitData.outfit_description}
            </p>
          </div>
        )}

        {/* Why This Look Was Picked For You */}
        {outfitData?.why_picked_explanation && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">WHY THIS LOOK WAS PICKED FOR YOU</h2>
            <div className="space-y-4">
              {parseWhyPickedExplanation(outfitData.why_picked_explanation).map((item, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar Outfits Section */}
      <div className="px-6 py-8 mt-[-2rem]">
        <h1 className="text-[22px] font-[Boston] font-medium mb-[-2rem]">YOU MAY ALSO LIKE</h1>
        <SimilarOutfitsCarousel onActiveOutfitChange={setActiveCarouselOutfitId} />
      </div>
    </>
  );
};

export default LookPage;
