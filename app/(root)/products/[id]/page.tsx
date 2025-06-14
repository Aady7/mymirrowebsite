"use client"

import LooksSection from "@/app/components/product-page/looksSection";
import { looksData } from "@/app/utils/lookData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useFetchLookProducts } from "@/lib/hooks/useFetchLookProducts";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useFetchSimilarProducts } from "@/lib/hooks/useFetchSimilarProducts";
import Link from "next/link";

import PageLoader from "@/app/components/common/PageLoader";

import StarRating from "@/app/components/starRating";

import { useAuth } from "@/lib/hooks/useAuth";
import FeedbackButton from "@/app/components/feedbackButton";
import LookSection from "@/app/components/looksTwo";


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
  images?: {
    background: string;
    foreground: string;
  };
  sizes?: string[];
}

interface LookProduct {
  id: number;
  brandName: string;
  description: string;
  price: number;
  sizes: string[];
  images: {
    background: string;
    foreground: string;
  };
  rating: number;
}

// Type guard to check if product is from looks data
function isLookProduct(product: Product | LookProduct): product is LookProduct {
  return 'images' in product && !('productImages' in product);
}

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | LookProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // First, try to find the product in looks data
        let foundProduct: Product | LookProduct | null = null;

        // Search in looksData
        for (const [lookId, look] of Object.entries(looksData)) {
          const lookProduct = look.products.find(p => p.id.toString() === id);
          if (lookProduct) {
            foundProduct = lookProduct as LookProduct;
            break;
          }
        }

        // If not found in looks, fetch from products table
        if (!foundProduct) {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          if (data) foundProduct = data as Product;
        }

        if (!foundProduct) {
          throw new Error("Product not found");
        }

        setProduct(foundProduct);

        // Fetch similar products
        if (!isLookProduct(foundProduct)) {
          const similar = await useFetchSimilarProducts(foundProduct.id);
          setSimilarProducts(similar);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <PageLoader loadingText="Loading product details..." />;
  }

  if (error || !product) {
    return <div>Error: {error || "Product not found"}</div>;
  }

  // Parse product images
  const productImages = (() => {
    if (!product) return [];
    try {
      if (isLookProduct(product)) {
        return [product.images.foreground, product.images.background].filter(Boolean);
      }
      return JSON.parse(product.productImages);
    } catch {
      return [];
    }
  })();

  // Handle sizes
  const productSizes = (() => {
    if (!product) return [];
    if (isLookProduct(product)) {
      return product.sizes;
    }
    try {
      // First try to parse as JSON
      const parsedSizes = JSON.parse(product.sizesAvailable);
      return Array.isArray(parsedSizes) ? parsedSizes : [];
    } catch {
      // If not JSON, split by comma and clean up
      return product.sizesAvailable
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
    }
  })();

  return (
    <div className="w-full px-[24px] py-1 max-w-md mx-auto font-['Boston']">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="font-thin" style={{ fontSize: "25px", fontWeight: 300 }}>
          {isLookProduct(product) ? product.brandName : (product?.title || '')}
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
            alt={isLookProduct(product) ? product.brandName : (product?.name || '')}
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
                className={`w-2 h-2 rounded-full ${selectedImageIndex === index ? "bg-black" : "bg-gray-300"
                  }`}
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
          <h6 className="text-left font-thin text-sm">SIZE</h6>
          <div className="flex gap-4 mt-2">
            {productSizes.map((size: string, index: number) => (
              <Button
                key={index}
                className="text-xs rounded-none text-black bg-amber-50 border-3"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        {/* Buttons Section */}
        <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          {/* Buttons Row */}
          <div className="flex items-center gap-4 mt-5">
            <Button className="flex-[1] min-w-[100px] max-w-[160px] bg-black rounded-none text-white h-10 text-xs">
              BUY NOW
            </Button>
            <Button className="flex-[2] min-w-[140px] max-w-[240px] bg-black rounded-none text-white h-10 text-xs">
              ADD TO CART
            </Button>
          </div>

          {/* Divider */}
          <hr className="w-full border border-black mt-[30px]" />
        </div>
      </div>

      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="w-full mt-8">
          <h1 className="font-[Boston] font-thin text-[12px] text-left">
            DESCRIPTION
          </h1>
        </div>

        <div className="w-full mt-2">
          <p className="text-xs font-thin font-[Boston] text-left leading-tight">
            {isLookProduct(product) ? product.description : (product?.specifications || '')}
          </p>
        </div>
 
        {/*star rating section */}
        <div className="w-full mt-4 flex flex-col">
          <h1 className="font-[Boston] font-thin text-[12px] text-left">Rating</h1>
          <StarRating userId={user?.id} lookId={parseInt(id as string, 10)} />
        </div>

      </div>
       
       {/*button feedback section */}
      <div className="flex sm:px-30 px-31 mt-6">
        <FeedbackButton/>
      </div>
      {/* Horizontal Line */}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <hr className="w-full border border-black mt-[30px]" />
      </div>

      {/*Style with it*/}
      <div className="text-center mt-8 w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <h1 className="font-thin" style={{ fontSize: "20px", fontWeight: 100 }}>
          STYLE IT WITH
        </h1>
       
      </div>

      {/*looksSection*/}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <LooksSection currentProductId={parseInt(id as string, 10)} />
      </div>

      {/* Horizontal Line */}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <hr className="w-full border border-black mt-[30px]" />
      </div>

      {/*you may also like section]*/}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="text-center mt-8 mb-2">
          <h1 className="font-thin" style={{ fontSize: "20px", fontWeight: 100 }}>
            YOU MAY ALSO LIKE
          </h1>
        </div>

        {/*similar products grid*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 mb-[30px] max-h-[600px] overflow-y-auto p-2">
          {similarProducts.map((similarProduct) => {
            const images = (() => {
              try {
                return JSON.parse(similarProduct.productImages);
              } catch {
                return [];
              }
            })();

            return (
              <div key={similarProduct.id} className="flex flex-col items-center">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={images[0] || "/fallback.jpg"}
                    alt={similarProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-left mt-2 line-clamp-2 h-8">{similarProduct.name}</p>
                <p className="text-xs mt-2 font-thin">₹ {similarProduct.price}</p>
                <Link href={`/products/${similarProduct.id}`} className="w-full mt-2">
                  <Button className="w-full h-7 bg-black text-white text-xs py-[10px] rounded-none hover:bg-gray-800">
                    VIEW MORE
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}