"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LookSection from "./twoImg";

const MyCarousel = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination,Autoplay]}
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
      className="w-full "
    >
      {/* Replace with your full components */}
      {Array.from({ length: 10 }).map((_, index) => (
        <SwiperSlide key={index}>
          <div className=" p-1">
            <LookSection />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MyCarousel;
