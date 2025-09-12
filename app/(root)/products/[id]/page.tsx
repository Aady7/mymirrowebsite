"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useEffect, useState, useRef, useContext } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/lib/hooks/useAuth";
import AddToLookbookButton from "@/app/components/lookbook/AddToLookbookButton";
import { useNotification } from "@/app/components/common/NotificationContext";

import SmartLoader from "@/app/components/loader/SmartLoader";
import StarRating from "@/app/components/starRating";
import FeedbackButton from "@/app/components/feedbackButton";
import { getSimilarProducts } from "@/app/utils/productsapi";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/utils/analytics";
import RobustImage from "@/app/components/common/RobustImage";
//buy now button redirect link on it
import { getAffiliate } from "@/app/utils/affiliateMap";
import { motion, AnimatePresence } from 'framer-motion';
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
  brandname:string,
  title: string;
  name: string;
  price: number;
  productImages: string;
}

interface tagged_products{
  id:number,
}



export default function ProductPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const outfitId = searchParams.get("outfitId");
  const { getSession } = useAuth();
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
  const [isFetchingSimilar, setIsFetchingSimilar] = useState(false);
  const [similarProductsError, setSimilarProductsError] = useState<
    string | null
  >(null);
  const hasFetchedSimilar = useRef(false);
  const hasFetchedProduct = useRef(false);
  const currentProductId = useRef<string>("");
  const [styleWithProducts, setStyleWithProducts] = useState<any[]>([]);
  const [styleWithProductDetails, setStyleWithProductDetails] = useState<
    Product[]
  >([]);

  // Parse product images
  const productImages = (() => {
    if (!product) return [];
    try {
      // Try both field names for compatibility
      const imageData = product.product_images || product.productImages;
      console.log('🔍 Product image data:', {
        product_images: product.product_images,
        productImages: product.productImages,
        imageData,
        type: typeof imageData
      });
      
      if (!imageData) {
        console.log('⚠️ No image data found for product');
        return [];
      }
      
      const parsed = typeof imageData === 'string' ? JSON.parse(imageData) : imageData;
      console.log('✅ Parsed product images:', parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('❌ Error parsing product images:', error);
      return [];
    }
  })();

  //auto side effect added here
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);
    return () => clearInterval(interval); //this is cleanup of the interval
  }, [productImages.length]);

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

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedImageIndex < productImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
    if (isRightSwipe && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Navigation handlers
  const goToPrevious = () => {
    setSelectedImageIndex(
      selectedImageIndex === 0
        ? productImages.length - 1
        : selectedImageIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex(
      selectedImageIndex === productImages.length - 1
        ? 0
        : selectedImageIndex + 1
    );
  };

  useEffect(() => {
    // Reset refs if product ID has changed
    if (currentProductId.current !== String(id)) {
      hasFetchedProduct.current = false;
      hasFetchedSimilar.current = false;
      console.log(
        "🔄 Product ID changed from",
        currentProductId.current,
        "to",
        String(id),
        "- resetting fetch flags"
      );
    }

    const fetchProduct = async () => {
      // Prevent duplicate calls for the same product
      if (
        hasFetchedProduct.current &&
        currentProductId.current === String(id)
      ) {
        console.log("⚠️ Product already fetched for ID:", id, "skipping...");
        return;
      }

      try {
        setLoading(true);
        hasFetchedProduct.current = true;
        currentProductId.current = String(id);
        console.log("🔍 Fetching product details for:", id);

        // Always fetch from products_v2 table
        console.log("🔍 Fetching from products_v2 table for product:", id);

        let { data, error } = await supabase
          .from("products_v2")
          .select("*")
          .eq("id", id)
          .single();

        // Also fetch tagged_products data separately
        if (!error && data) {
          const { data: taggedData, error: taggedError } = await supabase
            .from("tagged_products")
            .select("*")
            .eq("product_id", id)
            .single();
          
          if (!taggedError && taggedData) {
            // Add tagged_products data to the main product data
            data.tagged_products = [taggedData];
          }
        }

        if (error) throw error;
        if (!data) throw new Error("Product not found");

        setProduct(data as Product);
        console.log("✅ Product details fetched successfully for:", id, "from products_v2 table");

        // Track product view
        trackEvent.viewProduct(String(id), data.title || data.name, "product");
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
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
          .eq("main_outfit_id", outfitId)
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
        console.log("🔍 Fetching outfits containing product:", id);

        // Find outfits where this product is either the top or bottom
        const { data: outfits, error } = await supabase
          .from("user_outfits")
          .select("*")
          .or(`top_id.eq.${id},bottom_id.eq.${id}`)
          .limit(5); // Limit to 5 outfits

        if (error) {
          console.error("❌ Error fetching style-with outfits:", error);
          return;
        }

        if (outfits && outfits.length > 0) {
          console.log(
            "✅ Found outfits containing this product:",
            outfits.length
          );

          // Get the other products from these outfits
          const otherProducts = outfits
            .map((outfit) => {
              // If current product is the top, return bottom info
              if (outfit.top_id === String(id)) {
                return {
                  id: outfit.bottom_id,
                  name: outfit.bottom_title,
                  image: outfit.bottom_image,
                  outfitId: outfit.main_outfit_id,
                  type: "bottom",
                };
              }
              // If current product is the bottom, return top info
              else if (outfit.bottom_id === String(id)) {
                return {
                  id: outfit.top_id,
                  name: outfit.top_title,
                  image: outfit.top_image,
                  outfitId: outfit.main_outfit_id,
                  type: "top",
                };
              }
              return null;
            })
            .filter(Boolean); // Remove null values

          // Remove duplicates based on product id
          const uniqueProducts = otherProducts.filter(
            (product, index, self) =>
              product &&
              index === self.findIndex((p) => p && p.id === product.id)
          );

          setStyleWithProducts(uniqueProducts);
          console.log("✅ Style-with products set:", uniqueProducts.length);

          // Fetch detailed product information for the complementary products
          if (uniqueProducts.length > 0) {
            const productIds = uniqueProducts.map((p) => p?.id).filter(Boolean);
            const { data: productsData, error: productsError } = await supabase
              .from("products")
              .select(
                `
                *,
                tagged_products (
                  customer_short_description,
                  customer_long_recommendation
                )
              `
              )
              .in("id", productIds);

            if (productsError) {
              console.error(
                "❌ Error fetching product details:",
                productsError
              );
            } else if (productsData) {
              console.log("✅ Product details fetched:", productsData.length);
              setStyleWithProductDetails(productsData as Product[]);
            }
          }
        } else {
          console.log("ℹ️ No outfits found containing this product");
          setStyleWithProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching style-with products:", err);
        setStyleWithProducts([]);
      }
    };

    const fetchSimilar = async (retryCount = 0, maxRetries = 3) => {
      // Prevent multiple simultaneous calls
      if (
        isFetchingSimilar ||
        (hasFetchedSimilar.current && currentProductId.current === String(id))
      ) {
        console.log(
          "⚠️ Similar products fetch already in progress or completed for product:",
          id,
          "skipping..."
        );
        return;
      }

      try {
        setIsFetchingSimilar(true);
        setSimilarProductsError(null);
        hasFetchedSimilar.current = true;
        console.log(
          "🔍 Fetching similar products for product:",
          id,
          "Retry:",
          retryCount
        );

        const data = await getSimilarProducts({
          productId: String(id),
          count: 10,
          diverse: true,
          personalized: false,
          forceRefresh: retryCount > 0, // Force refresh on retry
        });

        if (data.status === 202) {
          if (retryCount < maxRetries) {
            console.log(
              "⏳ Similar products still processing, retrying in 2 seconds..."
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setIsFetchingSimilar(false); // Reset before retry
            hasFetchedSimilar.current = false; // Allow retry
            return fetchSimilar(retryCount + 1, maxRetries);
          } else {
            console.log("⚠️ Max retries reached for similar products");
            return;
          }
        }

        if (data?.similar_products) {
          console.log(
            "✅ Similar products fetched successfully:",
            data.similar_products.length
          );
          console.log("📊 Raw similar products data:", data.similar_products);

          // Filter out products with null essential data
          const validProducts = data.similar_products.filter((item: any) => item.product_id && item.title && item.price);
          
          if (validProducts.length > 0) {
            // Get product IDs to fetch brand names from products table
            const productIds = validProducts.map((item: any) => item.product_id);
            
            // Fetch brand names from products table
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('id, name')
              .in('id', productIds);
            
            if (productsError) {
              console.error('Error fetching product brand names:', productsError);
            }
            
            // Create a map of product_id to brand name for quick lookup
            const brandMap = new Map();
            if (productsData) {
              productsData.forEach((product: any) => {
                brandMap.set(String(product.id), product.name);
              });
            }
            
            // Format products with brand names
            const formattedProducts = validProducts.map((item: any) => ({
              id: item.product_id,
              title: item.title,
              name: brandMap.get(String(item.product_id)) || '', // Brand name from products table
              brandname: brandMap.get(String(item.product_id)) || '', // Alias for brand name
              price: item.price,
              productImages: item.image_url || "/fallback.jpg",
            }));
            
            console.log("formatted similar products:", formattedProducts);
            console.log(
              "✅ Formatted products after filtering:",
              formattedProducts.length
            );
            setSimilarProducts(formattedProducts);
          }

          // If no valid products after filtering, show an appropriate message
          if (
            validProducts.length === 0 &&
            data.similar_products.length > 0
          ) {
            console.log(
              "⚠️ API returned similar products but all had null data"
            );
            setSimilarProductsError(
              "Similar products found but product details are not available."
            );
          }
        }
      } catch (err) {
        console.error("❌ Error fetching similar products:", err);
        setSimilarProductsError(
          "Failed to load similar products. Please try again later."
        );
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
        currentProductId.current = "";
      }
    };
  }, [id, outfitId]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };


  // Utility function for style-with products
  const getProductDescription = (productDetail: Product): string => {
    const taggedProductsArray = Array.isArray(productDetail.tagged_products)
      ? productDetail.tagged_products
      : productDetail.tagged_products
      ? [productDetail.tagged_products]
      : [];

    if (taggedProductsArray.length > 0) {
      return (
        taggedProductsArray[0].customer_short_description ||
        taggedProductsArray[0].customer_long_recommendation ||
        ""
      );
    }
    return "";
  };

  if (loading) {
    return <SmartLoader />;
  }

  if (error || !product) {
    return <div>Error: {error || "Product not found"}</div>;
  }

  // Handle sizes - filter out descriptive text and keep only actual size values
  const productSizes = (() => {
    if (!product) return [];

    const isValidSize = (size: string): boolean => {
      // Define valid size patterns
      const validSizes = /^(XXS|XS|S|M|L|XL|XXL|XXXL|\d+|FREE SIZE|ONE SIZE)$/i;
      // Check if it's a descriptive text (contains words like "model", "height", "wearing")
      const isDescriptive = /\b(model|height|wearing|size)\b/i.test(size);

      return validSizes.test(size.trim()) && !isDescriptive;
    };

    // Try both field names for compatibility
    const sizesData = product.sizes_available || product.sizesAvailable;
    console.log('🔍 Product sizes data:', {
      sizes_available: product.sizes_available,
      sizesAvailable: product.sizesAvailable,
      sizesData,
      type: typeof sizesData
    });

    if (!sizesData) {
      console.log('⚠️ No sizes data found for product');
      return [];
    }

    try {
      const parsedSizes = typeof sizesData === 'string' ? JSON.parse(sizesData) : sizesData;
      if (Array.isArray(parsedSizes)) {
        const filteredSizes = parsedSizes
          .map((size) => {
            // Extract only the size part (before "Rs." or any price info)
            const sizeOnly = size.split(" Rs.")[0].split(" ₹")[0].trim();
            return sizeOnly;
          })
          .filter((size) => size !== "" && isValidSize(size))
          // Remove duplicates
          .filter((size, index, self) => self.indexOf(size) === index);
        
        console.log('✅ Parsed and filtered sizes:', filteredSizes);
        return filteredSizes;
      }
      return [];
    } catch (error) {
      console.error('❌ Error parsing sizes:', error);
      // Fallback to comma-separated string
      return (
        typeof sizesData === 'string'
          ? sizesData
              .split(",")
              .map((s) => {
                // Extract only the size part for comma-separated format too
                const sizeOnly = s.split(" Rs.")[0].split(" ₹")[0].trim();
                return sizeOnly;
              })
              .filter((size) => size !== "" && isValidSize(size))
              // Remove duplicates
              .filter((size, index, self) => self.indexOf(size) === index)
          : []
      );
    }
  })();

  // Handle tagged_products - normalize to always be treated as an array for consistency
  const taggedProductsArray = Array.isArray(product.tagged_products)
    ? product.tagged_products
    : product.tagged_products
    ? [product.tagged_products]
    : [];

  // Get description from tagged_products or specifications
  let description = "";
  let specifications: Record<string, string> = {};

  if (taggedProductsArray.length > 0) {
    description =
      taggedProductsArray[0].customer_long_recommendation ||
      taggedProductsArray[0].customer_short_description ||
      "";
  } else if (product.specifications) {
    // Parse specifications when tagged_products is null
    try {
      specifications = JSON.parse(product.specifications);
    } catch (error) {
      console.error("Error parsing specifications:", error);
    }
  }

  //buy now product handler
  const handleBuyNow = () => {
   
    const finalLink = getAffiliate(product.url, (product as any).affiliatesource);
    if (!finalLink) {
      alert("No valid affiliate link available.");
      return;
    }
  
    window.open(finalLink, "_blank");
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
            <span className="text-sm font-medium text-gray-700 tracking-wide">PREMIUM PRODUCT</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight"
            whileHover={{ scale: 1.01 }}
          >
            {product.title || product.name || "Premium Product"}
          </motion.h1>
          
          <motion.div 
            className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Section */}
          <div className="relative w-full h-[500px]">
            {/* Main Image */}
            <div
              className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/60"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <RobustImage
                src={productImages[selectedImageIndex] || "/fallback.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                {/* Left Arrow */}
                <motion.button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 z-10"
                  aria-label="Previous image"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoChevronBack className="w-5 h-5 text-gray-800" />
                </motion.button>

                {/* Right Arrow */}
                <motion.button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 z-10"
                  aria-label="Next image"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoChevronForward className="w-5 h-5 text-gray-800" />
                </motion.button>
              </>
            )}

            {/* Image Toggle Dots */}
            {productImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                {productImages.map((_: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      selectedImageIndex === index ? "bg-gray-900 scale-110" : "bg-gray-400"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Brand name and title section */}
            <div className="flex flex-row items-center w-full">
              {product?.name && (
                <span className="text-lg text-gray-900 font-bold whitespace-nowrap">
                  {product.name}
                </span>
              )}
              {product?.title && (
                <span className="text-lg text-gray-500 font-semibold whitespace-nowrap">
                  -{product.title}
                </span>
              )}
            </div>

            {/*Price section*/}
            <div>
              <div className="flex mt-4 items-center gap-1">
                <FaIndianRupeeSign className="text-lg" />
                <h1 className="text-2xl text-gray-500 font-bold line-through">
                  {product?.mrp}
                </h1>
                <h1 className="text-2xl font-bold">{product?.price}</h1>
              </div>
              <div className="w-full p-2 mt-[12px]">
                <h6 className="text-left text-sm">SIZE</h6>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {productSizes.map((size: string, index: number) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-gray-900 text-white border-2 border-gray-900"
                          : "bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-900"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>


              {/* Buttons Section */}
              <div className="w-full">
                {/* Buttons Row */}
                <div className="flex items-center gap-4 mt-5">
                  <motion.button 
                    onClick={handleBuyNow} 
                    className="flex-[1] min-w-[100px] max-w-[160px] bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 rounded-xl text-white h-12 text-sm font-medium transition-all duration-300 tracking-wide"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    BUY NOW
                  </motion.button>
                  <AddToLookbookButton
                    itemId={String(product?.id)}
                    itemType="product"
                    className="flex-[2] min-w-[140px] max-w-[240px] h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="w-full mt-8">
          <h1
            className="font-[Boston] text-[14px] text-left font-black"
            style={{ fontVariant: "small-caps" }}
          >
            DESCRIPTION
          </h1>
        </div>

        <div className="w-full mt-2">
          {description ? (
            <p className="text-[12px] font-light font-[Boston] text-left tracking-wide">
              {description}
            </p>
          ) : Object.keys(specifications).length > 0 ? (
            <ul className="text-[12px] font-light font-[Boston] text-left tracking-wide space-y-1">
              {Object.entries(specifications).map(([key, value]) => (
                <li key={key} className="flex">
                  <span className="font-medium min-w-[80px]">{key}:</span>
                  <span className="ml-2">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px] font-light font-[Boston] text-left tracking-wide text-gray-500">
              No description available.
            </p>
          )}
        </div>

        {/* Enhanced Product Details from tagged_products */}
        {taggedProductsArray.length > 0 && (
          <div className="w-full mt-6">
            <h1
              className="font-[Boston] text-[14px] text-left font-black mb-4"
              style={{ fontVariant: "small-caps" }}
            >
              PRODUCT DETAILS
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Style & Fit */}
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">STYLE & FIT</h3>
                  <div className="space-y-1 text-xs text-gray-700">
                    {taggedProductsArray[0].fit_type && (
                      <div className="flex justify-between">
                        <span>Fit:</span>
                        <span className="font-medium">{taggedProductsArray[0].fit_type}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].primary_style && (
                      <div className="flex justify-between">
                        <span>Style:</span>
                        <span className="font-medium">{taggedProductsArray[0].primary_style}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].formality_level && (
                      <div className="flex justify-between">
                        <span>Formality:</span>
                        <span className="font-medium">{taggedProductsArray[0].formality_level}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].primary_occasion && (
                      <div className="flex justify-between">
                        <span>Best For:</span>
                        <span className="font-medium">{taggedProductsArray[0].primary_occasion}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fabric & Care */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">FABRIC & CARE</h3>
                  <div className="space-y-1 text-xs text-gray-700">
                    {taggedProductsArray[0].primary_fabric && (
                      <div className="flex justify-between">
                        <span>Fabric:</span>
                        <span className="font-medium">{taggedProductsArray[0].primary_fabric}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].fabric_texture && (
                      <div className="flex justify-between">
                        <span>Texture:</span>
                        <span className="font-medium">{taggedProductsArray[0].fabric_texture}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].fabric_weight && (
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">{taggedProductsArray[0].fabric_weight}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].care_complexity && (
                      <div className="flex justify-between">
                        <span>Care:</span>
                        <span className="font-medium">{taggedProductsArray[0].care_complexity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Color & Pattern */}
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">COLOR & PATTERN</h3>
                  <div className="space-y-1 text-xs text-gray-700">
                    {taggedProductsArray[0].primary_color && (
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span className="font-medium">{taggedProductsArray[0].primary_color}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].color_family && (
                      <div className="flex justify-between">
                        <span>Family:</span>
                        <span className="font-medium">{taggedProductsArray[0].color_family}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].pattern_type && (
                      <div className="flex justify-between">
                        <span>Pattern:</span>
                        <span className="font-medium">{taggedProductsArray[0].pattern_type}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].seasonal_appropriateness && (
                      <div className="flex justify-between">
                        <span>Season:</span>
                        <span className="font-medium">{taggedProductsArray[0].seasonal_appropriateness}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quality & Versatility */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">QUALITY & VERSATILITY</h3>
                  <div className="space-y-1 text-xs text-gray-700">
                    {taggedProductsArray[0].versatility_score && (
                      <div className="flex justify-between">
                        <span>Versatility:</span>
                        <span className="font-medium">{Math.round(taggedProductsArray[0].versatility_score * 10)}/10</span>
                      </div>
                    )}
                    {taggedProductsArray[0].longevity_score && (
                      <div className="flex justify-between">
                        <span>Longevity:</span>
                        <span className="font-medium">{Math.round(taggedProductsArray[0].longevity_score * 10)}/10</span>
                      </div>
                    )}
                    {taggedProductsArray[0].durability_level && (
                      <div className="flex justify-between">
                        <span>Durability:</span>
                        <span className="font-medium">{taggedProductsArray[0].durability_level}</span>
                      </div>
                    )}
                    {taggedProductsArray[0].investment_value && (
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span className="font-medium">{taggedProductsArray[0].investment_value}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*star rating section */}
        <div className="w-full mt-4 flex flex-col">
          <h1
            className="font-[Boston] font-black text-[12px] text-left"
            style={{ fontVariant: "small-caps" }}
          >
            RATING
          </h1>
          <StarRating productId={id as string} />
        </div>
      </div>

      {/*button feedback section */}
      <div className="flex sm:px-30 px-31 mt-6">
        <FeedbackButton productId={parseInt(id as string, 10)} />
      </div>

      {/* Horizontal Line - Only show if there's style content to follow */}
      {((styleWithProducts.length > 0 && styleWithProductDetails.length > 0) ||
        outfit) && (
        <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          <hr className="w-full border border-black mt-[30px]" />
        </div>
      )}

      {/* Style It With Section - General */}
      {styleWithProducts.length > 0 && styleWithProductDetails.length > 0 && (
        <div className="text-center mt-8 w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          <h1
            className="font-medium"
            style={{ fontSize: "20px", fontWeight: 500 }}
          >
            STYLE IT WITH
          </h1>

          <div className="space-y-6 mt-6">
            {styleWithProducts.slice(0, 3).map((styleProduct, index) => {
              const productDetail = styleWithProductDetails.find(
                (p) => String(p.id) === String(styleProduct.id)
              );

              if (!productDetail) {
                return null;
              }

              const description = getProductDescription(productDetail);

              return (
                <div key={`${styleProduct.id}-${index}`} className="pb-6">
                  <div className="flex w-full gap-4">
                    {/* Product Image */}
                    <div className="relative w-[200px] h-[240px] flex-shrink-0">
                      <RobustImage
                        src={styleProduct.image || "/fallback.jpg"}
                        alt={styleProduct.name}
                        fill
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between h-[240px]">
                      <div>
                        <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-left">
                          {productDetail.name}
                        </h2>
                        {description ? (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-3 text-left">
                            {description}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 mb-2 italic text-left">
                            No description available.
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaIndianRupeeSign className="text-base text-black" />
                        <span className="text-base font-bold text-black text-left">
                          {productDetail.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Moved to next line */}
                  <div className="flex gap-3 mt-6 px-2">
                    <Link
                      href={`/products/${styleProduct.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full h-9 bg-white text-[#007e90] border border-[#007e90] text-xs rounded hover:bg-[#e6f7fa] transition-colors">
                        VIEW PRODUCT
                      </Button>
                    </Link>
                    <Link
                      href={`/looks/${styleProduct.outfitId}`}
                      className="flex-1"
                    >
                      <motion.button 
                        className="w-full h-9 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white text-xs rounded-lg font-medium transition-all duration-300 tracking-wide"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        VIEW OUTFIT
                      </motion.button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Horizontal Line between the two Style It With sections */}
      {styleWithProducts.length > 0 &&
        styleWithProductDetails.length > 0 &&
        outfit && (
          <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
            <hr className="w-full border border-black mt-[30px]" />
          </div>
        )}

      {/*Style with it - from outfit page*/}
      {outfit && (
        <div className="text-center mt-8 w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          <h1
            className="font-medium"
            style={{ fontSize: "20px", fontWeight: 500 }}
          >
            STYLE IT WITH
          </h1>
          <div className="flex justify-center mt-6">
            <div className="relative group cursor-pointer w-full max-w-[300px]">
              {/* Image Container */}
              <div className="relative w-full h-[400px]">
                <RobustImage
                  src={
                    id === outfit?.top_id
                      ? outfit?.bottom_image
                      : outfit?.top_image
                  }
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
              <motion.button 
                className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 text-sm font-medium transition-all duration-300 rounded-lg tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                VIEW MORE
              </motion.button>
            </Link>
          </div>
        </div>
      )}

      {/* Similar products section hidden */}
       </motion.div>
     </div>
   );
 }
