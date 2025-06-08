import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const ThreeImgGreed = ({ look, lookId }) => {
  return (
    <div className="md:col-span-2 lg:col-span-1 p-8">
      <div className="flex flex-row gap-1 mt-8 md:mt-0">
        {/* LEFT: LOOK ID */}
        <div className="flex flex-col w-1/2 md:w-full">
          <h3 className="text-sm font-semibold mb-1 md:text-lg">
            LOOK {look.lookNumber}
          </h3>
          <div className="w-full h-[300px] md:h-[400px]">
            <Image
              src={look.products?.[0]?.images?.foreground ?? "/fallback.jpg"}
              alt={`Look ${look.lookNumber}`}
              width={800}
              height={800}
              className="w-full h-full border-2 object-cover"
            />
          </div>
        </div>

        {/* RIGHT: Urban shift / variations (only on mobile) */}
        <div className="flex flex-col w-1/2 md:hidden">
          <h3 className="text-sm font-semibold text-right mb-1">
            {look.title}
          </h3>
          <div className="flex flex-col gap-1 h-[300px]">
            <div className="flex-1">
              <Image
                src={look.products?.[1]?.images?.foreground ?? "/fallback.jpg"}
                alt="Urban 1"
                width={800}
                height={400}
                className="w-full h-full border-2 object-cover"
              />
            </div>
            <div className="flex-1">
              <Image
                src={look.products?.[2]?.images?.foreground ?? "/fallback.jpg"}
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
        <Link href={`/looks/${lookId}`}>
          <Button className="bg-black rounded-none w-25 h-6 md:h-8 md:px-6">
            VIEW MORE
          </Button>
        </Link>
      </span>
    </div>
  );
};

export default ThreeImgGreed;
