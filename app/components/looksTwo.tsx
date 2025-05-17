import { Button } from "@/components/ui/button";
import Image from "next/image";

const LooksSection = () => {
  const productList = [
    {
      id: 1,
      image: "/assets/look-11.png",
      description:
        "Crisp and effortless, this pure cotton shirt from Mast & Harbour keeps it classic with a modern edge—perfect for everyday wear.",
    },
    {
      id: 2,
      image: "/assets/pant-22.png",
      description:
        "Clean and versatile, these slim-fit cotton twill trousers from H&M are built for comfort and easy styling all day long.",
    },
  ];

  return (
    <div className="pt-10 px-4 w-full max-w-[480px] mx-0">
      <h1 className="text-lg font-semibold text-left mb-1 font-boston">
        Look 1
      </h1>

      <div className="flex flex-row gap-3 w-full">
        {/* Left Column */}
        <div className="flex flex-col justify-between w-[70%] space-y-6">
          {/* Shirt Image */}
          <div className="relative w-full aspect-[3/4]  ">
            <Image
              src={productList[0].image}
              alt="Shirt"
              fill
              className="object-contain "
            />
          </div>

          {/* Pants Description + Button */}
          <div className="text-[12px] text-black font-thin leading-tight font-boston">
            <p>{productList[1].description}</p>
            <Button className="bg-black w-20 h-6 rounded-none text-white text-[12px] mt-4">
              Shop
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-between w-[70%] space-y-4">
          {/* Shirt Description */}
          <div className="text-[12px] text-black font-thin leading-tight mt-10 font-boston">
            <p>{productList[0].description}</p>
          </div>

          {/* Pants Image */}
          <div className="relative w-full aspect-[3/4] -mt-10 z-10">
            <Image
              src={productList[1].image}
              alt="Pants"
              fill
              className="object-contain "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LooksSection;
