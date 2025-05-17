import Image from "next/image";
import { FaCartArrowDown } from "react-icons/fa";
import LooksSection from "./looksTwo";

const UrbanShift = () => {
  return (
    <>
      <div>
        <div className="flex items-center justify-center mb-2">
          <span className="text-[26px] font-thin">URBAN SHIFT</span>
          <hr className="border-black border-1 w-[30px] mx-3" />
          <span className="text-[26px] font-thin">LOOK 1</span>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t-1 border-black w-[90%] mx-auto" />
      </div>

      <div>
        {/* left image with right content */}
        <div className="flex flex-row lg:flex-row w-full mt-8 gap-2 ">
          {/* Left side: Image container */}
          <div className="relative w-[80%] h-[230px] lg:w-[70%] overflow-hidden">
            {/* Background image */}
            <Image
              src="/assets/looks-1-back.png"
              alt="Background"
              fill
              className="object-cover  absolute z-0"
            />

            {/* Foreground image */}
            <Image
              src="/assets/tex-2.png"
              alt="Texture Print"
              fill
              className="object-contain  z-10"
            />
          </div>

          {/* Right side: Content */}
          <div className="flex flex-col  h-[200px] w-[60%] lg:w-[20%]">
            {/* Text */}
            <div>
              <h1 className="text-xs flex items-center justify-center font-thin  mb-2">
                Brand Name
              </h1>
              <p
                className="text-xs w-2/3 mx-5  text-black text-[10px]  mb-6 "
                style={{ fontFamily: "Boston", fontWeight: 300 }}
              >
                The Glitchez Vivid Edge Shirt fuses bold prints with a laid-back
                cut, bringing street-smart energy to your everyday fit. Clean
                lines meet chaotic charm—effortless, yet unmistakably you.
              </p>
            </div>

            {/* Button Row - force row on all screen sizes */}
            <div className="flex flex-row gap-1 mt-4 mr-3">
              <button className="flex items-center h-6 w-10 justify-center gap-2 bg-black text-white rounded-none">
                <FaCartArrowDown className="w-3" />
              </button>
              <button className=" bg-black h-6 w-50 text-white text-xs rounded-none">
                View Product
              </button>
            </div>
          </div>
        </div>

        {/* right image with left content */}
        <div className="flex flex-row lg:flex-row w-full mt-8 gap-2">
          {/* Left side: Text Content (now comes first) */}
          <div className="flex flex-col h-[200px] w-[60%] lg:w-[20%]">
            {/* Text */}
            <div>
              <h1 className="text-sm flex items-center justify-center font-thin mb-4">
                Brand
              </h1>
              <p
                className="text-xs w-2/3 flex items-center mx-5 justify-between text-black text-[10px] mb-6"
                style={{
                  fontFamily: "Boston",
                  fontWeight: 50,
                }}
              >
                The Glitchez Vivid Edge Shirt fuses bold prints with a laid-back
                cut, bringing street-smart energy to your everyday fit. Clean
                lines meet chaotic charm—effortless, yet unmistakably you.
              </p>
            </div>

            {/* Button Row - same as before */}
            <div className="flex flex-row gap-1 mt-4 mx-3">
              <button className="flex items-center h-6 w-10 justify-center gap-2 bg-black text-white rounded-none">
                <FaCartArrowDown className="w-3" />
              </button>
              <button className="bg-black h-6 w-50 text-white text-xs rounded-none">
                View Product
              </button>
            </div>
          </div>

          {/* Right side: Image container (now comes after text) */}
          <div className="relative w-[80%] h-[230px] lg:w-[70%] overflow-hidden">
            {/* Background image */}
            <Image
              src="/assets/looks-1-back.png"
              alt="Background"
              fill
              className="object-cover absolute z-0"
            />

            {/* Foreground image */}
            <Image
              src="/assets/pant-2.png"
              alt="Texture Print"
              fill
              className="object-contain z-10"
            />
          </div>
        </div>

        {/* left image with right content */}
        <div className="flex flex-row lg:flex-row w-full mt-8 gap-2 ">
          {/* Left side: Image container */}
          <div className="relative w-[80%] h-[230px] lg:w-[70%] overflow-hidden">
            {/* Background image */}
            <Image
              src="/assets/looks-1-back.png"
              alt="Background"
              fill
              className="object-cover  absolute z-0"
            />

            {/* Foreground image */}
            <Image
              src="/assets/shooes.png"
              alt="Texture Print"
              fill
              className="object-contain  z-10"
            />
          </div>

          {/* Right side: Content */}
          <div className="flex flex-col  h-[200px] w-[60%] lg:w-[20%]">
            {/* Text */}
            <div className="">
              <h1 className="text-sm flex items-center justify-center font-thin mb-5 mt-2">
                Adidas Samba OG
              </h1>
              <p
                className="text-xs w-2/3 mx-5 text-black text-[10px]  mb-6 "
                style={{ fontFamily: "Boston", fontWeight: 50 }}
              >
                The Glitchez Vivid Edge Shirt fuses bold prints with a laid-back
                cut, bringing street-smart energy to your everyday fit. Clean
                lines meet chaotic charm—effortless, yet unmistakably you.
              </p>
            </div>

            {/* Button Row - force row on all screen sizes */}
            <div className="flex flex-row gap-1 mt-2 mr-3">
              <button className="flex items-center h-6 w-10 justify-center gap-2 bg-black text-white rounded-none">
                <FaCartArrowDown className="w-3" />
              </button>
              <button className=" bg-black h-6 w-50 text-white text-xs rounded-none">
                View Product
              </button>
            </div>
          </div>
        </div>

        {/*price show 100 */}
        <div>
          <h1 className="font-thin text-2xl font-['Boston'] text-left mt-8 mx-6">
            $ 100
          </h1>
        </div>

        {/* button section buy now */}
        <div className="flex flex-row gap-3 mt-6 mx-4 mr-3 ">
          <button className="flex items-center h-7 w-23 justify-center text-xs gap-2 bg-black text-white rounded-none">
            Buy Now
          </button>
          <button className=" bg-black h-7 w-60 text-white text-xs rounded-none">
            Add To Cart
          </button>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t-1 border-black w-[92%] mx-auto f mt-8" />
      </div>

      {/*Description */}
      <div className="px-4 py-6">
        <h1
          className="text-lg text-black font-thin mb-4"
          style={{ fontFamily: "Boston" }}
        >
          DESCRIPTION
        </h1>
        <p
          className="text-[12px] text-black font-thin leading-normal"
          style={{ fontFamily: "Boston" }}
        >
          Clean cuts. Confident energy. Curated for someone who loves to stand
          out in subtle, stylish ways. The Vivid Edge shirt adds just enough
          print to turn heads, while the convertible trousers adapt to your
          day—from plans to spontaneity. Grounded with the iconic Adidas Sambas,
          this look speaks to your adventurous, street-smart personality. You
          value comfort, but never at the cost of edge—and that’s exactly why
          this one’s for you.
          <br />
          <br />
          <br/>
          .
          <br/>
          <br/>
          .
          <br/>
          <br/>
          .
          <br/>
          <br/>
          You lean toward bold yet balanced styles with streetwear influences.
          This look keeps you versatile and expressive.
        </p>
        {/* Horizontal Line */}
        <hr className="border-t-1 border-black w-[98%] mx-auto f mt-8" />
      </div>

       <div className="text-center mt-6 mb-2">
          <h1
            className="font-thin"
            style={{ fontSize: "20px", fontWeight: 100 }}
          >
            YOU MAY ALSO LIKE
          </h1>
        </div>

        <LooksSection/>



    </>
  );
};

export default UrbanShift;
