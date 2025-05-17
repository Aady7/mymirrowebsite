import { Button } from "@/components/ui/button";
import Image from "next/image";

const LooksSectionThree = () => {
  const productList = [
    {
      id: 1,
      image: "/assets/look-1.png",
      description:
        "Clean and crisp — a white shirt that defines minimalist style for any occasion.",
    },
    {
      id: 2,
      image: "/assets/look-2.png",
      description:
        "Structured and confident — this blazer offers a sleek silhouette for bold looks.",
    },
    {
      id: 3,
      image: "/assets/look-1.png",
      description:
        "A modern twist on relaxed denim. Comfort and edge combined for everyday wear.",
    },
  ];

  return (
    <div className="pt-10 px-4 space-y-10 max-w-[640px] mx-auto">
      <h1 className="text-lg font-semibold mb-4">Look Collection</h1>

      {productList.map((product, index) => (
        <div
          key={product.id}
          className={`flex flex-row w-full items-start gap-4 ${
            index % 2 === 1 ? "flex-row-reverse" : ""
          }`}
        >
          {/* Image + background */}
          <div className="relative w-1/2 aspect-[3/4] rounded-lg overflow-hidden">
            <Image
              src="/assets/looks-1-back.png"
              alt="BG"
              fill
              className="absolute object-cover z-0"
            />
            <Image
              src={product.image}
              alt={`Look ${product.id}`}
              fill
              className="object-contain z-10 p-4"
            />
          </div>

          {/* Description */}
          <div className="w-1/2 text-xs text-black font-thin leading-relaxed flex flex-col justify-between h-full">
            <p>{product.description}</p>

            {/* Only show button for the last block */}
            {index === productList.length - 1 && (
              <Button className="bg-black w-20 h-7 text-white text-xs mt-4 self-start">
                Shop
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LooksSectionThree;
