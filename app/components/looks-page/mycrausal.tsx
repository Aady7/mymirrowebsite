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
      navigation={false} // ✅ enable navigation arrows
      loop={true}
       
      className="w-full"
    >
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
