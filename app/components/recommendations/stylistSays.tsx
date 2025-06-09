import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import FashionTarot from "./fashionTarot";
import Stylist from "./stylist";

const StylistSays = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/*Heading section*/}
        <div>
          <div className="flex items-center justify-center mt-4">
            <h1 className="text-black font-[Boston] text-[30px] md:text-[40px] not-italic font-normal leading-normal [font-variant:all-small-caps] text-center">
              STYLIST SAYS
            </h1>
          </div>
        </div>
        {/*Stylist section*/}

        <Stylist />
        {/*color analysis */}
        <div className="px-[24px]">
          {/* White horizontal line */}
          <hr className="w-full border-t border-gray-400 mt-4 md:mt-6 lg:mt-8" />
          {/* Heading and Paragraph */}
          <div className="flex flex-row justify-between items-start mt-4 gap-8 md:mt-6 lg:mt-8 md:max-w-[90%] lg:max-w-[80%] mx-auto">
            {/* Left Section: Heading + Paragraph */}
            <div className="w-2/3 md:w-3/5">
              <h1 className="text-[11px] md:text-[13px] lg:text-[15px] tracking-normal font-semibold mt-2">
                YOUR COLOR ANALYSIS
              </h1>
              <p className="mt-2 font-[Boston] text-[12px] md:text-[14px] lg:text-[16px] not-italic font-light leading-normal">
                With your soft undertones and calm personality, light earthy
                tones and minimal pieces enhance your natural ease and elegance.
              </p>
            </div>

            {/* Right Section: Color Boxes in Column */}
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 w-1/2 md:w-2/5 items-end">
              <div className="relative">
                <div
                  className="w-[158px] md:w-[200px] lg:w-[250px] h-[23px] md:h-[40px] lg:h-[50px]"
                  style={{ backgroundColor: "#D8CAB8" }}
                ></div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] md:text-[12px] lg:text-[14px] font-[Boston] text-[#8B7355]">
                  Warm Beige
                </span>
              </div>
              <div className="relative">
                <div
                  className="w-[158px] md:w-[200px] lg:w-[250px] h-[23px] md:h-[40px] lg:h-[50px]"
                  style={{ backgroundColor: "#A3A380" }}
                ></div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] md:text-[12px] lg:text-[14px] font-[Boston] text-[#F5F1EA]">
                  Muted Olive
                </span>
              </div>
              <div className="relative">
                <div
                  className="w-[158px] md:w-[200px] lg:w-[250px] h-[23px] md:h-[40px] lg:h-[50px]"
                  style={{ backgroundColor: "#E5B299" }}
                ></div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] md:text-[12px] lg:text-[14px] font-[Boston] text-[#F5F1EA]">
                  Pale Terracotta
                </span>
              </div>
              <div className="relative">
                <div
                  className="w-[158px] md:w-[200px] lg:w-[250px] h-[23px] md:h-[40px] lg:h-[50px]"
                  style={{ backgroundColor: "#BFBFBF" }}
                ></div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] md:text-[12px] lg:text-[14px] font-[Boston] text-[#666666]">
                  Stone Grey
                </span>
              </div>
              <div className="relative">
                <div
                  className="w-[158px] md:w-[200px] lg:w-[250px] h-[23px] md:h-[40px] lg:h-[50px]"
                  style={{ backgroundColor: "#FDF6EC" }}
                ></div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] md:text-[12px] lg:text-[14px] font-[Boston] text-[#8B8378]">
                  Cream White
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*fashion taro card */}
        <FashionTarot />

        {/*curated looks just for you*/}
        <div className="p-2 mt-10 md:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center space-y-1 md:space-y-3">
            {/* Heading in a fixed width to control centering */}
            <h1 className="text-center font-[Boston] text-[18px] md:text-[24px] not-italic font-normal leading-normal w-[290px] md:w-auto">
              CURATED LOOKS JUST FOR YOU
            </h1>

            {/* Paragraph aligned under "U" by padding-left */}
            <p className="font-[Boston] text-[14px] md:text-[16px] not-italic font-normal leading-normal pl-[15px] pr-[2px] w-[280px] md:w-auto md:text-center md:px-0">
              Handpicked outfit combinations tailored to
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;your
              unique style profile
            </p>
          </div>

          {/* Looks section container */}
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:mt-12">
            {/* Look 1 section */}
            <div className="md:col-span-2 lg:col-span-1 p-7">
              <div className="flex flex-row gap-1 mt-8 md:mt-0">
                {/* LEFT: LOOK 1 */}
                <div className="flex flex-col w-1/2 md:w-full">
                  <h3 className="text-sm font-semibold mb-1 md:text-lg">
                    LOOK 1
                  </h3>
                  <div className="w-full h-[300px] md:h-[400px]">
                    <Image
                      src="/images.jpg"
                      alt="Look 1"
                      width={800}
                      height={800}
                      className="w-full h-full border-2 object-cover"
                    />
                  </div>
                </div>

                {/* RIGHT: URBAN SHIFT - Only show in mobile */}
                <div className="flex flex-col w-1/2 md:hidden">
                  <h3 className="text-sm font-semibold text-right mb-1">
                    URBAN SHIFT
                  </h3>
                  <div className="flex flex-col gap-1 h-[300px]">
                    <div className="flex-1">
                      <Image
                        src="/images.jpg"
                        alt="Urban 1"
                        width={800}
                        height={400}
                        className="w-full h-full border-2 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Image
                        src="/images.jpg"
                        alt="Urban 2"
                        width={800}
                        height={400}
                        className="w-full h-full border-2 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <span className="flex items-end justify-end mt-1">
                <Link href="/looks/urbanShift">
                  <Button className="bg-black rounded-none w-25 h-6 md:h-8 md:px-6">
                    VIEW MORE
                  </Button>
                </Link>
              </span>
            </div>

            {/* Look 2 section */}
            <div className="md:col-span-1 p-7">
              <div className="flex flex-row gap-1 mt-10 md:mt-0">
                <div className="flex flex-col w-1/2 md:w-full">
                  <h3 className="text-sm font-semibold mb-1 md:text-lg">
                    LOOK 2
                  </h3>
                  <div className="w-full h-[300px] md:h-[400px]">
                    <Image
                      src="/images.jpg"
                      alt="Look 2"
                      width={800}
                      height={800}
                      className="w-full h-full border-2 object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-1/2 md:hidden">
                  <h3 className="text-sm font-semibold mb-1 text-right">
                    URBAN SHIFT
                  </h3>
                  <div className="w-full h-[300px]">
                    <Image
                      src="/images.jpg"
                      alt="Look 2 Split"
                      width={800}
                      height={800}
                      className="w-full h-full border-2 object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="flex items-end justify-end mt-1">
                <Link href="/looks/minimalElegance">
                  <Button className="bg-black rounded-none w-25 h-6 md:h-8 md:px-6">
                    VIEW MORE
                  </Button>
                </Link>
              </span>
            </div>

            {/* Look 3 section */}
            <div className="md:col-span-1 p-7">
              <div className="mt-6 md:mt-0">
                <div className="flex flex-col w-full">
                  <h3 className="text-sm font-semibold mb-1 md:text-lg">
                    LOOK 3
                  </h3>
                  <div className="w-full h-[300px] md:h-[400px]">
                    <Image
                      src="/images.jpg"
                      alt="Look 3"
                      width={800}
                      height={800}
                      className="w-full h-full border-2 object-cover"
                    />
                  </div>
                </div>
                <span className="flex items-end justify-end mt-1">
                  <Link href="/looks/streetCore">
                    <Button className="bg-black rounded-none w-25 h-6 md:h-8 md:px-6">
                      VIEW MORE
                    </Button>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StylistSays;
