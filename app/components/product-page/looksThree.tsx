"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { productList } from "@/app/utils/productList";

const LooksSectionThree = () => {
  

  return (
    <div className="bg-white mt-6 font-['Boston']">
      <h1 className="text-sm mx-6 font-semibold text-black text-left mb-1">
        LOOK 3
      </h1>

      <div>
        {/* Fixed Heading */}

        {/* Top Row - Shirt Image Left, Text Right */}
        <div className="flex  gap-2  m-2 ">
          {/* Shirt Image */}
          <div className="w-[400%]">
            <Image
              src={productList[0].image}
              alt="Look Shirt"
              width={600}
              height={600}
            />
          </div>

          {/* Shirt Description */}
          <div className="  mt-6 mx-3 tracking-wide font-light text-xs justify-center items-center leading-3.5 ">
            {productList[0].description}
          </div>
        </div>

        {/* Bottom Row - Text Left, Pants Image Right */}
        <div className="flex  gap-2  m-2 text-black">
          {/* Shirt Description */}
          <div className=" mt-2 mx-3 mb-2  text-xs justify-center items-center tracking-wide font-light leading-3.5 ">
            {productList[1].description}
          </div>

          {/* pant Image */}
          <div className="w-[310%] relative top-[-50] z-1 ">
            <Image
              src={productList[1].image}
              alt="Look Shirt"
              width={600}
              height={600}
              className="border-4 border-white"
            />
          </div>
        </div>

        <div className="flex  gap-2  m-2 ">
          {/* Shirt Image */}
          <div className="w-[400%] relative top-[-107] ">
            <Image
              src={productList[2].image}
              alt="Look Shirt"
              width={600}
              height={600}
            />
          </div>

          {/* Shirt Description */}
          <div className="  mt-[-12%] mx-3 tracking-wide font-light text-xs justify-center items-center leading-3.5">
            {productList[2].description} <br />
           <Link href="/app/components/texturePrint.tsx" > <Button className=" bg-black text-white h-5 mt-1 rounded-none">
              View More
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LooksSectionThree;
