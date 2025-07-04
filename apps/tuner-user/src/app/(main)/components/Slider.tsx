"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { getSurveyList } from "@/features/survey/services/survey";
import { useEffect, useState } from "react";
import { SurveyResponse } from "@/features/survey/types/surveyResponse";

export default function Slider() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await getSurveyList();

        const ongoing = res.data
          .filter((item) => item.is_active === "ongoing")
          .sort(
            (a, b) =>
              new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
          );

        setSurveys(ongoing);
      } catch (err) {
        console.error("설문 목록 가져오기 실패:", err);
      }
    };

    fetchSurveys();
  }, []);

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
        {surveys.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              onClick={() => router.push(`/survey/${item.id}`)}
              className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-md cursor-pointer"
            >
              <Image
                src={item.thumbnail_uri}
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
