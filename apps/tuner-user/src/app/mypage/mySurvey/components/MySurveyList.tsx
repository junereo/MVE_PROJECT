"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSurveyList } from "@/features/survey/services/survey";
import List from "@/components/ui/List";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";

const statusFilterList = [
  { label: "전체", value: "all" },
  { label: "임시저장", value: "draft" },
  { label: "예정", value: "upcoming" },
  { label: "진행중", value: "ongoing" },
  { label: "종료", value: "closed" },
] as const;

type StatusFilter = (typeof statusFilterList)[number]["value"];

export default function MySurveyList({ userId }: { userId?: number }) {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSurveyList();

        const sorted = res.data.sort(
          (a, b) =>
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
        );

        const filtered =
          statusFilter === "draft"
            ? sorted.filter(
                (item) =>
                  item.status === "draft" &&
                  (!userId || item.user_id === userId)
              )
            : statusFilter === "all"
            ? sorted.filter(
                (item) =>
                  (item.status === "complete" || item.status === "draft") &&
                  (!userId || item.user_id === userId)
              )
            : sorted.filter(
                (item) =>
                  item.status === "complete" &&
                  item.is_active === statusFilter &&
                  (!userId || item.user_id === userId)
              );

        setSurveys(filtered);
      } catch (e) {
        console.error("설문 리스트 불러오기 실패", e);
      }
    };

    fetch();
  }, [statusFilter, userId]);

  return (
    <div className="space-y-4 max-w-[700px] mx-auto">
      <div className="flex justify-around border-b pb-2">
        {statusFilterList.map(({ label, value }) => (
          <button
            key={value}
            className={`flex-1 min-w-0 py-1 text-sm sm:text-base transition ${
              statusFilter === value
                ? "bg-blue-500 text-white font-semibold shadow-sm"
                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
            }`}
            onClick={() => setStatusFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {surveys.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-10">
          {statusFilter === "draft"
            ? "임시저장된 설문이 없습니다."
            : "생성한 설문이 없습니다."}
        </p>
      ) : (
        surveys.map((item) => (
          <List
            key={item.id}
            onClick={() => router.push(`/survey/${item.id}`)}
            image={item.thumbnail_uri}
            artist={item.artist}
            title={item.music_title}
            surveyTitle={item.survey_title}
            period={
              item.status === "draft"
                ? "작성 중"
                : `${item.start_at
                    .slice(2, 10)
                    .replace(/-/g, ".")} - ${item.end_at
                    .slice(2, 10)
                    .replace(/-/g, ".")}`
            }
            status={
              item.status === "draft"
                ? "임시저장"
                : item.is_active === "upcoming"
                ? "예정"
                : item.is_active === "ongoing"
                ? "진행중"
                : "종료"
            }
            surveyType={item.type}
            participants={item.participants?.length || 0}
            reward={item.reward_amount}
          />
        ))
      )}
    </div>
  );
}
