"use client"
import { useParams, notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCartArrowDown } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import MyCarousel from '@/app/components/looks-page/mycrausal';
import { addToCart } from '@/lib/utils/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import PageLoader from '@/app/components/common/PageLoader';
import StarRating from '@/app/components/starRating';
import Looksfeeback from '@/app/components/looks-feeback';
import { fetchUserOutfits, getSimilarOutfits } from '@/app/utils/outfitsapi';
import { supabase } from '@/lib/supabase';
import { Outfit } from '@/lib/interface/outfit';




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
  }[];
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
interface StyleSummary {
  styleVibe: string;
  occasion: string;
  skinTone: string;
  bodyShape: string;
}

const LookPage = () => {
  const { id } = useParams();
  const { getSession } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lookName, setLookName] = useState('');
  const [matchedOutfit, setMatchedOutfit] = useState<Outfit | null>(null);
  const [productInfo, setProductInfo] = useState<{
    topId: number;
    topImage: string;   
    bottomId: number;
    bottomImage: string;
  } | null>(null);
  const [similarOutfits, setSimilarOutfits] = useState<any[]>([]);
  const [uId, suId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserid = async () => {
      try {
        const { session } = await getSession();
        if (!session?.user?.id) {
          throw new Error("No session found");
        }

        // Fetch user ID from users_updated table
        const { data: userData, error: userError } = await supabase
          .from('users_updated')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (userError) throw userError;
        if (!userData?.id) throw new Error("User not found");

        suId(userData.id);
      } catch (err) {
        console.error('Error fetching user ID:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch user ID");
      }
    };
    fetchUserid();
  }, [getSession]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (!uId) {
          throw new Error('User ID not available');
        }

        const userOutfits = await fetchUserOutfits({ userId: uId, limit: 5 });
        const foundOutfit = userOutfits?.outfits.find((o: Outfit) => o.main_outfit_id === id);
        
        if (!foundOutfit) {
          throw new Error('Outfit not found');
        }

        setMatchedOutfit(foundOutfit);
        console.log("Matched outfit", foundOutfit);

        setProductInfo({
          topId: foundOutfit.top.id,
          topImage: foundOutfit.top.image,
          bottomId: foundOutfit.bottom.id,
          bottomImage: foundOutfit.bottom.image,
        });

        const productIds = [foundOutfit.top.id, foundOutfit.bottom.id];

        // Fetch products from Supabase
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

        setProducts(productsData);
        setTotalPrice(productsData.reduce((sum, product) => sum + product.price, 0));
        setLookName(`${foundOutfit.top.style} ${foundOutfit.bottom.style}`);

      } catch (err) {
        console.error('Error fetching data:', err);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    if (id && uId) fetchData();

    const fetchSimilar = async () => {
      try {
        const result = await getSimilarOutfits(String(id), 10);
        setSimilarOutfits(result?.similar_outfits || []);
      } catch (err) {
        console.error('Error fetching similar outfits:', err);
      }
    };

    if (id) fetchSimilar();
  }, [id, uId]);

  if (isLoading) return <PageLoader loadingText="Loading look details..." />;

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
      return '/fallback.jpg'; // Make sure you have a fallback image in your public folder
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
 

  

  const parts = matchedOutfit?.why_picked_explanation?.split(' | ') || [];

  const raw = {
    styleVibe: parts.find(p => p.startsWith('Style Vibe:'))?.replace('Style Vibe:', '').trim() || '',
    occasion: parts.find(p => p.startsWith('Occasions:'))?.replace('Occasions:', '').trim() || '',
    skinTone: parts.find(p => p.startsWith('Skin Tone:'))?.replace('Skin Tone:', '').trim() || '',
    bodyShape: parts.find(p => p.startsWith('Body Shape:'))?.replace('Body Shape:', '').trim() || '',
  };
  
  const parsed = {
    styleVibeLabel: raw.styleVibe.split(' - ')[0]?.trim(),
    styleVibe: raw.styleVibe.split(' - ')[1]?.trim(),
  
    occasionLabel: raw.occasion.split(' - ')[0]?.trim(),
    occasion: raw.occasion.split(' - ')[1]?.trim(),
  
    skinToneLabel: raw.skinTone.split(' - ')[0]?.trim(),
    skinTone: raw.skinTone.split(' - ')[1]?.trim(),
  
    bodyShapeLabel: raw.bodyShape.split(' - ')[0]?.trim(),
    bodyShape: raw.bodyShape.split(' - ')[1]?.trim(),
  };
  

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-center mb-2">
      
       
        <span className="text-[26px] font-thin">{matchedOutfit?.outfit_name}</span>
      </div>
      <hr className="border-t-1 border-black w-[90%] mx-auto" />

      {/* Products */}
      {products.map((product, index) => {
        const sizes = parseSizes(product.sizesAvailable);
        const imageUrl = product.id === Number(productInfo?.topId) 
          ? productInfo?.topImage 
          : productInfo?.bottomImage;
        const validImageUrl = getValidImageUrl(imageUrl);
        const taggedProduct = product.tagged_products;
        const keyAttributes = taggedProduct?.product_key_attributes 
          ? parseKeyAttributes(taggedProduct.product_key_attributes)
          : {};
        
        return (
          <div key={product.id} className={`flex w-full mt-8 mb-2 gap-2 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>            
            <div className="relative w-[221px] h-[260.5px] overflow-hidden">
              <Image 
                src={validImageUrl}
                alt={product.name || 'Product Image'} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="relative flex flex-col flex-1 max-w-[400px] h-[280.5px] pl-2 pr-2">
              <h1 className="text-lg text-center font-thin mb-1 mt-0 text-[14px]">{product.name}</h1>
              
              <div className="font-[Boston] text-[12px] font-medium leading-normal mb-1 pr-4 mx-2  tracking-wide text-gray-600">
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
                {/* Display any additional attributes that might be present */}
                {Object.entries(keyAttributes)
                  .filter(([key]) => !['color', 'fit', 'fabric', 'occasion'].includes(key))
                  .map(([key, value]) => (
                    <p key={key} className="mb-0.5">
                      {key.charAt(0).toUpperCase() + key.slice(1)} - {value}
                    </p>
                  ))}
              </div>

              <div className="absolute bottom-8 left-2 right-2">
                <h4 className="flex text-black font-[Boston] text-[20px] font-semibold [font-variant:all-small-caps] mb-1">
                  <FaIndianRupeeSign className="h-4 mt-2" /> {product.price}
                </h4>
                <div className="flex flex-col gap-2 mb-2">
                  <span className="text-black font-[Boston] text-[12px] [font-variant:all-small-caps]">SIZE</span>
                  <ul className="grid grid-cols-4 gap-2 max-w-[160px]">
                    {sizes.map(sz => (
                      <li 
                        key={sz} 
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: sz }))}
                        className={`cursor-pointer w-[30px] h-[30px] flex items-center justify-center border-[1px] ${
                          selectedSizes[product.id] === sz 
                            ? 'border-black text-black' 
                            : 'border-gray-300 hover:border-gray-600'
                        } text-black font-[Boston] text-[14px] transition-all`}
                      >
                        {sz}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="absolute bottom-0 left-2 right-2 flex gap-2">
                <button onClick={() => handleAddProduct(product.id)} disabled={loading[product.id]}
                  className="flex items-center h-8 w-12 justify-center bg-black text-white rounded-none disabled:bg-gray-400 hover:bg-gray-800 transition-colors">
                  <FaCartArrowDown className="w-4" />
                </button>
                <Link 
                  href={{
                    pathname: `/products/${product.id}`,
                    query: matchedOutfit?.main_outfit_id ? { outfitId: matchedOutfit.main_outfit_id } : undefined
                  }} 
                  className="flex-1"
                >
                  <button className="w-full bg-black h-8 text-white text-sm rounded-none hover:bg-gray-800 transition-colors">View Product</button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Total & Actions */}
      <div className="mt-12 px-6">
        <h1 className="flex font-thin text-2xl mb-4">
          <FaIndianRupeeSign className="h-5 mt-1.5" /> {totalPrice}
        </h1>
        <div className="flex gap-4">
          <button className="flex items-center h-10 px-6 justify-center bg-black text-white text-sm rounded-none hover:bg-gray-800 transition-colors">
            Buy Now
          </button>
          <button onClick={handleAddAll} disabled={loading.all}
            className="flex-1 bg-black h-10 text-white text-sm rounded-none disabled:bg-gray-400 hover:bg-gray-800 transition-colors">
            {loading.all ? 'Adding...' : 'Add To Cart'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <hr className="border-t-1 border-black w-[92%] mx-auto my-12" />

      {/* Description */}
      <div className="px-6 py-8">
        <h1 className="text-[14px] text-black font-bold mb-6 font-[Boston] tracking-wide " style={{ fontVariant: 'small-caps' }}>DESCRIPTION</h1>
        <div className="text-[14px] font-light leading-6 font-[Boston] space-y-2">
          <p className='text-[12px] tracking-wide'>{matchedOutfit?.outfit_description}</p>
          <p className='text-[14px] text-black font-bold mb-4 font-[Boston] tracking-wide' style={{ fontVariant: 'small-caps' }}>WHY THIS LOOK WAS PICKED FOR YOU</p>
          
          <div className="space-y-3">
            <div className="space-y-0.1">
              <p className='text-[12px] tracking-wide font-semibold'>Style Vibe: {parsed.styleVibeLabel}</p>
              <p className='text-[12px] tracking-wide'>{parsed.styleVibe}</p>
            </div>
            
            <div className="space-y-0.1">
              <p className='text-[12px] tracking-wide font-semibold'>Skin Tone: {parsed.skinToneLabel}</p>
              <p className='text-[12px] tracking-wide'>{parsed.skinTone}</p>
            </div>
            
            <div className="space-y-0.1">
              <p className='text-[12px] tracking-wide font-semibold'>Body Type: {parsed.bodyShapeLabel}</p>
              <p className='text-[12px] tracking-wide'>{parsed.bodyShape}</p>
            </div>
            <div className="space-y-0.1">
              <p className='text-[12px] tracking-wide font-semibold'>Occasion: {parsed.occasionLabel}</p>
              <p className='text-[12px] tracking-wide'>{parsed.occasion}</p>
            </div>
          </div>

          <p className='font-semibold'>Rating</p>
          <StarRating productId={String(products[0]?.id)} />
          <div className='mt-6 flex items-centre justify-centre px-[8rem]'>
           <Looksfeeback 
             onClose={() => { }} 
             userId={''}
             lookId={Number(id)}
           />
          </div>
        </div>
        
        <hr className="border-t-1 border-black w-full mt-12" />
      </div>

      {/* Carousel */}
      <div className="px-6 py-8 mt-[-2rem]">
        <h1 className="font-thin text-[22px] font-[Boston] mb-[-2rem]">YOU MAY ALSO LIKE</h1>
        <MyCarousel similarOutfits={similarOutfits} />
      </div>
    </>
  );
};

export default LookPage;
