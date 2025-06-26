import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ProductLooksSection from "../looks/ProductLooksSection";
import LookCard from "../looks/LookCard";//twoImg

export default function TexturePrint() {
  return (
    <div className="w-full px-4 py-1 max-w-md mx-auto font-['Boston']">
      {/* Header */}
      <div className="text-center mb-2">
        <h1
          className=" font-thin"
          style={{ fontSize: "25px", fontWeight: 300 }}
        >
          TEXTURE PRINT T-SHIRT
        </h1>
      </div>

      {/* Horizontal Line */}
      <hr className="border border-black mb-4" />

      {/* Image with background */}
      <div className="relative w-70% h-[350px] mt-6 overflow-hidden">
        {/* Background image */}
        <Image
          src="/assets/looks-1-back.png"
          alt="Background"
          fill
          className="object-cover absolute z-0"
        />

        {/* upper image */}
        <Image
          src="/assets/tex-2.png"
          alt="Texture Print"
          fill
          className="object-contain z-10 p-0"
        />
      </div>

      {/*Price section*/}
      <div>
        <div className="flex mt-8 items-center gap-1">
          <FaIndianRupeeSign className="text-lg" />
          <h1 className="text-lg font-bold">2,300</h1>
        </div>
        <div className="w-full p-2 mt-4">
          <h6 className="text-left font-thin text-xs">SIZE</h6>
        </div>
        <div className="flex pr-1 items-center mt-8 gap-4">
          <Button className="bg-[#007e90] hover:bg-[#006d7d] rounded-none text-white w-30 h-8 text-xs transition-colors">
            BUY NOW
          </Button>
          <Button className="bg-[#007e90] hover:bg-[#006d7d] rounded-none text-white w-48 h-8 text-xs transition-colors">
            ADD TO CART
          </Button>
        </div>
      </div>

      {/* Horizontal Line */}
      <hr className="border-thin w-[100%] border-black mt-7" />

      <div>
        <div className="w-full mt-8">
          <h1 className="font-[Boston] font-thin text-sm text-left">
            DESCRIPTION
          </h1>
        </div>

        <div className="w-full mt-2">
          <p className="text-xs font-thin font-[Boston] text-left leading-tight">
            Clean cuts. Confident energy. Curated for someone who loves to stand
            out in subtle, stylish ways. The Vivid Edge shirt adds just enough
            print to turn heads, while the convertible trousers adapt to your
            day—from plans to spontaneity. Grounded with the iconic Adidas
            Sambas, this look speaks to your adventurous, street-smart
            personality. You value comfort, but never at the cost of edge—and
            that’s exactly why this one’s for you.
          </p>
        </div>
      </div>
      {/* Horizontal Line */}
      <hr className="border-thin w-[100%] border-black mt-7" />

      {/*Style with it*/}
      <div className="text-center mt-8 ">
        <h1 className="font-thin" style={{ fontSize: "20px", fontWeight: 100 }}>
          STYLE IT WITH
        </h1>
      </div>

      {/*lookThreeSection*/}
                      <ProductLooksSection currentProductId={1} />

      {/* Horizontal Line */}
      <hr className="border-thin w-[100%] border-black" />

      {/*you may also like section]*/}
      <div>
        <div className="text-center mt-8 mb-2">
          <h1
            className="font-thin"
            style={{ fontSize: "20px", fontWeight: 100 }}
          >
            YOU MAY ALSO LIKE
          </h1>
        </div>

        {/*two images*/}
        <div className="flex flex-row mt-6 gap-10 justify-center flex-wrap">
          {/* Product Card 1 */}
          <div className=" flex-col items-center  w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300} // increased height
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-2">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69</p>
          </div>

          {/* Product Card 2 */}
          <div className=" flex-col items-center w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300} // match height here too
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-2">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69</p>
          </div>
        </div>

        {/*two images*/}
        <div className="flex flex-row mt-6 gap-10 justify-center flex-wrap">
          {/* Product Card 1 */}
          <div className=" flex-col items-center  w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300} // increased height
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-4">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69 </p>
          </div>

          {/* Product Card 2 */}
          <div className=" flex-col items-center w-[140px]">
            <Image
              src="/assets/looks-1-back.png"
              alt="Flora Print Shirt"
              width={140}
              height={300} // match height here too
              className="object-cover h-[226px]"
            />
            <p className="text-xs text-left mt-4">FLORA PRINT SHIRT</p>
            <p className="text-xs mt-4 font-thin">$ 69</p>
          </div>
        </div>
      </div>
    </div>
  );
}
