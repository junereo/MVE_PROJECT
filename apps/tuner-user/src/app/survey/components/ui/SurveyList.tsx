"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSurveyList } from "@/features/survey/services/survey";
import List from "@/components/ui/List";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";

const statusTextMap: Record<SurveyResponse["is_active"], string> = {
  upcoming: "예정",
  ongoing: "진행중",
  closed: "종료",
};

const statusList = ["all", "upcoming", "ongoing", "closed"] as const;
type Status = (typeof statusList)[number];

export default function SurveyList() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("all");
  const [submitStatus, setSubmitStatus] = useState<"draft" | "complete">(
    "complete"
  ); // 설문 제출 상태 (완료만 보기)
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSurveyList();

        const sorted = res.data.sort((a: SurveyResponse, b: SurveyResponse) => {
          return (
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
          );
        });

        const filtered: SurveyResponse[] =
          submitStatus === "complete" && status === "all"
            ? sorted.filter((item) => item.status === "complete")
            : sorted.filter(
                (item) =>
                  item.status === submitStatus && item.is_active === status
              );

        setSurveys(filtered);
      } catch (e) {
        console.error("리스트 불러오기 실패", e);
      }
    };

    fetch();
  }, [status, submitStatus]);

  return (
    <div className="space-y-4 max-w-[700px] mx-auto">
      <div className="flex justify-around border-b pb-2">
        {statusList.map((s) => (
          <button
            key={s}
            className={`flex-1 min-w-0 py-1 text-sm sm:text-base transition ${
              status === s
                ? "bg-blue-500 text-white font-semibold shadow-sm"
                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
            }`}
            onClick={() => setStatus(s)}
          >
            {s === "all"
              ? "전체"
              : statusTextMap[s as keyof typeof statusTextMap]}
          </button>
        ))}
      </div>

      {surveys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 w-full col-span-2">
          <Image
            src="/images/empty-survey.png"
            alt="설문 없음"
            width={96}
            height={96}
            className="mb-4"
          />
          <p className="text-sm">
            {status === "ongoing"
              ? "진행중인 설문이 없습니다."
              : status === "closed"
              ? "종료된 설문이 없습니다."
              : status === "upcoming"
              ? "예정된 설문이 없습니다."
              : "설문이 없습니다."}
          </p>
        </div>
      ) : (
        surveys.map((item) => (
          <List
            key={item.id}
            onClick={() => router.push(`/survey/${item.id}`)}
            image={item.thumbnail_uri}
            artist={item.artist}
            title={item.music_title}
            surveyTitle={item.survey_title}
            period={`${item.start_at
              .slice(2, 10)
              .replace(/-/g, ".")} - ${item.end_at
              .slice(2, 10)
              .replace(/-/g, ".")}`}
            status={statusTextMap[item.is_active] as "예정" | "진행중" | "종료"}
            surveyType={item.type}
            participants={item.participants?.length}
            reward={item.reward_amount}
          />
        ))
      )}
    </div>
  );
}
