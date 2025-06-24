"use client";

import { useParams } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

interface SimilarOutfit {
  outfit_data: {
    main_outfit_id: string;
    top: {
      id: string;
      title: string;
      image: string;
    };
    bottom: {
      id: string;
      title: string;
      image: string;
    };
  };
  similarity_score: number;
}

interface MyCarouselProps {
  similarOutfits: SimilarOutfit[];
}

const MyCarousel = ({ similarOutfits }: MyCarouselProps) => {
  const { id } = useParams();

  // Filter out current outfit if it exists in similarOutfits
  const filteredOutfits = similarOutfits.filter(outfit => outfit.outfit_data.main_outfit_id !== id);

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={12}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
      }}
      pagination={{ clickable: true }}
      navigation={true}
      loop={true}
      className="w-full max-w-none relative group mt-8"
    >
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          width: 25px !important;
          height: 25px !important;
          background: none !important;
          opacity: 0;
          transition: opacity 0.3s;
          top: 50% !important;
        }
        
        .swiper-button-next {
          right: -8px !important;
        }
        
        .swiper-button-prev {
          left: -8px !important;
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 14px !important;
          font-weight: bold;
          color: #333;
        }

        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 2;
        }
      `}</style>

      {filteredOutfits.map((outfit) => (
        <SwiperSlide key={outfit.outfit_data.main_outfit_id}>
          <Link href={`/looks/${outfit.outfit_data.main_outfit_id}`}>
            <div className="flex gap-2 h-[300px] ml-4 mr-4 mt-6">
              {/* Top garment */}
              <div className="flex-1 relative">
                <Image
                  src={outfit.outfit_data.top.image}
                  alt={outfit.outfit_data.top.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Bottom garment */}
              <div className="flex-1 relative">
                <Image
                  src={outfit.outfit_data.bottom.image}
                  alt={outfit.outfit_data.bottom.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyCarousel;
