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
