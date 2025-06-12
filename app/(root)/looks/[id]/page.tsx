"use client"
import StylistSays from '@/app/components/recommendations/stylistSays';
import TexturePrint from '@/app/components/product-page/texturePrint';
import UrbanShift from '@/app/components/looks-page/urbanShift';
import { useParams, notFound } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCartArrowDown } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import MyCarousel from '@/app/components/looks-page/mycrausal';
import { addToCart } from '@/lib/utils/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFetchLookProducts } from '@/lib/hooks/useFetchLookProducts';
import PageLoader from '@/app/components/common/PageLoader';

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
}

interface Look {
  lookNumber: number;
  lookName: string;
  lookDescription: string;
  productids: number[];
  products: Product[];
  totalPrice: number;
}

interface LoadingState {
  [key: string]: boolean;
}

const LookPage = () => {
  const { id } = useParams();
  const { getSession } = useAuth();
  const [look, setLook] = useState<Look | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLook = async () => {
      try {
        const lookData = await useFetchLookProducts(Number(id));
        const data = Array.isArray(lookData) ? lookData[0] : lookData;
        if (!data) throw new Error('Look not found');

        // Calculate total price from products
        const totalPrice = data.products.reduce((sum, product) => sum + product.price, 0);

        setLook({
          ...data,
          totalPrice
        });
      } catch (err) {
        notFound();
      }
    };
    if (id) fetchLook();
  }, [id]);

  if (!look) return <PageLoader loadingText="Loading look details..." />;

  const parseImages = (imgs: string): string[] => {
    try {
      const arr = JSON.parse(imgs);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const handleAddProduct = async (idx: number) => {
    const size = selectedSizes[idx];
    if (!size) { setError('Please select a size'); return; }
    setLoading(prev => ({ ...prev, [idx]: true }));
    setError(null);
    const { session } = await getSession();
    if (!session) { setError('Sign in first'); setLoading(prev => ({ ...prev, [idx]: false })); return; }
    const prod = look.products[idx];
    const { success, error: e } = await addToCart(session.user.id, prod.id, size);
    if (!success) setError(e || 'Failed to add');
    setLoading(prev => ({ ...prev, [idx]: false }));
  };

  const handleAddAll = async () => {
    const allSelected = look.products.every((_, i) => selectedSizes[i]);
    if (!allSelected) { setError('Select all sizes'); return; }
    setLoading(prev => ({ ...prev, all: true }));
    setError(null);
    const { session } = await getSession();
    if (!session) { setError('Sign in first'); setLoading(prev => ({ ...prev, all: false })); return; }
    const results = await Promise.all(
      look.products.map((p, i) => addToCart(session.user.id, p.id, selectedSizes[i]))
    );
    if (!results.every(r => r.success)) setError('Some items failed');
    setLoading(prev => ({ ...prev, all: false }));
  };

  const parseSizes = (sizesStr: string): string[] => {
    try {
      // First try to parse as JSON
      const parsedSizes = JSON.parse(sizesStr);
      return Array.isArray(parsedSizes) ? parsedSizes : [];
    } catch {
      // If not JSON, split by comma and clean up
      return sizesStr
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-[26px] font-thin">{look.lookName.toUpperCase()}</span>
        <hr className="border-black border-1 w-[30px] mx-3" />
        <span className="text-[26px] font-thin">LOOK {look.lookNumber}</span>
      </div>
      <hr className="border-t-1 border-black w-[90%] mx-auto" />

      {/* Products */}
      {look.products.map((product, idx) => {
        const imgs = parseImages(product.productImages);
        const firstImg = imgs[0] || '/fallback.jpg';
        const sizes = parseSizes(product.sizesAvailable);
        
        return (
          <div key={product.id} className={`flex w-full mt-8 mb-2 gap-2 ${idx % 2 ? 'flex-row-reverse' : ''}`}>            
            <div className="relative w-[221px] h-[260.5px] overflow-hidden">
              <Image src={firstImg} alt={product.name} fill className="object-cover" />
            </div>
            <div className="relative flex flex-col flex-1 max-w-[400px] h-[260.5px] pl-2 pr-2">
              <h1 className="text-lg text-center font-thin mb-1 mt-0 text-[14px]">{product.name}</h1>
              <p className="font-[Boston] text-[12px] font-medium leading-normal mb-1 pr-4 mx-2">
                {product.specifications}
              </p>
              <h4 className="flex text-black font-[Boston] text-[20px] font-semibold [font-variant:all-small-caps] mb-2">
                <FaIndianRupeeSign className="h-4 mt-2" /> {product.price}
              </h4>
              <div className="flex gap-5 mb-2">
                <span className="text-black font-[Boston] text-[14px] font-light [font-variant:all-small-caps]">SIZE</span>
                <ul className="flex gap-2">
                  {sizes.map(sz => (
                    <li key={sz} onClick={() => setSelectedSizes(prev => ({ ...prev, [idx]: sz }))}
                      className={`cursor-pointer text-black font-[Boston] text-[14px] font-light [font-variant:all-small-caps] hover:font-bold transition-all ${selectedSizes[idx]===sz?'font-bold':''}`}
                    >{sz}</li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-0 left-2 right-2 flex gap-2">
                <button onClick={() => handleAddProduct(idx)} disabled={loading[idx]}
                  className="flex items-center h-8 w-12 justify-center bg-black text-white rounded-none disabled:bg-gray-400 hover:bg-gray-800 transition-colors">
                  <FaCartArrowDown className="w-4" />
                </button>
                <Link href={`/products/${product.id}`} className="flex-1">
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
          <FaIndianRupeeSign className="h-5 mt-2" /> {look.totalPrice}
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
        <h1 className="text-lg text-black font-thin mb-6 font-[Boston]">DESCRIPTION</h1>
        <div className="text-[14px] font-light leading-6 font-[Boston] space-y-6">
          <p>{look.lookDescription}</p>
        </div>
        <hr className="border-t-1 border-black w-full mt-12" />
      </div>

      {/* Carousel */}
      <div className="px-6 py-8">
        <h1 className="font-thin text-[20px] font-[Boston] mb-6">YOU MAY ALSO LIKE</h1>
        <MyCarousel />
      </div>
    </>
  );
};

export default LookPage;
