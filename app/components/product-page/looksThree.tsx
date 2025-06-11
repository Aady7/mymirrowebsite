"use client";
import { looksData } from "@/app/utils/lookData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import StarRating from "../starRating";

interface LooksSectionThreeProps {
  currentProductId: number;
  user?: { id: string };
}

const LooksSectionThree = ({ currentProductId, user }: LooksSectionThreeProps) => {
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
    <div className="bg-white mt-8 font-['Boston']">
       

      <div>
        {displayProducts.length >= 1 && (
          <div className="flex gap-2 m-2">
            <div className="w-[400%] relative h-[250px]">
              <Image
                src={displayProducts[0].images.background}
                alt="background"
                width={300}
                height={300}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <Image
                src={displayProducts[0].images.foreground}
                alt={displayProducts[0].description}
                width={300}
                height={300}
                className="absolute inset-0 m-auto w-full h-full object-contain"
              />
            </div>

            <div className="mt-6 mx-3 tracking-wider font-light text-xs justify-center items-center leading-4">
              {displayProducts[0].description}
              <div className="mt-4 flex flex-col items-start">
                <h1 className="text-sm font-semibold mb-2">Rating</h1>
                {user && <StarRating userId={user.id} lookId={lookData.lookNumber} />}
              </div>
            </div>

          </div>
        )}

        {displayProducts.length >= 2 && (
          <div className="flex gap-2 m-2 text-black">
            <div className="mt-6 mx-3 mb-10 text-xs justify-center items-center tracking-wider font-light leading-4 flex flex-col">
              {displayProducts[1].description}
              <Button className="bg-black text-white h-6 mt-10 rounded-none self-start text-xs">
                VIEW MORE
              </Button>
            </div>

            <div className="w-[310%] relative h-[250px] top-[-50] z-1">
              <Image
                src={displayProducts[1].images.background}
                alt="background"
                width={300}
                height={300}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <Image
                src={displayProducts[1].images.foreground}
                alt={displayProducts[1].description}
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
                alt="background"
                width={300}
                height={300}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <Image
                src={displayProducts[2].images.foreground}
                alt={displayProducts[2].description}
                width={300}
                height={300}
                className="absolute inset-0 m-auto w-full h-full object-contain"
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
