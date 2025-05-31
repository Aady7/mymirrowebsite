"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Look } from "@/app/utils/lookData";

interface LookSectionProps {
  look: Look;
  lookId: string;
}

const LookSection = ({ look, lookId }: LookSectionProps) => {
  // Get first two products or all if only one product
  const displayProducts = look.products.slice(0, 2);

  return (
    <div className="bg-white mt-6">
      <h1 className="text-sm mx-6 font-semibold text-black text-left mb-1">
        {look.title}
      </h1>

      <div>
        {displayProducts.length === 2 ? (
          <>
            {/* Top Row - First Product Image Left, Text Right */}
            <div className="flex gap-2 m-2">
              <div className="w-[400%]">
                <Image
                  src={displayProducts[0].images.foreground}
                  alt={displayProducts[0].description}
                  width={600}
                  height={600}
                />
              </div>

              <div className="mt-3 mx-4 tracking-wide font-light text-xs justify-center items-center leading-normal">
                {displayProducts[0].description}
              </div>
            </div>

            {/* Bottom Row - Text Left, Second Product Image Right */}
            <div className="flex gap-2 m-2 text-black">
              <div className="mt-8 mx-3 text-xs justify-center items-center tracking-wide font-light leading-normal">
                {displayProducts[1].description}<br/>
                <Link href={`/looks/${lookId}`}>
                  <Button className="bg-black text-white h-5 mt-4 rounded-none">
                    View More
                  </Button>
                </Link>
              </div>

              <div className="w-[310%] relative top-[-50]">
                <Image
                  src={displayProducts[1].images.foreground}
                  alt={displayProducts[1].description}
                  width={600}
                  height={600}
                  className="border-4 border-white"
                />
              </div>
            </div>
          </>
        ) : (
          // Single product layout
          <div className="flex flex-col gap-2 m-2">
            <div className="w-full">
              <Image
                src={displayProducts[0].images.foreground}
                alt={displayProducts[0].description}
                width={600}
                height={600}
              />
            </div>

            <div className="mt-3 mx-4 tracking-wide font-light text-xs justify-center items-center leading-normal">
              {displayProducts[0].description}<br/>
              <Link href={`/looks/${lookId}`}>
                <Button className="bg-black text-white h-5 mt-4 rounded-none">
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

export default LookSection;
