"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import FashionTarot from "./fashionTarot";
import Stylist from "./stylist";
import { useFetchLookProducts } from "@/lib/hooks/useFetchLookProducts";
import { useEffect, useState } from "react";

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
}

// Helper function to safely parse product images
const getFirstProductImage = (productImages: string): string => {
  try {
    const images = JSON.parse(productImages);
    return Array.isArray(images) && images.length > 0 ? images[0] : '/fallback.jpg';
  } catch (error) {
    console.error('Error parsing product images:', error);
    return '/fallback.jpg';
  }
};

const StylistSays = () => {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        setLoading(true);
        const looksData = await useFetchLookProducts();
        setLooks(looksData as Look[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch looks");
      } finally {
        setLoading(false);
      }
    };

    fetchLooks();
  }, []);

  if (loading) {
    return <div>Loading looks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/*Heading section*/}
        <div>
          <div className="flex items-center justify-center mt-4">
            <h1 className="text-black font-[Boston] text-[30px] md:text-[40px] not-italic font-normal leading-normal [font-variant:all-small-caps] text-center">
              STYLIST SAYS
            </h1>
          </div>
        </div>
        {/*Stylist section*/}

        <Stylist />
        {/*color analysis */}
        

        {/*fashion taro card */}
        <FashionTarot />

        {/*curated looks just for you*/}
        <div className="p-2 mt-10 md:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center space-y-1 md:space-y-3">
            {/* Heading in a fixed width to control centering */}
            <h1 className="text-center font-[Boston] text-[18px] md:text-[24px] not-italic font-normal leading-normal w-[290px] md:w-auto">
              CURATED LOOKS JUST FOR YOU
            </h1>

            {/* Paragraph aligned under "U" by padding-left */}
            <p className="font-[Boston] text-[14px] md:text-[16px] not-italic font-normal leading-normal pl-[15px] pr-[2px] w-[280px] md:w-auto md:text-center md:px-0">
              Handpicked outfit combinations tailored to
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;your
              unique style profile
            </p>
          </div>

          {/* Looks section container */}
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:mt-12">
            {looks.map((look, index) => (
              <div 
                key={look.lookNumber}
                className={`${
                  index === 0 ? 'md:col-span-2 lg:col-span-1' : 'md:col-span-1'
                } p-7 flex flex-col`}
              >
                {/* Look header section */}
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-semibold md:text-lg">
                    LOOK {look.lookNumber}
                  </h3>
                  <h3 className="text-sm font-semibold md:hidden">
                    {look.lookName}
                  </h3>
                </div>

                {/* Images container - Fixed height for all layouts */}
                <div className="h-[400px] flex-grow">
                  {look.products.length >= 3 ? (
                    // Layout for 3 or more products
                    <div className="flex gap-2 h-full">
                      {/* Left side - First image */}
                      <div className="w-1/2 h-full">
                        <div className="w-full h-full relative">
                          <Image
                            src={getFirstProductImage(look.products[0].productImages)}
                            alt={`Product 1`}
                            fill
                            className="object-cover border-2"
                          />
                        </div>
                      </div>

                      {/* Right side - Second and third images */}
                      <div className="w-1/2 flex flex-col gap-2">
                        {look.products.slice(1, 3).map((product, idx) => (
                          <div key={product.id} className="w-full h-[calc(50%-1px)] relative">
                            <Image
                              src={getFirstProductImage(product.productImages)}
                              alt={`Product ${idx + 2}`}
                              fill
                              className="object-cover border-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Layout for 1 or 2 products
                    <div className="flex gap-2 h-full">
                      {look.products.map((product, idx) => (
                        <div key={product.id} className="flex-1 h-full relative">
                          <Image
                            src={getFirstProductImage(product.productImages)}
                            alt={`Product ${idx + 1}`}
                            fill
                            className="object-cover border-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* View More Button */}
                <div className="flex justify-end mt-2">
                  <Link href={`/looks/${look.lookNumber}`}>
                    <Button className="bg-black rounded-none w-20 h-6 md:h-8 md:w-25 md:px-6 text-xs">
                      VIEW MORE
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StylistSays;
