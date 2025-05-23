import Image from "next/image";
import Link from "next/link";
import { FaCartArrowDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import MyCarousel from "./mycrausal";

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
              <h1 className="text-lg flex tracking-normal items-center justify-center font-thin  mb-2">
                Brand Name
              </h1>
              <p className=" w-2/3 mx-8  font-[Boston] text-[12px] not-italic font-light leading-normal   mb-4 ">
                The Glitchez Vivid Edge Shirt pairs bold prints with a relaxed
                cut—effortless and unapologetically you.
              </p>
              <h4 className="flex text-black px-8 font-[Boston] text-[20px] not-italic font-semibold leading-normal [font-variant:all-small-caps]">
                <FaIndianRupeeSign className="h-4 mt-2"  /> 2,300
              </h4>
              <div className="flex flex-row gap-6 px-8">
                <h4 className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                  SIZE
                </h4>
                <ul className="flex flex-row gap-4">
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    S
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    M
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    L
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    XL
                  </li>
                </ul>
              </div>
            </div>

            {/* Button Row - force row on all screen sizes */}
            <div className="flex flex-row gap-1 mt-4 mx-3">
              <button className="flex items-center h-6 w-10 justify-center gap-2 bg-black text-white rounded-none">
                <FaCartArrowDown className="w-3" />
              </button>
              
          <Link href="/looks/texture"><button   className=" bg-black h-6 w-25 text-white text-xs rounded-none">
                View Product
              </button>
              </Link>
              
            </div>
          </div>
        </div>

        {/* right image with left content */}
        <div className="flex flex-row lg:flex-row w-full mt-8 gap-2">
          {/* Left side: Text Content (now comes first) */}
          <div className="flex flex-col h-[200px] w-[60%] lg:w-[20%]">
            {/* Text */}
            <div>
              <h1 className="text-lg flex m-4 items-center justify-center tracking-wide font-light mb-3 ">
                 Brand Name
              </h1>
              <p className="text-sm w-2/3 flex items-center mx-8 justify-between  font-[Boston] text-[12px] not-italic font-light leading-normal  mb-2">
                Function meets fashion. These split trousers go from full-length
                to street-ready—built to move.
              </p>
              <h4 className=" flex text-black px-8 font-[Boston] text-[20px] not-italic font-semibold leading-normal [font-variant:all-small-caps]">
                 <FaIndianRupeeSign className="h-4 mt-2"  />2,300
              </h4>
              <div className="flex flex-row gap-6 px-8">
                <h4 className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                  SIZE
                </h4>
                <ul className="flex flex-row gap-4">
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    S
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    M
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    L
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    XL
                  </li>
                </ul>
              </div>
            </div>

            {/* Button Row - same as before */}
            <div className="flex flex-row gap-1 mt-3 mx-3">
               <button className="flex items-center h-6 w-10 justify-center gap-2 bg-black text-white rounded-none">
                <FaCartArrowDown className="w-3" />
              </button>
              
              <Link href="/looks/texture"> 
             <button  className="bg-black h-6 w-25 text-white text-xs rounded-none">
                View Product
              </button>
              </Link>
             
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
              <h1 className="text-md flex items-center justify-center font-thin mb-2 ">
                Adidas Samba OG
              </h1>
              <p className="  font-[Boston] text-[12px] not-italic font-light leading-normal w-2/3 mx-5  mb-1   ">
                Timeless kicks with attitude. The Samba OG fuses vintage sport
                with streetwear cool—every step makes a statement.
              </p>
              <h4 className="flex text-black px-5 font-[Boston] text-[20px] not-italic font-semibold leading-normal [font-variant:all-small-caps]">
                 <FaIndianRupeeSign className="h-4 mt-2" /> 2,300
              </h4>
              <div className="flex flex-row gap-6 px-5">
                <h4 className="  font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                  SIZE
                </h4>
                <ul className="flex flex-row gap-4">
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    S
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    M
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    L
                  </li>
                  <li className="text-black font-[Boston] text-[14px] not-italic font-light leading-normal [font-variant:all-small-caps]">
                    XL
                  </li>
                </ul>
              </div>
            </div>

            {/* Button Row - force row on all screen sizes */}
            <div className="flex flex-row gap-1 mt-2 mx-3 ">
              <button className="flex items-center h-6 w-10 justify-center gap-2 bg-black text-white rounded-none">
                <FaCartArrowDown className="w-3" />
              </button>
             <Link href="/looks/texture">  
             <button className=" bg-black h-6 w-25 text-white text-xs rounded-none">
                View Product
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/*price show 100 */}
        <div>
          <h1 className="flex font-thin text-2xl font-['Boston'] text-left mt-8 mx-6">
            <FaIndianRupeeSign className="h-5 mt-2" /> 6900
          </h1>
        </div>

        {/* button section buy now */}
        <div className="flex flex-row gap-3 mt-6 mx-8 mr-3 ">
          <button className="flex items-center h-7 w-23 justify-center text-xs gap-2 bg-black text-white rounded-none">
            Buy Now
          </button>
          <Link href="/cart">
            <button className=" bg-black h-7 w-60 text-white text-xs rounded-none">
              Add To Cart
            </button>
          </Link>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t-1 border-black w-[92%] mx-auto f mt-8" />
      </div>

      {/*Description */}
      <div className="px-4 py-6">
        <h1
          className="text-lg text-black tracking-wide font-thin mb-4"
          style={{ fontFamily: "Boston" }}
        >
          DESCRIPTION
        </h1>
        <p
          className="text-[14px] tracking-wide font-light leading-5 "
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
          <br />
          <div className="flex items-center gap-2">
            <Image
              src="/assets/blackdog.png"
              alt="dot"
              width={8}
              height={8}
              className="rounded-full"
            />{" "}
            <span className="text-xs uppercase">
              Shirt: Bold print that brings movement and energy
            </span>
          </div>
          <br />
          <div className="flex items-center gap-2">
            <Image
              src="/assets/blackdog.png"
              alt="dot"
              width={8}
              height={8}
              className="rounded-full"
            />{" "}
            <span className="text-xs uppercase">
              Trousers: Convertible, breathable, and flexible.
            </span>
          </div>
          <br />
          <div className="flex items-center gap-2">
            <Image
              src="/assets/blackdog.png"
              alt="dot"
              width={8}
              height={8}
              className="rounded-full"
            />{" "}
            <span className="text-xs uppercase">
              Shoes: Timeless silhouette with street-ready traction.
            </span>
          </div>
          <br />
          <br />
          <h1
            className="text-md text-black tracking-wide font-semibold mb-1"
            style={{ fontFamily: "Boston" }}
          >
            WHY THIS LOOK WAS PICKED FOR YOU
          </h1>
          <br />
          You lean toward bold yet balanced styles with streetwear influences.
          This look keeps you versatile and expressive.
        </p>
        {/* Horizontal Line */}
        <hr className="border-t-1 border-black w-[98%] mx-auto f mt-8" />
      </div>

      <div className="text-center mt-2 mb-2">
        <h1
          className="font-thin text-left px-4"
          style={{ fontSize: "20px", fontWeight: 100 }}
        >
          YOU MAY ALSO LIKE
        </h1>
      </div>

      <MyCarousel />
    </>
  );
};

export default UrbanShift;
