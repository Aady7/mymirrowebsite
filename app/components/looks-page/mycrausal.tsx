"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LookSection from "../twoImg";
import { looksData } from "@/app/utils/lookData";
import { useParams } from "next/navigation";

const MyCarousel = () => {
  const { id } = useParams();
  // Convert looksData object to array and filter out current look
  const looks = Object.entries(looksData)
    .filter(([lookId]) => lookId !== id)
    .map(([lookId, look]) => ({ lookId, ...look }));

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={16}
      slidesPerView={1}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      }}
      pagination={{ clickable: true }}
      className="w-full"
    >
      {looks.map(({ lookId, ...look }) => (
        <SwiperSlide key={lookId}>
          <div className="p-1">
            <LookSection look={look} lookId={lookId} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyCarousel;
