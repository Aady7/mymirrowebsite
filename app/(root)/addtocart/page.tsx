"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";

const page = () => {
  const [count, setCount] = useState(1);
  return (
    <>
      {/* header section */}
      <div className="text-black font-[Boston] text-[35px] px-[24px] not-italic font-normal leading-normal [font-variant:all-small-caps]">
        <h1>MY CART</h1>
      </div>
      {/* Horizontal Line */}
      <div className="px-[24px] mt-[20px] w-full">
        <hr className="border border-gray-700 w-full" />
      </div>

      {/*check box with selected ites and price */}
      <div className="flex flex-row items-center justify-start px-[20px] mt-6 gap-3 text-black font-[Boston] text-[14px] not-italic font-semibold leading-normal [font-variant:all-small-caps]">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-8 h-8 border-1 border-black rounded peer-checked:bg-black peer-checked:text-white flex items-center justify-center text-[24px] font-bold">
            -
          </div>
        </label>

        <h2 className="flex flex-row items-center text-[20px] font-semibold leading-normal m-0 p-0">
          1/3 ITEMS SELECTED&nbsp;
          <span className="flex flex-row items-center">
            ( <FaIndianRupeeSign className="mr-[4px]" /> 2,300 )
          </span>
        </h2>
      </div>

      {/*cart Items */}

      <div className="flex flex-row items-start justify-between px-[20px] py-[12px] gap-4 mt-[26px] ">
        {/* Left: image with checkbox */}
        <div className="relative inline-block">
          <input
            type="checkbox"
            className="absolute top-2 left-2 w-6 h-6 border-2 border-black rounded appearance-none
    checked:bg-black
    checked:after:content-['✔'] checked:after:text-white checked:after:text-[14px] checked:after:flex checked:after:items-center checked:after:justify-center"
          />

          <Image
            src="/assets/cartsample.svg"
            alt="sample image"
            width={150}
            height={80}
          />
        </div>

        {/* Middle: product details */}
        <div className="flex flex-col flex-grow items-start gap-1 text-black font-[Boston] text-[16px] not-italic font-semibold leading-normal [font-variant:all-small-caps]">
          <h1 className="text-[20px] font-bold">Jack & Jones</h1>

          <h1 className="text-[18px] mt-[-1rem] text-gray-400 font-medium">
            Opaque Casual Shirt
          </h1>

          {/* Quantity selector */}
          <div className="flex flex-row items-center mt-4 h-9 gap-2 border bg-black border-black rounded-none px-2 py-1">
            <button
              onClick={() => setCount(count - 1)}
              className="text-[20px] font-bold px-2  text-white"
            >
              -
            </button>
            <span className="text-[18px] font-medium text-white">{count}</span>
            <button
              onClick={() => setCount(count + 1)}
              className="text-[20px] font-bold px-2 text-white"
            >
              +
            </button>
          </div>

          {/* Price */}
          <span className="flex flex-row items-center text-[18px] font-semibold mt-4">
            <FaIndianRupeeSign className="mr-[4px]" /> 2,300
          </span>
        </div>

        {/* Right: delete icon */}
        <div className="self-start">
          <Button
            variant="ghost"
            className="flex items-center justify-center p-2 w-8 h-8 bg-transparent hover:bg-gray-100 rounded"
          >
            <Image
              src="/assets/delete.svg"
              alt="delete"
              width={15}
              height={12}
            />
          </Button>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="px-[24px] mt-[20px] w-full">
        <hr className="border border-gray-700 w-full" />
      </div>

      {/* billing sectyion */}
      <div className="px-[24px] md:p-6 lg:p-8">
        <div className="border border-black px-4 mt-9 py-4 w-full max-w-sm text-black font-[Boston] text-[16px] not-italic leading-normal [font-variant:all-small-caps]">
          {/* Header */}
          <h2 className="text-[16px] font-semibold mb-3 border-b border-dashed border-gray-400 pb-2">
            PRICE DETAILS (1 Item)
          </h2>

          {/* Total MRP */}
          <div className="flex justify-between items-center mb-3">
            <span>Total MRP</span>
            <span className="text-[18px] font-semibold flex items-center">
              <FaIndianRupeeSign className="mr-[4px]" /> 2,300
            </span>
          </div>

          {/* Stylist Fee */}
          <div className="flex justify-between items-center mb-3">
            <span className="flex items-center">
              Stylist Fee
              <span className="ml-2 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-yellow-500 font-bold text-[12px] border border-green-600">
                S
              </span>
            </span>
            <span className="text-green-500 font-semibold">FREE</span>
          </div>

          {/* Shipping Fee */}
          <div className="flex justify-between items-center mb-3 border-b border-dashed border-gray-400 pb-2">
            <span>Shipping Fee</span>
            <span className="text-green-500 font-semibold">FREE</span>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-[18px] font-bold">Total Amount</span>
            <span className="text-[18px] font-bold flex items-center">
              <FaIndianRupeeSign className="mr-[4px]" /> 2,300
            </span>
          </div>
        </div>
      </div>

      {/* place order */}
      <div className="w-full mt-9 px-4 py-6 flex flex-col items-center justify-center gap-3 border-t border-gray-200">
        {/* Text */}
        <p className="text-[14px] text-gray-500  font-[Boston] not-italic font-normal leading-normal">
          1 Item selected for order
        </p>

        {/* Place Order button */}
        <button className="w-full max-w-xs bg-black text-white text-[14px] font-bold uppercase py-3 px-6 tracking-wide">
          Place Order
        </button>
      </div>
    </>
  );
};

export default page;
