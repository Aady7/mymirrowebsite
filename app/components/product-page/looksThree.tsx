"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { looksData } from "@/app/utils/lookData";
import { useParams } from "next/navigation";

interface LooksSectionThreeProps {
  currentProductId: number;
}

const LooksSectionThree = ({ currentProductId }: LooksSectionThreeProps) => {
  // Find which look contains the current product
  const currentLook = Object.entries(looksData).find(([_, look]) =>
    look.products.some(product => product.id === currentProductId)
  );

  if (!currentLook) return null;

  const [lookId, lookData] = currentLook;
  
  // Get other products from the same look, excluding the current product
  const otherProducts = lookData.products.filter(product => product.id !== currentProductId);

  // If there are no other products, don't render anything
  if (otherProducts.length === 0) return null;

  // Take up to 3 other products
  const displayProducts = otherProducts.slice(0, 3);

  return (
    <div className="bg-white mt-6 font-['Boston']">
      <h1 className="text-sm mx-6 font-semibold text-black text-left mb-1">
        {lookData.title}
      </h1>

      <div>
        {displayProducts.length >= 1 && (
          <div className="flex gap-2 m-2">
            <div className="w-[400%]">
              <Image
                src={displayProducts[0].images.foreground}
                alt={displayProducts[0].description}
                width={600}
                height={600}
              />
            </div>

            <div className="mt-6 mx-3 tracking-wide font-light text-xs justify-center items-center leading-3.5">
              {displayProducts[0].description}
            </div>
          </div>
        )}

        {displayProducts.length >= 2 && (
          <div className="flex gap-2 m-2 text-black">
            <div className="mt-2 mx-3 mb-2 text-xs justify-center items-center tracking-wide font-light leading-3.5">
              {displayProducts[1].description}
            </div>

            <div className="w-[310%] relative top-[-50] z-1">
              <Image
                src={displayProducts[1].images.foreground}
                alt={displayProducts[1].description}
                width={600}
                height={600}
                className="border-4 border-white"
              />
            </div>
          </div>
        )}

        {displayProducts.length >= 3 && (
          <div className="flex gap-2 m-2">
            <div className="w-[400%] relative top-[-107]">
              <Image
                src={displayProducts[2].images.foreground}
                alt={displayProducts[2].description}
                width={600}
                height={600}
              />
            </div>

            <div className="mt-[-12%] mx-3 tracking-wide font-light text-xs justify-center items-center leading-3.5">
              {displayProducts[2].description} <br />
              <Link href={`/looks/${lookId}`}>
                <Button className="bg-black text-white h-5 mt-1 rounded-none">
                  View More
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LooksSectionThree;
