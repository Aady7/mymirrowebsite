"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const LookSection = () => {
  const productList = [
    {
      id: 1,
      image: "/assets/look-11.png",
      description:
        "Crisp and effortless, this pure cotton shirt from Mast & Harbour keeps it classic with a modern edge — perfect for everyday wear.",
    },
    {
      id: 2,
      image: "/assets/pant-22.png",
      description:
        "Clean and versatile, these slim-fit cotton twill trousers from H&M are built for comfort and easy styling all day long.",
    },
  ];

  return (
    <div className="bg-white mt-6">
      <h1 className="text-sm mx-6 font-semibold text-black text-left mb-1">
        LOOK 1
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
          <div className="  mt-3 mx-4 tracking-wide font-light  text-xs justify-center items-center leading-normal">
            {productList[0].description}
          </div>
        </div>

        {/* Bottom Row - Text Left, Pants Image Right */}
        <div className="flex gap-2  m-2 text-black">
          {/* Shirt Description */}
          <div className=" mt-8 mx-3 text-xs justify-center items-center tracking-wide font-light leading-normal">
            {productList[1].description}<br/>
           <Link href="/looks/urban"> <Button className=" bg-black text-white h-5 mt-4 rounded-none">
              View More
            </Button>
            </Link>
          </div>

          {/* pant Image */}
          <div className="w-[310%] relative top-[-50] ">
            <Image
              src={productList[1].image}
              alt="Look Shirt"
              width={600}
              height={600}
              className="border-4 border-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookSection;
