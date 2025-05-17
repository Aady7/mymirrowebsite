import Image from "next/image";
import FashionTarot from "./fashionTarot";
import LooksSectionThree from "./looksThree";
import LooksSection from "./looksTwo";

const StylistSays = () => {
  return (
    <>
      <div>
        {/*Heading sectyion*/}
        <div>
          <div className="flex items-center justify-center mt-6">
            <h1 className=" font-thin text-3xl text-center">
              STYLIST SAYS
            </h1>
          </div>
        </div>
        {/*stylist section*/}
        <div className="p-3 mt-6">
          <div className="bg-black text-white border rounded-3xl p-6">
            {/* Text + Image */}
            <div className="flex flex-row items-center justify-between">
              <p className="font-thin text-xs leading-tight line-clamp-6">
                Ahan, your style journey starts with your
                <span className="text-red-800"> quiz</span> answers, layered
                with <span className="text-purple-500">AI </span>insights and{" "}
                <span className="text-yellow-400">stylist </span>
                expertise — all working together to tailor every look just for
                you.
              </p>
              <Image
                src="/assets/Group-12.png"
                alt="Group photo"
                width={116}
                height={105}
                className="object-contain ml-4 shrink-0"
              />
            </div>

            {/* White horizontal line */}
            <hr className="w-full border-t border-white mt-4" />

            {/* Heading and Paragraph */}
            <h1 className="text-sm font-thin  mt-2">COLOR ANALYSIS</h1>
            <p className="mt-2 leading-tight font-thin text-xs line-clamp-3">
              With your soft undertones and calm personality, light earthy tones
              and minimal pieces enhance your natural ease and elegance.
            </p>

            {/* Color Boxes */}
            <div className="flex gap-3 mt-7 mb-6">
              {/* Warm Beige */}
              <div
                className="w-20 h-35 rounded-none"
                style={{ backgroundColor: "#D8CAB8" }}
              ></div>
              {/* Muted Olive */}
              <div
                className="w-20 h-35 rounded-none"
                style={{ backgroundColor: "#A3A380" }}
              ></div>
              {/* Pale Terracotta */}
              <div
                className="w-20 h-35 rounded-none"
                style={{ backgroundColor: "#E5B299" }}
              ></div>
              {/* Stone Gray */}
              <div
                className="w-20 h-35 rounded-none"
                style={{ backgroundColor: "#BFBFBF" }}
              ></div>
              {/* Cream White */}
              <div
                className="w-20 h-35 rounded-none border"
                style={{ backgroundColor: "#FDF6EC" }}
              ></div>
            </div>
          </div>
        </div>

        {/*fashion taro card */}
        <FashionTarot />

        {/*curated looks just for you*/}
        <div className="p-2 mt-10">
          <div className="flex flex-col items-center justify-center space-y-1">
            {/* Heading in a fixed width to control centering */}
            <h1 className="font-['Boston']  text-lg text-left w-[290px]">
              CURATED LOOKS JUST FOR YOU
            </h1>

            {/* Paragraph aligned under "U" by padding-left */}
            <p className="font-thin text-xs pl-[10px] pr-[5px] w-[280px]">
              Handpicked outfit combinations tailored to your
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unique
              style profile
            </p>
          </div>

          {/*looks swction 1 images*/}
          <LooksSection/>

          {/*look section 2 images*/}
          <LooksSection/>

          {/*looks section 3 images*/}
          <LooksSectionThree/>
        </div>
      </div>
    </>
  );
};

export default StylistSays;
