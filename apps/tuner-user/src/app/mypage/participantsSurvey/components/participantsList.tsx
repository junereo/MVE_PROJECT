"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSurveyList } from "@/features/survey/services/survey";
import List from "@/components/ui/List";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";

const statusTextMap: Record<"ongoing" | "closed", "진행중" | "종료"> = {
  ongoing: "진행중",
  closed: "종료",
};

const statusList = ["all", "upcoming", "ongoing", "closed"] as const;
type Status = (typeof statusList)[number];

export default function MySurveyList({ userId }: { userId?: number }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("all");
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
        const filtered =
          status === "all"
            ? sorted
            : sorted.filter(
                (item: SurveyResponse) =>
                  item.is_active === status &&
                  (!userId || item.user_id === userId)
              );
        setSurveys(filtered);
      } catch (e) {
        console.error("리스트 불러오기 실패", e);
      }
    };
    fetch();
  }, [status]);

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
        <p className="text-center text-sm text-gray-500">
          참여한 설문이 없습니다.
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
            period={`${item.start_at
              .slice(2, 10)
              .replace(/-/g, ".")} - ${item.end_at
              .slice(2, 10)
              .replace(/-/g, ".")}`}
            status={statusTextMap[item.is_active as "ongoing" | "closed"]}
            surveyType={item.type}
            participants={item.participants?.length || 0}
            reward={item.reward_amount}
          />
        ))
      )}
    </div>
  );
}
