import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import FashionTarot from "./fashionTarot";
import Stylist from "./stylist";
import { looksData } from "@/app/utils/lookData";

const StylistSays = () => {
  return (
    <>
      <div className="">
        {/*Heading sectyion*/}
        <div>
          <div className="flex items-center justify-center mt-4">
            <h1 className=" text-black font-[Boston] text-[30px] not-italic font-normal leading-normal [font-variant:all-small-caps]  text-3xl text-center">
              STYLIST SAYS
            </h1>
          </div>
        </div>
        {/*Stylist section*/}

        <Stylist />

        {/*fashion taro card */}
        <FashionTarot />

        {/*curated looks just for you*/}
        <div className="p-2 mt-10">
          <div className="flex flex-col items-center justify-center space-y-1">
            {/* Heading in a fixed width to control centering */}
            <h1 className="text-center font-[Boston] text-[18px] not-italic font-normal leading-normal  w-[290px]">
              CURATED LOOKS JUST FOR YOU
            </h1>

            {/* Paragraph aligned under "U" by padding-left */}
            <p className="font-[Boston] text-[14px] not-italic font-normal leading-normal pl-[15px] pr-[2px] w-[280px]">
              Handpicked outfit combinations tailored to
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;your
              unique style profile
            </p>
          </div>

          {/*looks swction 1 images*/}
          <div className="flex flex-row gap-1 mt-8">
            {/* LEFT: LOOK 1 */}
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-semibold mb-1">LOOK 1</h3>
              <div className="w-full h-[300px]">
                <Image
                  src="/images.jpg"
                  alt="Look 1"
                  width={800}
                  height={800}
                  className="w-full h-full border-2 object-cover"
                />
              </div>
            </div>

            {/* RIGHT: URBAN SHIFT */}
            <div className="flex flex-col w-1/2">
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
                    className="w-full h-full border-2 object-cover "
                  />
                </div>
              </div>
            </div>
          </div>
          <span className="flex items-end justify-end mt-1">
            <Link href="/looks/urbanShift">
              <Button className="bg-black rounded-none w-25 h-5">
                {" "}
                VIEW MORE
              </Button>
            </Link>
          </span>

          {/*look section 2 images*/}
          <div className="flex flex-row gap-1 mt-10">
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-semibold mb-1">LOOK 2</h3>
              <div className="w-full h-[300px]">
                <Image
                  src="/images.jpg"
                  alt="Look 1"
                  width={800}
                  height={800}
                  className="w-full h-full border-2 object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-semibold mb-1 text-right">
                URBAN SHIFT
              </h3>
              <div className="w-full h-[300px]">
                <Image
                  src="/images.jpg"
                  alt="Look 1"
                  width={800}
                  height={800}
                  className="w-full h-full border-2 object-cover"
                />
              </div>
            </div>
          </div>
          <span className="flex items-end justify-end mt-1">
            <Link href="/looks/minimalElegance">
              <Button className="bg-black rounded-none w-25 h-5">
                {" "}
                VIEW MORE
              </Button>
            </Link>
          </span>

          {/*looks section 3 images*/}
          <div className="mt-6">
            <div className="flex flex-col w-full">
              <h3 className="text-sm font-semibold mb-1">LOOK 3</h3>
              <div className="w-full h-[300px]">
                <Image
                  src="/images.jpg"
                  alt="Look 1"
                  width={800}
                  height={800}
                  className="w-full h-full border-2 object-cover"
                />
              </div>
            </div>
            <span className="flex items-end justify-end mt-1">
              <Link href="/looks/streetCore">
                <Button className="bg-black rounded-none w-25 h-5">
                  {" "}
                  VIEW MORE
                </Button>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StylistSays;
