"use client";

import Image from "next/image";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";
import { useEffect, useState } from "react";
import { surveyList } from "@/features/survey/services/survey";

const statusTextMap: Record<
  SurveyResponse["is_active"],
  "예정" | "진행중" | "종료"
> = {
  upcoming: "예정",
  ongoing: "진행중",
  closed: "종료",
};

export default function Card({
  status,
}: {
  status: "all" | "ongoing" | "closed";
}) {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await surveyList();
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
          <div className="relative w-full">
            {item.music?.thumbnail_uri ? (
              <Image
                src={item.music.thumbnail_uri}
                alt={`card ${item.id}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full aspect-[3/4] object-cover"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                썸네일 없음
              </div>
            )}
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
              {item.music.artist} - {item.music.music_title}
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
