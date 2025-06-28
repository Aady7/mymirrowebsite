"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {  useParams} from "next/navigation";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useEffect, useState, useRef, useContext } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/lib/hooks/useAuth";
import { addToCart } from "@/lib/utils/cart";
import { CartContext } from "@/app/components/provider";
import { useNotification } from "@/app/components/common/NotificationContext";

import SmartLoader from "@/app/components/loader/SmartLoader";
import StarRating from "@/app/components/starRating";
import FeedbackButton from "@/app/components/feedbackButton";
import { getSimilarProducts } from "@/app/utils/productsapi";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  created_at: string;
  url: string;
  title: string;
  name: string;
  overallRating: number;
  price: number;
  mrp: number;
  discount: string;
  sizesAvailable: string;
  productImages: string;
  specifications: string;
  brandName?: string;
  description?: string;
  tagged_products: {
    customer_short_description?: string;
    customer_long_recommendation?: string;
  }[];
}

interface SimilarProduct {
  id: string;
  title: string;
  name: string;
  price: number;
  productImages: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const outfitId = searchParams.get('outfitId');
  const { getSession } = useAuth();
  const { refreshCart } = useContext(CartContext);
  const { showNotification } = useNotification();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [outfit, setOutfit] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [isFetchingSimilar, setIsFetchingSimilar] = useState(false);
  const [similarProductsError, setSimilarProductsError] = useState<string | null>(null);
  const hasFetchedSimilar = useRef(false);
  const hasFetchedProduct = useRef(false);
  const currentProductId = useRef<string>('');
  const [styleWithProducts, setStyleWithProducts] = useState<any[]>([]);
  const [styleWithProductDetails, setStyleWithProductDetails] = useState<Product[]>([]);

