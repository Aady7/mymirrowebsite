"use client";

import Image from "next/image";
import { useState } from "react";

const FashionTarot = () => {
  const [isFlipped1, setIsFlipped1] = useState(false);
  const [isFlipped2, setIsFlipped2] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="mt-8 p-3">
        <h1 className="font-['Boston'] text-xl flex items-center justify-center">
          FASHION TAROT CARD 
        </h1>           

        <p className=" pt-2  flex items-center text-center font-[Boston] text-[14px] not-italic font-normal leading-normal justify-center">
          Uncover your style spirit — each card reveals a <br />
          fashion truth based on your personality.
        </p>                                                  
      </div>


      {/* Tarot Cards */}
      <div className="mt-6 px-10">
        <div className="flex flex-row gap-10">
          {/* Tarot Card 1 */}
          <div
            className="w-[152px] h-[240px] perspective cursor-pointer"
            onClick={() => setIsFlipped1(!isFlipped1)}
          >
            <div
              className={`relative w-full h-full duration-700 transform-style preserve-3d ${
                isFlipped1 ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden">
                <Image
                  src="/assets/tarot-1.png"
                  alt="The Color Seeker"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <Image
                  src="/assets/colorseekerdesc.png"
                  alt="Back of The Color Seeker"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Tarot Card 2 */}
          <div
            className="w-[156px] h-[240px] perspective cursor-pointer"
            onClick={() => setIsFlipped2(!isFlipped2)}
          >
            <div
              className={`relative w-full h-full duration-700 transform-style preserve-3d ${
                isFlipped2 ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden">
                <Image
                  src="/assets/tarot-2.png"
                  alt="The Minimalist"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <Image
                  src="/assets/minimalistdesc.png"
                  alt="Back of The Minimalist"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default FashionTarot;
