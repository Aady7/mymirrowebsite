"use client";
import Image from "next/image";

const StylistHome = () => {
  return (
    <div className="px-4 w-full max-w-[480px] mx-auto md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]">
      {/*stylist section*/}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="p-0">
          {/* Text + Image */}
          <div className="flex flex-col items-center justify-between md:max-w-[80%] lg:max-w-[70%] mx-auto">
            <p className="font-[Boston] text-[12px] md:text-[14px] lg:text-[16px] not-italic font-normal leading-normal text-center">
              <span className="block max-w-[90%] mx-auto">
                Your style shouldn't be left to trends, tabs, or trial and
                error.
              </span>
              <span className="block max-w-[80%] mx-auto">
                At MyMirro, every look is the result of a layered process — your
                quiz inputs, refined by AI, and elevated by real stylists.
              </span>
              <span className="block max-w-[70%] mx-auto">
                We don't just match clothes. We decode you — your preferences,
                proportions, and personality — to build a wardrobe that knows
                you better than you know yourself.
              </span>
              <span className="block max-w-[60%] mx-auto">
                This is styling, redefined. Personal, intentional, and built
                around you.
              </span>
            </p>

            <div className="flex flex-row items-center overflow-x-auto mt-6 px-4 gap-0 md:gap-4 lg:gap-8 md:justify-center md:overflow-visible">
              <div className="flex flex-col items-center w-[90px] md:w-[120px] lg:w-[150px]">
                <Image
                  src="/assets/quiz.svg"
                  alt="quiz photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0 md:w-[100px] md:h-[90px] lg:w-[120px] lg:h-[110px]"
                />
                <span className="font-light text-black text-[10px] md:text-[12px] lg:text-[14px] text-center">
                  QUIZ
                </span>
              </div>

              <p className="text-xs font-light md:text-base lg:text-lg">+</p>

              <div className="flex flex-col items-center w-[90px] md:w-[120px] lg:w-[150px]">
                <Image
                  src="/assets/ai.svg"
                  alt="ai photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0 md:w-[100px] md:h-[90px] lg:w-[120px] lg:h-[110px]"
                />
                <span className="font-light text-black text-[10px] md:text-[12px] lg:text-[14px] text-center">
                  AI
                </span>
              </div>

              <p className="text-xs font-light md:text-base lg:text-lg">+</p>

              <div className="flex flex-col items-center w-[90px] md:w-[120px] lg:w-[150px]">
                <Image
                  src="/assets/stylist.svg"
                  alt="stylist photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0 md:w-[100px] md:h-[90px] lg:w-[120px] lg:h-[110px]"
                />
                <span className="font-light text-black text-[10px] md:text-[12px] lg:text-[14px] text-center">
                  STYLIST
                </span>
              </div>
            </div>
          </div>
   
        </div>
      </div>
    </div>
  );
};

export default StylistHome;