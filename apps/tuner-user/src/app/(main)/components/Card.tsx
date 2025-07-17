"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";
import { useEffect, useState } from "react";
import { getSurveyList } from "@/features/survey/services/survey";
import { SurveyTypeEnum } from "@/features/survey/types/enums";

export default function Card({
  active,
  status,
}: {
  active: "all" | "ongoing" | "closed";
  status: "draft" | "complete";
}) {
  const router = useRouter();
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
          active === "all" && status === "complete"
            ? sorted
            : sorted.filter(
                (item: SurveyResponse) =>
                  item.is_active === active && item.status === status
              );

        setSurveys(filtered);
      } catch (err) {
        console.error("설문 목록 가져오기 실패:", err);
      }
    };

    fetchSurveys();
  }, [active, status]);

  return surveys.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 w-full col-span-2">
      <Image
        src="/images/empty-survey.png"
        alt="설문 없음"
        width={96}
        height={96}
        className="mb-4"
      />
      <p className="text-sm">
        {active === "ongoing"
          ? "진행중인 설문이 없습니다."
          : active === "closed"
          ? "종료된 설문이 없습니다."
          : "설문이 없습니다."}
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4">
      {surveys.slice(0, 4).map((item) => (
        <div
          key={item.id}
          onClick={() => router.push(`/survey/${item.id}`)}
          className="rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
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
            <div className="flex justify-between items-start gap-2">
              <p className="text-base font-semibold text-gray-900 truncate w-[calc(100%-60px)]">
                {item.survey_title}
              </p>
              {item.type === SurveyTypeEnum.OFFICIAL && (
                <p className="flex-shrink-0 text-xs sm:text-sm text-orange-500 font-medium text-right">
                  🎁 {item.reward_amount / 1000}
                </p>
              )}
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
