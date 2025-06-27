"use client";
import { looksData } from "@/app/utils/lookData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import StarRating from "../starRating";

interface LooksSectionProps {
  currentProductId: number;
  user?: { id: string };
}

const LooksSection = ({ currentProductId, user }: LooksSectionProps) => {
  console.log('LooksSectionThree - currentProductId:', currentProductId);
  console.log('LooksSectionThree - looksData:', looksData);
  
  // Log all product IDs from looksData for debugging
  const allProductIds = Object.values(looksData).flatMap(look => 
    look.products.map(product => product.id)
  );
  console.log("All available product IDs in looksData:", allProductIds);
  
  // Find which look contains the current product
  const currentLook = Object.entries(looksData).find(([_, look]) =>
    look.products.some(product => product.id === currentProductId)
  );

  console.log('LooksSectionThree - currentLook:', currentLook);

  if (!currentLook) {
    console.log('LooksSectionThree - No look found for product:', currentProductId);
    return (
      <div className="bg-white mt-8 font-['Boston'] p-4 text-center">
        <p className="text-sm text-gray-500">No matching look found for this product</p>
      </div>
    );
  }

  const [lookId, lookData] = currentLook;
  
  // Get other products from the same look, excluding the current product
  const otherProducts = lookData.products.filter(product => product.id !== currentProductId);
  console.log('LooksSection - otherProducts:', otherProducts);

  // Take up to 3 other products
  const displayProducts = otherProducts.slice(0, 3);
  console.log('LooksSectionThree - displayProducts:', displayProducts);

  return (
    <div className="bg-white mt-8 font-['Boston']">
      {displayProducts.length >= 1 && (
        <div className="flex gap-2 m-2">
          <div className="w-[400%] relative h-[250px]">
            <Image
              src={displayProducts[0].images.background}
              alt="Product background"
              width={300}
              height={300}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <Image
              src={displayProducts[0].images.foreground}
              alt="Product"
              width={300}
              height={300}
              className="absolute inset-0 m-auto w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {displayProducts.length == 2 && (
        <div className="flex gap-2 m-2 text-black">
          <div className="mt-6 mx-3 mb-10 text-xs justify-center items-center tracking-wider font-light leading-4 flex flex-col">
            <Button className="bg-[#007e90] hover:bg-[#006d7d] text-white h-6 mt-10 rounded-none self-start text-xs transition-colors">
              VIEW MORE
            </Button>
          </div>

          <div className="w-[310%] relative h-[250px] top-[-50] z-1">
            <Image
              src={displayProducts[1].images.background}
              alt="Product background"
              width={300}
              height={300}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <Image
              src={displayProducts[1].images.foreground}
              alt="Product"
              width={300}
              height={300}
              className="absolute inset-0 m-auto w-full h-full object-contain border-4 border-white"
            />
          </div>
        </div>
      )}

      {displayProducts.length >= 3 && (
        <div className="flex gap-2 m-2">
          <div className="w-[400%] relative h-[300px] top-[-107]">
            <Image
              src={displayProducts[2].images.background}
              alt="Product background"
              width={300}
              height={300}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <Image
              src={displayProducts[2].images.foreground}
              alt="Product"
              width={300}
              height={300}
              className="absolute inset-0 m-auto w-full h-full object-contain"
            />
          </div>

          <div className="mt-[-12%] mx-3 tracking-wide font-light text-xs justify-center items-center leading-3.5">
            <Link href={`/looks/${lookId}`}>
              <Button className="bg-[#007e90] hover:bg-[#006d7d] text-white h-5 mt-1 rounded-none transition-colors">
                View More
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LooksSection;
