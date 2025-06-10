"use client";

import { looksData } from "@/app/utils/lookData";
import { useParams } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ThreeImgGreed from "../three-image-greed";

const MyCarousel = () => {
  const { id } = useParams();
  // Convert looksData object to array and filter out current look
  const looks = Object.entries(looksData)
    .filter(([lookId]) => lookId !== id)
    .map(([lookId, look]) => ({ lookId, ...look })).slice(0,3);

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
      className="w-full relative group"
    >
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          width: 25px !important;
          height: 25px !important;
          background: none !important;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 12px !important;
          font-weight: bold;
          color: #333;
        }

        .swiper-button-next:active,
        .swiper-button-prev:active,
        .swiper-button-next:focus,
        .swiper-button-prev:focus {
          background: none !important;
        }

        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }
      `}</style>
      {looks.map(({ lookId, ...look }) => (
        <SwiperSlide key={lookId}>
          <div className="p-1">
            <ThreeImgGreed look={look} lookId={lookId} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyCarousel;
