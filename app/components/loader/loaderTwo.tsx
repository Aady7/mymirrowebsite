"use client";
import React from "react";
import Image from "next/image";
const LoaderTwo = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-center leading-[1] text-[28px] font-bold font-[Boston] text-black mb-4">
          Your body shape defines
          <br />
          the fit, not the size.
        </h1>
        <p className="pl-4 pr-4 text-center leading-[1] text-[14px] font-normal font-[Boston] text-[#5B5B5B] max-w-md mb-8">
          We analyze your body proportions to recommend <br/>styles that enhance your
          natural shape — so every <br/>fit flatters you, not fights you.
        </p>
        <div className="mb-8">
          <Image
            src="/assets/loader-2.svg"
            alt="loader-2"
            width={200}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-[14px] font-normal font-[Boston] text-[#5B5B5B] mb-8">
          Your outfits are being curated, please hold tight.
        </p>
        <div className="flex items-center justify-center">
          <span className="inline-block w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
        </div>
      </div>
    </>
  );
};
export default LoaderTwo; 