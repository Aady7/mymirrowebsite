"use client"
import StylistSays from '@/app/components/recommendations/stylistSays';
import TexturePrint from '@/app/components/product-page/texturePrint';
import UrbanShift from '@/app/components/looks-page/urbanShift';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FaCartArrowDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import MyCarousel from "@/app/components/looks-page/mycrausal";
import { looksData } from "@/app/utils/lookData";
import { notFound } from "next/navigation";
import { addToCart } from '@/lib/utils/cart';
import { useAuth } from '@/lib/hooks/useAuth';

interface LoadingState {
  [key: number]: boolean;
  all?: boolean;
}

const LookPage = () => {
  const { id } = useParams();
  const lookData = looksData[id as keyof typeof looksData];
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({});
  const { getSession } = useAuth();

  if (!lookData) {
    notFound();
  }

  const handleAddProductToCart = async (productIndex: number) => {
    const selectedSize = selectedSizes[productIndex];
    if (!selectedSize) {
      setError('Please select a size first');
      return;
    }

    setLoading(prev => ({ ...prev, [productIndex]: true }));
    setError(null);

    try {
      const { session } = await getSession();
      if (!session) {
        setError('Please sign in to add items to cart');
        return;
      }

      const product = lookData.products[productIndex];
      const { success, error } = await addToCart(
        session.user.id,
        product.id,
        selectedSize
      );

      if (success) {
        alert('Product added to cart successfully!');
      } else {
        setError(error || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [productIndex]: false }));
    }
  };

  const handleAddLookToCart = async () => {
    // Check if sizes are selected for all products
    const allSizesSelected = lookData.products.every((_, index) => selectedSizes[index]);
    if (!allSizesSelected) {
      setError('Please select sizes for all products');
      return;
    }

    setLoading(prev => ({ ...prev, all: true }));
    setError(null);

    try {
      const { session } = await getSession();
      if (!session) {
        setError('Please sign in to add items to cart');
        return;
      }

      // Add all products to cart
      const results = await Promise.all(
        lookData.products.map((product, index) =>
          addToCart(
            session.user.id,
            product.id,
            selectedSizes[index]
          )
        )
      );

      const allSuccess = results.every(result => result.success);
      if (allSuccess) {
        alert('All products from the look added to cart successfully!');
      } else {
        setError('Failed to add some products to cart');
      }
    } catch (error) {
      console.error('Error adding look to cart:', error);
      setError('Failed to add look to cart. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-center mb-2">
          <span className="text-[26px] font-thin">{lookData.title}</span>
          <hr className="border-black border-1 w-[30px] mx-3" />
          <span className="text-[26px] font-thin">LOOK {lookData.lookNumber}</span>
        </div>

        <hr className="border-t-1 border-black w-[90%] mx-auto" />
      </div>

      <div>
        {lookData.products.map((product, index) => (
          <div key={index} className={`flex flex-row lg:flex-row w-full mt-8 gap-2 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
            <div className="relative w-[80%] h-[230px] lg:w-[70%] overflow-hidden">
              <Image
                src={product.images.background}
                alt="Background"
                fill
                className="object-cover absolute z-0"
              />
              <Image
                src={product.images.foreground}
                alt="Product"
                fill
                className="object-contain z-10"
              />
            </div>

            <div className="flex flex-col h-[200px] w-[60%] lg:w-[20%]">
              <div>
                <h1 className="text-lg flex tracking-normal items-center justify-center font-thin mb-2">
                  {product.brandName}
                </h1>
                <p className="w-2/3 mx-8 font-[Boston] text-[12px] not-italic font-light leading-normal mb-4">
                  {product.description}
                </p>
                <h4 className="flex text-black px-8 font-[Boston] text-[20px] not-italic font-semibold leading-normal [font-variant:all-small-caps]">
                  <FaIndianRupeeSign className="h-4 mt-2" /> {product.price}
                </h4>
                <div className="flex flex-row gap-6 px-8">
                  <h4 className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    SIZE
                  </h4>
                  <ul className="flex flex-row gap-4">
                    {product.sizes.map((size, idx) => (
                      <li
                        key={idx}
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [index]: size }))}
                        className={`text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps] cursor-pointer
                          ${selectedSizes[index] === size ? 'font-bold' : ''}`}
                      >
                        {size}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-row gap-1 mt-4 mx-3">
                <button
                  onClick={() => handleAddProductToCart(index)}
                  disabled={loading[index]}
                  className="flex items-center h-6 w-10 justify-center gap-2 bg-black text-white rounded-none disabled:bg-gray-400"
                >
                  <FaCartArrowDown className="w-3" />
                </button>
                <Link href={`/looks/${id}/${index + 1}`}>
                  <button className="bg-black h-6 w-25 text-white text-xs rounded-none">
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div>
          <h1 className="flex font-thin text-2xl font-['Boston'] text-left mt-8 mx-6">
            <FaIndianRupeeSign className="h-5 mt-2" /> {lookData.totalPrice}
          </h1>
        </div>

        <div className="flex flex-row gap-3 mt-6 mx-8 mr-3">
          <button className="flex items-center h-7 w-23 justify-center text-xs gap-2 bg-black text-white rounded-none">
            Buy Now
          </button>
          <button
            onClick={handleAddLookToCart}
            disabled={loading.all}
            className="bg-black h-7 w-60 text-white text-xs rounded-none disabled:bg-gray-400"
          >
            {loading.all ? 'Adding to Cart...' : 'Add To Cart'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 mx-8">{error}</p>
        )}

        <hr className="border-t-1 border-black w-[92%] mx-auto f mt-8" />
      </div>

      <div className="px-4 py-6">
        <h1 className="text-lg text-black tracking-wide font-thin mb-4" style={{ fontFamily: "Boston" }}>
          DESCRIPTION
        </h1>
        <p className="text-[14px] tracking-wide font-light leading-5" style={{ fontFamily: "Boston" }}>
          {lookData.description.mainText}
          <br /><br /><br />
          {lookData.description.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image
                src="/assets/blackdog.png"
                alt="dot"
                width={8}
                height={8}
                className="rounded-full"
              />
              <span className="text-xs uppercase">{feature}</span>
              <br />
            </div>
          ))}
          <br /><br />
          <h1 className="text-md text-black tracking-wide font-semibold mb-1" style={{ fontFamily: "Boston" }}>
            WHY THIS LOOK WAS PICKED FOR YOU
          </h1>
          <br />
          {lookData.description.whyPicked}
        </p>
        <hr className="border-t-1 border-black w-[98%] mx-auto f mt-8" />
      </div>

      <div className="text-center mt-2 mb-2">
        <h1 className="font-thin text-left px-4" style={{ fontSize: "20px", fontWeight: 100 }}>
          YOU MAY ALSO LIKE
        </h1>
      </div>

      <MyCarousel />
    </>
  );
};

export default LookPage;