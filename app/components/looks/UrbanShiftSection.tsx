import { looksData } from "@/app/utils/lookData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaCartArrowDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import StarRating from "../starRating";
import SimilarOutfitsCarousel from "./SimilarOutfitsCarousel";
import { supabase } from "@/lib/supabase";

const UrbanShift = async() => {
  const lookData = looksData.streetCore;
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <>
      {/* Header - Removed title and look number */}
      {/* <div className="flex items-center justify-center mb-2 mt-6">
        <span className="text-[26px] font-thin">{lookData.title}</span>
        <hr className="border-black border-1 w-[30px] mx-3" />
        <span className="text-[26px] font-thin">
          LOOK {lookData.lookNumber}
        </span>
      </div>

      <hr className="border-t-1 border-black w-[90%] mx-auto mb-6" /> */}

      {/* Product List */}
      <div>
        {lookData.products.map((product, index) => (
          <div
            key={index}
            className={`flex flex-col lg:flex-row w-full gap-6 px-4 md:px-6 lg:px-8 mb-10 ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="relative w-full lg:w-[55%] h-[260px] lg:h-[300px] overflow-hidden">
              <Image
                src={product.images.background}
                alt="Background"
                fill
                className="object-cover absolute z-0"
              />
              <Image
                src={product.images.foreground}
                alt="Product"
                fill
                className="object-contain z-10"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between lg:w-[40%] py-4">
              <div>
                <h1 className="text-[10px] tracking-normal font-thin mb-2">
                  {product.brandName}
                </h1>

                {/* Description as bullets */}
                <ul className="list-disc list-inside w-[85%] font-[Boston] text-[12px] font-light leading-normal mb-2">
                  {product.description
                    .split(". ")
                    .filter((point) => point.trim() !== "")
                    .map((point, i) => (
                      <li key={i}>{point.trim().replace(/\.$/, "")}.</li>
                    ))}
                </ul>

                <h4 className="flex text-black font-[Boston] text-[20px] font-semibold leading-normal [font-variant:all-small-caps] mb-2">
                  <FaIndianRupeeSign className="h-4 mt-[2px] mr-1" />
                  {product.price}
                </h4>

                {/* Sizes */}
                <div className="flex flex-row gap-4 mb-3 items-center">
                  <h4 className="text-black font-[Boston] text-[14px] font-light [font-variant:all-small-caps]">
                    SIZE
                  </h4>
                  <ul className="flex flex-row gap-3">
                    {product.sizes.map((size, idx) => (
                      <Button
                        key={idx}
                        className="text-black font-[Boston] border-2 text-[14px] font-light [font-variant:all-small-caps]"
                      >
                        {size}
                      </Button>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-row gap-2 mt-2">
                <button className="flex items-center h-6 w-10 justify-center bg-[#007e90] hover:bg-[#006d7d] text-white rounded-none transition-colors">
                  <FaCartArrowDown className="w-3" />
                </button>
                <Link href="/looks/texture">
                  <button className="bg-[#007e90] hover:bg-[#006d7d] h-6 px-4 text-white text-xs rounded-none transition-colors">
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div>
        <h1 className="flex font-thin text-2xl font-['Boston'] text-left mt-6 mx-6">
          <FaIndianRupeeSign className="h-5 mt-2 mr-1" /> {lookData.totalPrice}
        </h1>
      </div>

  
      {/* Buy Now / Add to Cart */}
      <div className="flex gap-4 mt-6 w-[90%] mx-auto">
        <button className="flex-[0.35] h-9 text-sm bg-[#007e90] hover:bg-[#006d7d] text-white rounded-none transition-colors">
          Buy Now
        </button>
        <Link href="/cart" className="flex-[0.65]">
          <button className="w-full h-9 text-sm bg-[#007e90] hover:bg-[#006d7d] text-white rounded-none transition-colors">
            Add To Cart
          </button>
        </Link>
      </div>

      {/* Divider */}
      <hr className="border-t border-black w-[90%] mx-auto mt-6 mb-6" />

      {/* Description */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        <h1
          className="text-xs text-black tracking-wide font-thin mb-4"
          style={{ fontFamily: "Boston" }}
        >
          DESCRIPTION
        </h1>
        <p
          className="text-[14px] tracking-wide font-light leading-5"
          style={{ fontFamily: "Boston" }}
        >
          {lookData.description.mainText}
          <br />
          <br />
          {lookData.description.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <Image
                src="/assets/blackdog.png"
                alt="dot"
                width={8}
                height={8}
                className="rounded-full"
              />
              <span className="text-xs uppercase">{feature}</span>
            </div>
          ))}
          <br />
          <h1
            className="text-md text-black tracking-wide font-semibold mb-1"
            style={{ fontFamily: "Boston" }}
          >
            WHY THIS LOOK WAS PICKED FOR YOU
          </h1>
          <br />
          {lookData.description.whyPicked}
        </p>
         {/*rating */}
          {user && (
            <StarRating productId={lookData.lookNumber.toString()} productType="look" />
          )}


        <hr className="border-t-1 border-black w-[98%] mx-auto mt-8" />
      </div>
      
      


      {/* You May Also Like */}
      <div className="text-left px-[24px] md:px-6 lg:px-8 mt-2 mb-[30px]">
        <h1 className="font-thin" style={{ fontSize: "20px", fontWeight: 100 }}>
          YOU MAY ALSO LIKE
        </h1>
      </div>

      {/* Carousel */}
              <SimilarOutfitsCarousel />
    </>
  );
};

export default UrbanShift;
