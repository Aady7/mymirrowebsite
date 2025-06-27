"use client";
import Image from "next/image";

const HomeStylistSection = () => {
  return (
    <div className="px-8 w-full max-w-[480px] mx-auto md:max-w-2xl lg:max-w-4xl py-8">
      <div className="relative border border-stone-400 p-6 pt-10 md:p-8 md:pt-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
          <h2 className="text-center font-[Boston] text-lg md:text-xl lg:text-2xl tracking-widest text-stone-800 whitespace-nowrap">
            STYLIST SAYS
          </h2>
        </div>

        <div className="flex flex-col items-start justify-center space-y-8">
          <p className="text-xs md:text-base leading-relaxed text-left text-stone-600 max-w-prose">
            Your style shouldn't be left to trends, tabs, or trial and error.
            <br />
            <br />
            At MyMirro, every look blends your quiz inputs with AI precision and
            stylist expertise.
            <br />
            <br />
            We don't just match clothes, we decode your preferences,
            proportions, and personality to build a wardrobe that knows you
            better than you know yourself.
            <br />
            <br />
            Styling, redefined. Personal. Intentional. Built around you.
          </p>

          <div className="flex flex-row items-center justify-center w-full gap-2 sm:gap-4">
            <div className="flex flex-col items-center justify-center p-0   w-24 h-24 md:w-28 md:h-28">
              <div className="relative w-20 h-20 md:w-20 md:h-20">
                <Image
                  src="/assets/quiz.svg"
                  alt="quiz photo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="font-light text-black text-[10px] md:text-xs text-center mt-1">
                QUIZ
              </span>
            </div>

            

            <div className="flex flex-col items-center justify-center p-0   w-24 h-24 md:w-28 md:h-28">
              <div className="relative  w-20 h-20 md:w-20 md:h-20">
                <Image
                  src="/assets/ai.svg"
                  alt="ai photo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="font-light text-black text-[10px] md:text-xs text-center mt-1">
                AI
              </span>
            </div>

          

            <div className="flex flex-col items-center justify-center p-0   w-24 h-24 md:w-28 md:h-28">
              <div className="relative  w-20 h-20 md:w-20 md:h-20">
                <Image
                  src="/assets/stylist.svg"
                  alt="stylist photo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="font-light text-black text-[10px] md:text-xs text-center mt-2">
                STYLIST
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeStylistSection; 