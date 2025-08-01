"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const LookBookBanner = () => {
  return (
    <>
      {/*backround image banner with the cta Explore */}
      <div>
        <div className="w-full px-4 mt-3 relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="/assets/lookbookbanner.svg"
            alt="bannerbackground"
            width={1600}
            height={400}
            className="object-cover   rounded-xl"
          />
          <div className="absolute bottom-32 right-8 z-10">
            <Link href="/lookbook">
              <Button className="text-white w-22 tracking-wide bg-yellow-400 uppercase px-6 py-2 rounded-md shadow-md hover:bg-yellow-500 transition-all duration-200">
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default LookBookBanner;
