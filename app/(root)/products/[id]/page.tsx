"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PageLoader from "@/app/components/common/PageLoader";
import StarRating from "@/app/components/starRating";
import { useAuth } from "@/lib/hooks/useAuth";
import FeedbackButton from "@/app/components/feedbackButton";
import LookSection from "@/app/components/looksTwo";
import { getSimilarProducts } from "@/app/utils/productsapi";
import { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { Outfit } from "@/lib/interface/outfit";

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
    customer_short_description: string;
    customer_long_recommendation: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const[outfit, setOutfit]=useState<any| null>(null);
 
  // Separate useEffect for session check
  useEffect(() => {
   
    const checkSession = async () => {
      const { session } = await getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    checkSession();
  }, []); // Only run once on mount

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    const fetchOutfit=async()=>{
      try{
        const{data, error}=await supabase
        .from("user_outfits")
        .select("*")
        .eq('main_outfit_id',outfitId)
        .single();
        if(error)throw error;
        if(!data) throw new Error("No data found");
        setOutfit(data );
        console.log("outfitdata",data);

        
      }
      catch(err){
        setError(err instanceof Error ? err.message : "Failed to fetch oufit");
      }
    }

    const fetchSimilar = async () => {
      try {
        const data = await getSimilarProducts({
          productId: String(id),
          count: 10,
          diverse: true,
          personalized: false,
        });
        
        // If status is 202, the request is still processing
        if (data.status === 202) {
          // Wait for 2 seconds and try again
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchSimilar();
        }
        
        if (data?.similar_products) {
          console.log(data);

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
      }
    };

    // Only fetch product initially
    fetchProduct().finally(() => setLoading(false));
    
    // Fetch similar products separately to not block the main product display
    fetchSimilar();
    fetchOutfit();

  }, [id]); // Only depend on id

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
      return JSON.parse(product.productImages);
    } catch {
      return [];
    }
  })();

  // Handle sizes
  const productSizes = (() => {
    if (!product) return [];
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
          <div className="flex gap-3 mt-2 flex-wrap">
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
          <h1 className="font-[Boston]  text-[14px] text-left font-black " style={{fontVariant:'small-caps'}}>
            DESCRIPTION
          </h1>
        </div>

        <div className="w-full mt-2">
          <p className="text-[12px] font-light font-[Boston] text-left tracking-wide ">
            {product.tagged_products.customer_long_recommendation}
          </p>
        </div>
 
        {/*star rating section */}
        <div className="w-full mt-4 flex flex-col">
          <h1 className="font-[Boston] font-black text-[12px] text-left"style={{fontVariant:'small-caps'}}>RATING</h1>
          <StarRating productId={id as string} />
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
        <div className="flex justify-center mt-6">
          <div className="relative group cursor-pointer w-full max-w-[300px]">
            {/* Image Container */}
            <div className="relative w-full h-[400px]">
              <Image
                src={id=== outfit?.top_id ? outfit?.bottom_image : outfit?.top_image}

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
       
          <Link href={{
                    pathname: `/looks/${outfit.main_outfit_id}`,
                   
                  }} 
                  
                >
            <button className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
              View More
            </button>
          </Link>
        </div>
      </div>
      {/* Horizontal Line */}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <hr className="w-full border border-black mt-[30px]" />
      </div>


      {/*you may also like section*/}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="text-center mt-8 mb-2">
          <h1 className="font-thin" style={{ fontSize: "20px", fontWeight: 100 }}>
            YOU MAY ALSO LIKE
          </h1>
        </div>

        {/*similar products grid*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 mb-[30px] max-h-[600px] overflow-y-auto p-2">
          {similarProducts.map((similarProduct) => {
            return (
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