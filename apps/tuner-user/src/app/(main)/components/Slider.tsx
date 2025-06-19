"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const slideItems = [
  { id: 1, image: "/images/slide1.jpeg" },
  { id: 2, image: "/images/slide2.jpeg" },
  { id: 3, image: "/images/slide3.jpeg" },
  { id: 4, image: "/images/slide4.jpeg" },
];

export default function Slider() {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1.3}
        spaceBetween={12}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {slideItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="w-full h-48 relative overflow-hidden rounded-xl shadow-md">
              <Image
                src={item.image}
                alt={`slide ${item.id}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
