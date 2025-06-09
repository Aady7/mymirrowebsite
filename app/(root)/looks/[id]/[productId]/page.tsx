"use client";

import LooksSectionThree from "@/app/components/product-page/looksThree";
import { looksData } from "@/app/utils/lookData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function ProductPage() {
  const { id, productId } = useParams();
  const lookData = looksData[id as keyof typeof looksData];

  if (!lookData) {
    notFound();
  }

  // Convert productId to number and subtract 1 for zero-based index
  const productIndex = parseInt(productId as string) - 1;
  const product = lookData.products[productIndex];

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full px-[24px] py-1 max-w-md mx-auto font-['Boston']">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="font-thin" style={{ fontSize: "25px", fontWeight: 300 }}>
          {product.brandName}
        </h1>
      </div>

      {/* Horizontal Line */}
      <hr className="border border-black mb-4" />

      {/* Image with background */}
      <div className="relative w-70% h-[350px] mt-6 overflow-hidden">
        {/* Background image */}
        <Image
          src={product.images.background}
          alt="Background"
          fill
          className="object-cover absolute z-0"
        />

        {/* upper image */}
        <Image
          src={product.images.foreground}
          alt={product.brandName}
          fill
          className="object-contain z-10 p-0"
        />
      </div>

      {/*Price section*/}
      <div>
        <div className="flex mt-8 items-center gap-1">
          <FaIndianRupeeSign className="text-lg" />
          <h1 className="text-2xl font-bold">{product.price}</h1>
        </div>
        <div className="w-full p-2 mt-[12px]">
          <h6 className="text-left font-thin text-sm">SIZE</h6>
          <div className="flex gap-4 mt-2">
            {product.sizes.map((size, index) => (
              <Button
                key={index}
                className="text-xs rounded-none text-black bg-amber-50 border-3"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        {/* Buttons Section */}
        {/* Shared wrapper for both buttons and hr */}
        <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
          {/* Buttons Row */}
          <div className="flex items-center gap-4 mt-5">
            <Button className="flex-[1] min-w-[100px] max-w-[160px] bg-black rounded-none text-white h-10 text-xs">
              BUY NOW
            </Button>
            <Button className="flex-[2] min-w-[140px] max-w-[240px] bg-black rounded-none text-white h-10 text-xs">
              ADD TO CART
            </Button>
          </div>

          {/* Divider */}
          <hr className="w-full border border-black mt-[30px]" />
        </div>
      </div>

      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="w-full  mt-8">
          <h1 className="font-[Boston] font-thin text-[12px] text-left">
            DESCRIPTION
          </h1>
        </div>

        <div className="w-full mt-2">
          <p className="text-xs font-thin font-[Boston] text-left leading-tight">
            {product.description}
          </p>
        </div>
      </div>
      {/* Horizontal Line */}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <hr className="w-full border border-black mt-[30px]" />
      </div>

      {/*Style with it*/}

      <div className="text-center mt-8 w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <h1 className="font-thin" style={{ fontSize: "20px", fontWeight: 100 }}>
          STYLE IT WITH
        </h1>
      </div>

      {/*lookThreeSection*/}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <LooksSectionThree currentProductId={product.id} />
      </div>

      {/* Horizontal Line */}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <hr className="w-full border border-black mt-[30px]" />
      </div>

      {/*you may also like section]*/}
      <div className="w-full max-w-screen-lg mx-auto px-2 md:px-6 lg:px-8">
        <div className="text-center mt-8 mb-2">
          <h1
            className="font-thin"
            style={{ fontSize: "20px", fontWeight: 100 }}
          >
            YOU MAY ALSO LIKE
          </h1>
        </div>

        {/*two images*/}
        <div className="flex flex-row mt-6 gap-10 justify-center flex-wrap">
          {/* Product Card 1 */}
          <div className="flex-col items-center w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300}
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-2">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69</p>
            <Button className=" w-2/3 h-7 bg-black text-white text-xs py-[10px] mt-2 rounded-none">
              VIEW MORE
            </Button>
          </div>

          {/* Product Card 2 */}
          <div className="flex-col items-center w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300}
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-2">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69</p>
            <Button className=" w-2/3 h-7 bg-black text-white text-xs py-[10px] mt-2 rounded-none">
              VIEW MORE
            </Button>
          </div>
        </div>

        {/*two images*/}
        <div className="flex flex-row mt-6 gap-10 justify-center flex-wrap mb-[30px]">
          {/* Product Card 1 */}
          <div className="flex-col items-center w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300}
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-4">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69</p>
            <Button className=" w-2/3 h-7   bg-black text-white text-xs py-[10px] mt-2 rounded-none">
              VIEW MORE
            </Button>
          </div>

          {/* Product Card 2 */}
          <div className="flex-col items-center w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300}
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-4">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69</p>
            <Button className="w-2/3 h-7  bg-black text-white text-xs py-[10px] mt-2 rounded-none">
              VIEW MORE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