  // Session check
  useEffect(() => {
    const checkSession = async () => {
      const { session } = await getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    checkSession();
  }, [getSession]);

  // Auto-play functionality
  useEffect(() => {
    if (!product) return;
    
    let images: string[] = [];
    try {
      images = JSON.parse(product.productImages);
    } catch {
      images = [];
    }

    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [product]);

  useEffect(() => {
    // Reset refs if product ID has changed
    if (currentProductId.current !== String(id)) {
      hasFetchedProduct.current = false;
      hasFetchedSimilar.current = false;
      console.log('🔄 Product ID changed from', currentProductId.current, 'to', String(id), '- resetting fetch flags');
    }

    const fetchProduct = async () => {
      // Prevent duplicate calls for the same product
      if (hasFetchedProduct.current && currentProductId.current === String(id)) {
        console.log('⚠️ Product already fetched for ID:', id, 'skipping...');
        return;
      }

      try {
        setLoading(true);
        hasFetchedProduct.current = true;
        currentProductId.current = String(id);
        console.log('🔍 Fetching product details for:', id);
        
        const { data, error } = await supabase
          .from("products")
          .select(`*,
            tagged_products(
              customer_short_description,
              customer_long_recommendation
            )`)
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Product not found");

        setProduct(data as Product);
        console.log('✅ Product details fetched successfully for:', id);
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch product");
        // Reset on error to allow retry
        hasFetchedProduct.current = false;
      } finally {
        setLoading(false);
      }
    };

    const fetchOutfit = async () => {
      if (!outfitId) return;
      
      try {
        const { data, error } = await supabase
          .from("user_outfits")
          .select("*")
          .eq('main_outfit_id', outfitId)
          .single();
          
        if (error) throw error;
        if (!data) throw new Error("No data found");
        setOutfit(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch outfit");
      }
    };

    const fetchStyleWithProducts = async () => {
      try {
        console.log('🔍 Fetching outfits containing product:', id);
        
        // Find outfits where this product is either the top or bottom
        const { data: outfits, error } = await supabase
          .from("user_outfits")
          .select("*")
          .or(`top_id.eq.${id},bottom_id.eq.${id}`)
          .limit(5); // Limit to 5 outfits

        if (error) {
          console.error('❌ Error fetching style-with outfits:', error);
          return;
        }

        if (outfits && outfits.length > 0) {
          console.log('✅ Found outfits containing this product:', outfits.length);
          
          // Get the other products from these outfits
          const otherProducts = outfits.map(outfit => {
            // If current product is the top, return bottom info
            if (outfit.top_id === String(id)) {
              return {
                id: outfit.bottom_id,
                name: outfit.bottom_title,
                image: outfit.bottom_image,
                outfitId: outfit.main_outfit_id,
                type: 'bottom'
              };
            } 
            // If current product is the bottom, return top info
            else if (outfit.bottom_id === String(id)) {
              return {
                id: outfit.top_id,
                name: outfit.top_title,
                image: outfit.top_image,
                outfitId: outfit.main_outfit_id,
                type: 'top'
              };
            }
            return null;
          }).filter(Boolean); // Remove null values

          // Remove duplicates based on product id
          const uniqueProducts = otherProducts.filter((product, index, self) => 
            product && index === self.findIndex(p => p && p.id === product.id)
          );

          setStyleWithProducts(uniqueProducts);
          console.log('✅ Style-with products set:', uniqueProducts.length);

          // Fetch detailed product information for the complementary products
          if (uniqueProducts.length > 0) {
            const productIds = uniqueProducts.map(p => p?.id).filter(Boolean);
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select(`
                *,
                tagged_products (
                  customer_short_description,
                  customer_long_recommendation
                )
              `)
              .in('id', productIds);

            if (productsError) {
              console.error('❌ Error fetching product details:', productsError);
            } else if (productsData) {
              console.log('✅ Product details fetched:', productsData.length);
              setStyleWithProductDetails(productsData as Product[]);
            }
          }
        } else {
          console.log('ℹ️ No outfits found containing this product');
          setStyleWithProducts([]);
        }
      } catch (err) {
        console.error('❌ Error fetching style-with products:', err);
        setStyleWithProducts([]);
      }
    };

    const fetchSimilar = async (retryCount = 0, maxRetries = 3) => {
      // Prevent multiple simultaneous calls
      if (isFetchingSimilar || (hasFetchedSimilar.current && currentProductId.current === String(id))) {
        console.log('⚠️ Similar products fetch already in progress or completed for product:', id, 'skipping...');
        return;
      }

      try {
        setIsFetchingSimilar(true);
        setSimilarProductsError(null);
        hasFetchedSimilar.current = true;
        console.log('🔍 Fetching similar products for product:', id, 'Retry:', retryCount);
        
        const data = await getSimilarProducts({
          productId: String(id),
          count: 10,
          diverse: true,
          personalized: false,
        });
        
        if (data.status === 202) {
          if (retryCount < maxRetries) {
            console.log('⏳ Similar products still processing, retrying in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsFetchingSimilar(false); // Reset before retry
            hasFetchedSimilar.current = false; // Allow retry
            return fetchSimilar(retryCount + 1, maxRetries);
          } else {
            console.log('⚠️ Max retries reached for similar products');
            return;
          }
        }
        
        if (data?.similar_products) {
          console.log('✅ Similar products fetched successfully:', data.similar_products.length);
          const formattedProducts = data.similar_products.map((item: any) => ({
            id: item.product_id,
            title: item.title,
            name: item.title,
            price: item.price,
            productImages: item.image_url
          }));
          setSimilarProducts(formattedProducts);
        }
      } catch (err) {
        console.error('❌ Error fetching similar products:', err);
        setSimilarProductsError('Failed to load similar products. Please try again later.');
        // Reset refs on error to allow retry
        hasFetchedSimilar.current = false;
      } finally {
        setIsFetchingSimilar(false);
      }
    };

    fetchProduct();
    fetchSimilar();
    fetchStyleWithProducts();
    if (outfitId) fetchOutfit();

    // Cleanup function to reset refs when ID changes
    return () => {
      if (currentProductId.current !== String(id)) {
        hasFetchedProduct.current = false;
        hasFetchedSimilar.current = false;
        currentProductId.current = '';
      }
    };
  }, [id, outfitId]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setAddToCartError(null);
    setAddToCartSuccess(false);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setAddToCartError("Please select a size first");
      return;
    }

    setIsAddingToCart(true);
    setAddToCartError(null);
    setAddToCartSuccess(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAddToCartError("Please sign in to add items to cart");
        return;
      }

      const { success, error } = await addToCart(
        session.user.id,
        product?.id as number,
        selectedSize
      );

      if (success) {
        console.log('✅ Item added to cart successfully, refreshing cart count');
        setAddToCartSuccess(true);
        // Refresh cart count in header
        await refreshCart();
        // Show notification
        showNotification(`${product?.name || 'Item'} added to cart!`, 'success');
        setTimeout(() => setAddToCartSuccess(false), 3000);
      } else {
        setAddToCartError(error || "Failed to add item to cart");
      }
    } catch (err) {
      setAddToCartError("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Utility function for style-with products
  const getProductDescription = (productDetail: Product): string => {
    const taggedProductsArray = Array.isArray(productDetail.tagged_products)
      ? productDetail.tagged_products
      : productDetail.tagged_products
        ? [productDetail.tagged_products]
        : [];
    
    if (taggedProductsArray.length > 0) {
      return taggedProductsArray[0].customer_short_description || 
             taggedProductsArray[0].customer_long_recommendation || '';
    }
    return '';
  };

  if (loading) {
    return <SmartLoader />;
  }

  if (error || !product) {
    return <div>Error: {error || "Product not found"}</div>;
  }

  // Parse product images
  const productImages = (() => {
    if (!product) return [];
    try {
      return JSON.parse(product.productImages);
    } catch {
      return [];
    }
  })();

  // Handle sizes
  const productSizes = (() => {
    if (!product) return [];
    try {
      const parsedSizes = JSON.parse(product.sizesAvailable);
      if (Array.isArray(parsedSizes)) {
        // Extract only the size part (before "Rs." or any price info)
        return parsedSizes.map(size => {
          // Handle cases like "S Rs. 719" or "M Rs. 699"
          const sizeOnly = size.split(' Rs.')[0].split(' ₹')[0].trim();
          return sizeOnly;
        }).filter(s => s !== '');
      }
      return [];
    } catch {
      return product.sizesAvailable
        .split(',')
        .map(s => {
          // Extract only the size part for comma-separated format too
          const sizeOnly = s.split(' Rs.')[0].split(' ₹')[0].trim();
          return sizeOnly;
        })
        .filter(s => s !== '');
    }
  })();

  // Handle tagged_products - normalize to always be treated as an array for consistency
  const taggedProductsArray = Array.isArray(product.tagged_products)
    ? product.tagged_products
    : product.tagged_products
      ? [product.tagged_products]
      : [];

  // Get description from tagged_products
  let description = '';
  if (taggedProductsArray.length > 0) {
    description = taggedProductsArray[0].customer_long_recommendation || 
                  taggedProductsArray[0].customer_short_description || 
                  '';
  }

  return (
    <div className="w-full px-[24px] py-1 max-w-md mx-auto font-['Boston']">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="" style={{ fontSize: "25px", fontWeight: 300 }}>
          {product.title || ''}
        </h1>
      </div>

      {/* Horizontal Line */}
      <hr className="border border-black mb-4" />

      {/* Image Section */}
      <div className="relative w-70% h-[350px] mt-6">
        {/* Main Image */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={productImages[selectedImageIndex] || "/fallback.jpg"}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Image Toggle Menu */}
        {productImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/80 p-2 rounded-lg">
            {productImages.map((_: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full ${selectedImageIndex === index ? "bg-black" : "bg-gray-300"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/*Price section*/}
      <div>
        <div className="flex mt-8 items-center gap-1">
          <FaIndianRupeeSign className="text-lg" />
          <h1 className="text-2xl font-bold">{product?.price}</h1>
        </div>
        <div className="w-full p-2 mt-[12px]">
          <h6 className="text-left text-sm">SIZE</h6>
          <div className="flex gap-3 mt-2 flex-wrap">
            {productSizes.map((size: string, index: number) => (
              <Button
                key={index}
                onClick={() => handleSizeSelect(size)}
                className={`text-xs rounded text-black bg-white border-3 transition-all duration-200 ${
                  selectedSize === size 
                    ? "border-[#007e90] text-black" 
                    : "border-gray-400 hover:border-[#007e90]"
                }`}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Add to Cart Error/Success Messages */}
        {addToCartError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
            {addToCartError}
          </div>
        )}
        {addToCartSuccess && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-600 text-xs">
            Item added to cart successfully!
          </div>
        )}

        {/* Buttons Section */}
        <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          {/* Buttons Row */}
          <div className="flex items-center gap-4 mt-5">
            <Button className="flex-[1] min-w-[100px] max-w-[160px] bg-[#007e90] hover:bg-[#006d7d] rounded text-white h-10 text-xs transition-colors">
              BUY NOW
            </Button>
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedSize || isAddingToCart}
              className={`flex-[2] min-w-[140px] max-w-[240px] rounded h-10 text-xs transition-all duration-200 ${
                selectedSize 
                  ? "bg-[#007e90] hover:bg-[#006d7d] text-white" 
                  : "bg-white text-[#007e90] border border-[#007e90] cursor-not-allowed opacity-50"
              }`}
            >
              {isAddingToCart ? "ADDING..." : "ADD TO CART"}
            </Button>
          </div>

          {/* Divider */}
          <hr className="w-full border border-black mt-[30px]" />
        </div>
      </div>

      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="w-full mt-8">
          <h1 className="font-[Boston] text-[14px] text-left font-black" style={{fontVariant:'small-caps'}}>
            DESCRIPTION
          </h1>
        </div>

        <div className="w-full mt-2">
          <p className="text-[12px] font-light font-[Boston] text-left tracking-wide">
            {description ? description : 'No description available.'}
          </p>
        </div>

        {/*star rating section */}
        <div className="w-full mt-4 flex flex-col">
          <h1 className="font-[Boston] font-black text-[12px] text-left" style={{fontVariant:'small-caps'}}>
            RATING
          </h1>
          <StarRating productId={id as string} />
        </div>
      </div>

      {/*button feedback section */}
      <div className="flex sm:px-30 px-31 mt-6">
        <FeedbackButton productId={parseInt(id as string, 10)}/>
      </div>

      {/* Horizontal Line */}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <hr className="w-full border border-black mt-[30px]" />
      </div>

      {/* Style It With Section - General */}



      {styleWithProducts.length > 0 && styleWithProductDetails.length > 0 && (
        <div className="text-center mt-8 w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          <h1 className="font-medium" style={{ fontSize: "20px", fontWeight: 500 }}>
            STYLE IT WITH
          </h1>
          

          
          <div className="space-y-6 mt-6">
            {styleWithProducts.slice(0, 3).map((styleProduct, index) => {
              const productDetail = styleWithProductDetails.find(p => String(p.id) === String(styleProduct.id));
              
              if (!productDetail) {
                return null;
              }

              const description = getProductDescription(productDetail);
              
                              return (
                <div key={`${styleProduct.id}-${index}`} className="pb-6">
                  <div className="flex w-full gap-4">
                    {/* Product Image */}
                    <div className="relative w-[200px] h-[240px] flex-shrink-0">
                      <Image
                        src={styleProduct.image || "/fallback.jpg"}
                        alt={styleProduct.name}
                        fill
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between h-[240px]">
                      <div>
                        <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-left">{productDetail.name}</h2>
                        {description ? (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-3 text-left">{description}</p>
                        ) : (
                          <p className="text-sm text-gray-400 mb-2 italic text-left">No description available.</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaIndianRupeeSign className="text-base text-black" />
                        <span className="text-base font-bold text-black text-left">{productDetail.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Moved to next line */}
                  <div className="flex gap-3 mt-6 px-2">
                    <Link href={`/products/${styleProduct.id}`} className="flex-1">
                      <Button className="w-full h-9 bg-white text-[#007e90] border border-[#007e90] text-xs rounded hover:bg-[#e6f7fa] transition-colors">
                        VIEW PRODUCT
                      </Button>
                    </Link>
                    <Link href={`/looks/${styleProduct.outfitId}`} className="flex-1">
                      <Button className="w-full h-9 bg-[#007e90] hover:bg-[#006d7d] text-white text-xs rounded transition-colors">
                        VIEW OUTFIT
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Horizontal Line */}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <hr className="w-full border border-black mt-[30px]" />
      </div>

      {/*Style with it - from outfit page*/}
      {outfit && (
        <div className="text-center mt-8 w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          <h1 className="font-medium" style={{ fontSize: "20px", fontWeight: 500 }}>
            STYLE IT WITH
          </h1>
          <div className="flex justify-center mt-6">
            <div className="relative group cursor-pointer w-full max-w-[300px]">
              {/* Image Container */}
              <div className="relative w-full h-[400px]">
                <Image
                  src={id === outfit?.top_id ? outfit?.bottom_image : outfit?.top_image}
                  alt="Style Product"
                  width={300}
                  height={400}
                  priority
                  className="rounded-md shadow-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div className="flex justify-end mt-6 mb-8">
            <Link href={`/looks/${outfit.main_outfit_id}`}>
              <button className="bg-[#007e90] hover:bg-[#006d7d] text-white px-6 py-2 text-sm transition-colors rounded">
                View More
              </button>
            </Link>
          </div>
        </div>
      )}

      {/*you may also like section*/}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="text-center mt-8 mb-2">
          <h1 className="font-medium" style={{ fontSize: "20px", fontWeight: 500 }}>
            YOU MAY ALSO LIKE
          </h1>
        </div>

        {/* Loading State */}
        {isFetchingSimilar && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007e90]"></div>
              <p className="text-sm text-gray-600">Loading similar products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isFetchingSimilar && similarProductsError && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">{similarProductsError}</p>
              <button
                onClick={() => {
                  setSimilarProductsError(null);
                  hasFetchedSimilar.current = false;
                  // Trigger refetch by calling the fetchSimilar function
                  const fetchSimilar = async (retryCount = 0, maxRetries = 3) => {
                    if (isFetchingSimilar) return;
                    
                    try {
                      setIsFetchingSimilar(true);
                      setSimilarProductsError(null);
                      
                      const data = await getSimilarProducts({
                        productId: String(id),
                        count: 10,
                        diverse: true,
                        personalized: false,
                      });
                      
                      if (data?.similar_products) {
                        const formattedProducts = data.similar_products.map((item: any) => ({
                          id: item.product_id,
                          title: item.title,
                          name: item.title,
                          price: item.price,
                          productImages: item.image_url
                        }));
                        setSimilarProducts(formattedProducts);
                        hasFetchedSimilar.current = true;
                      }
                    } catch (err) {
                      console.error('❌ Error fetching similar products:', err);
                      setSimilarProductsError('Failed to load similar products. Please try again later.');
                    } finally {
                      setIsFetchingSimilar(false);
                    }
                  };
                  fetchSimilar();
                }}
                className="px-4 py-2 bg-[#007e90] hover:bg-[#006d7d] text-white text-xs rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isFetchingSimilar && !similarProductsError && similarProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-gray-600">No similar products found.</p>
          </div>
        )}

        {/* Products Grid - Only show when not loading, no error, and has products */}
        {!isFetchingSimilar && !similarProductsError && similarProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 mb-[30px] max-h-[600px] overflow-y-auto p-2">
            {similarProducts.map((similarProduct) => (
              <div key={similarProduct.id} className="flex flex-col items-center">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={similarProduct.productImages || "/fallback.jpg"}
                    alt={similarProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-left mt-2 line-clamp-2 h-8">{similarProduct.name}</p>
                <p className="text-xs mt-2">₹ {similarProduct.price}</p>
                <Link href={`/products/${similarProduct.id}`} className="w-full mt-2">
                  <Button className="w-full h-7 bg-[#007e90] hover:bg-[#006d7d] text-white text-xs py-[10px] rounded transition-colors">
                    VIEW MORE
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}