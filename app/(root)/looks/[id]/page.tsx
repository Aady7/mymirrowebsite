"use client"
import { useParams, notFound } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCartArrowDown } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
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
  const { id } = useParams();
  const { getSession } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOutfit, setIsLoadingOutfit] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [outfitData, setOutfitData] = useState<OutfitData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  
  // Add ref to prevent duplicate API calls
  const hasFetched = useRef(false);
  const currentId = useRef<string | null>(null);

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { session, error: sessionError } = await getSession();
        
        if (sessionError || !session?.user?.id) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
          return;
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [getSession]);

  // Fetch outfit data directly from Supabase (more efficient)
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!isAuthenticated || isCheckingAuth) return;
    
    const fetchOutfitData = async () => {
      try {
        setIsLoadingOutfit(true);
        setError(null);
        
        if (!id) return;
        
        // Prevent duplicate calls for the same ID
        if (hasFetched.current && currentId.current === String(id)) {
          setIsLoadingOutfit(false);
          return;
        }

        hasFetched.current = true;
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

        if (outfitError) throw outfitError;
        if (!outfitData) throw new Error('Outfit not found');

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
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            tagged_products(
              customer_short_description,
              customer_long_recommendation,
              product_key_attributes
            )
          `)
          .in('id', productIds) as { 
            data: Product[] | null; 
            error: Error | null 
          };

        if (productsError) throw productsError;
        if (!productsData) throw new Error('No products found');

        // Sort products so top comes first, then bottom
        const sortedProducts = productsData.sort((a, b) => {
          // Convert IDs to strings for comparison since outfit data has string IDs
          const topId = String(outfitData.top_id);
          const bottomId = String(outfitData.bottom_id);
          const aId = String(a.id);
          const bId = String(b.id);
          
          if (aId === topId) return -1; // Top product comes first
          if (bId === topId) return 1;  // If b is top, a should come after
          if (aId === bottomId) return 1; // Bottom product comes second
          if (bId === bottomId) return -1; // If b is bottom, a should come before
          return 0; // Keep original order for any other products
        });

        setProducts(sortedProducts);
        setTotalPrice(sortedProducts.reduce((sum, product) => sum + product.price, 0));

      } catch (err) {
        console.error('Error fetching outfit data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load outfit');
        hasFetched.current = false; // Reset on error to allow retry
        notFound();
      } finally {
        setIsLoadingOutfit(false);
      }
    };

    fetchOutfitData();
    
    // Cleanup function to reset refs when component unmounts or id changes
    return () => {
      if (currentId.current !== String(id)) {
        hasFetched.current = false;
      }
    };
  }, [id, isAuthenticated, isCheckingAuth]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isLoadingOutfit || isCheckingAuth) {
      setShowLoader(true);
      timer = setTimeout(() => {
        if (!isLoadingOutfit && !isCheckingAuth) setShowLoader(false);
      }, 5000);
    } else {
      timer = setTimeout(() => setShowLoader(false), 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoadingOutfit, isCheckingAuth]);

  // Show loading while checking authentication
  if (showLoader) return <SmartLoader />;

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
        <span className="text-[26px] font-thin">{outfitData?.outfit_name}</span>
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
        const taggedProduct = product.tagged_products;
        const keyAttributes = taggedProduct?.product_key_attributes 
          ? parseKeyAttributes(taggedProduct.product_key_attributes)
          : {};
        
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
              <h1 className="text-lg text-left mx-2 font-thin mb-1 mt-0 text-[14px]">{product.name}</h1>
              
              <div className="font-[Boston] text-[12px] font-medium leading-normal mb-1 pr-4 mx-2 tracking-wide text-gray-600">
                {Object.keys(keyAttributes).length > 0 ? (
                  <>
                    {keyAttributes.color && (
                      <p className="mb-0.5">Color - {keyAttributes.color}</p>
                    )}
                    {keyAttributes.fit && (
                      <p className="mb-0.5">Fit - {keyAttributes.fit}</p>
                    )}
                    {keyAttributes.fabric && (
                      <p className="mb-0.5">Fabric - {keyAttributes.fabric}</p>
                    )}
                    {keyAttributes.occasion && (
                      <p className="mb-0.5">Occasion - {keyAttributes.occasion}</p>
                    )}
                    {Object.entries(keyAttributes)
                      .filter(([key]) => !['color', 'fit', 'fabric', 'occasion'].includes(key))
                      .map(([key, value]) => (
                        <p key={key} className="mb-0.5">
                          {key.charAt(0).toUpperCase() + key.slice(1)} - {value}
                        </p>
                      ))}
                  </>
                ) : (
                  <p className="mb-0.5 text-gray-500 italic">Product details loading...</p>
                )}
              </div>

              <div className="absolute bottom-8 left-2 right-2">
                <h4 className="flex text-black font-[Boston] text-[20px] font-semibold [font-variant:all-small-caps] mb-1">
                  <FaIndianRupeeSign className="h-4 mt-2" /> {product.price}
                </h4>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                        className={`px-2 py-1 border text-xs rounded transition-colors ${
                          selectedSizes[product.id] === size
                            ? 'bg-[#007e90] text-white border-[#007e90]'
                            : 'bg-white text-black border-gray-300 hover:border-[#007e90]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddProduct(product.id)}
                    disabled={loading[product.id] || !selectedSizes[product.id]}
                    className="flex items-center justify-center gap-1 w-full py-1.5 bg-[#007e90] text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#006d7d] transition-colors"
                  >
                    {loading[product.id] ? (
                      'Adding...'
                    ) : (
                      <>
                        <FaCartArrowDown className="h-3 w-3" />
                        ADD TO CART
                      </>
                    )}
                  </button>
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
      <div className="px-6 py-4">
        <button
          onClick={handleAddAll}
          disabled={loading.all || products.some((_, i) => !selectedSizes[i])}
          className="w-full py-3 bg-[#007e90] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#006d7d] transition-colors"
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
          <LooksFeedback 
            onClose={() => { }} 
            userId={''}
            lookId={Number(id)}
          />
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
        <h1 className="font-thin text-[22px] font-[Boston] mb-[-2rem]">YOU MAY ALSO LIKE</h1>
        <SimilarOutfitsCarousel />
      </div>
    </>
  );
};

export default LookPage;
