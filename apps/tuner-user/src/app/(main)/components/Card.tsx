"use client";

import Image from "next/image";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";
import { useEffect, useState } from "react";
import { getSurveyList } from "@/features/survey/services/survey";

export default function Card({
  status,
}: {
  status: "all" | "ongoing" | "closed";
}) {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await getSurveyList();
        const sorted = res.data.sort((a: SurveyResponse, b: SurveyResponse) => {
          return (
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
          );
        });

        const filtered: SurveyResponse[] =
          status === "all"
            ? sorted
            : sorted.filter(
                (item: SurveyResponse) => item.is_active === status
              );

        setSurveys(filtered);
      } catch (err) {
        console.error("설문 목록 가져오기 실패:", err);
      }
    };

    fetchSurveys();
  }, [status]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {surveys.map((item) => (
        <div
          key={item.id}
          className="rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden"
        >
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={item.thumbnail_uri}
              alt={`card ${item.id}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-3 space-y-1">
            <div className="flex justify-between">
              <p className="text-base font-semibold text-gray-900 truncate">
                {item.survey_title}
              </p>
              <p className="text-xs sm:text-sm text-orange-500 font-medium">
                🎁 {item.reward_amount} STK
              </p>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {item.artist} - {item.music_title}
            </p>
            <p className="text-xs text-gray-400">{`${item.start_at
              .slice(2, 10)
              .replace(/-/g, ".")} - ${item.end_at
              .slice(2, 10)
              .replace(/-/g, ".")}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
