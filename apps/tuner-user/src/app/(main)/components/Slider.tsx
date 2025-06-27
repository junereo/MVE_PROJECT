"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const slideItems = [
  { id: 1, thumbnail_url: `https://i.ytimg.com/vi/LBHVOiw274A/hqdefault.jpg` },
  { id: 2, thumbnail_url: `https://i.ytimg.com/vi/08h8u8Z9iJQ/hqdefault.jpg` },
  { id: 3, thumbnail_url: `https://i.ytimg.com/vi/UDyPp9bkfD0/hqdefault.jpg` },
  { id: 4, thumbnail_url: `https://i.ytimg.com/vi/ppudgIu2TaM/hqdefault.jpg` },
];

export default function Slider() {
  return (
    <div className="overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1.2}
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
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-md">
              <Image
                src={item.thumbnail_url}
                alt={`slide YouTube Thumbnail ${item.id}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 600px"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
