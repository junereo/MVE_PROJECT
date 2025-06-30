"use client";

import { useState, useEffect } from "react";
import { surveyList } from "@/features/survey/services/survey";
import List from "@/components/ui/List";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";

const statusTextMap: Record<SurveyResponse["is_active"], string> = {
  upcoming: "예정",
  ongoing: "진행중",
  closed: "종료",
};

export default function SurveyList() {
  const [status, setStatus] = useState<
    "all" | "upcoming" | "ongoing" | "closed"
  >("all");
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await surveyList();
        const sorted = res.data.sort((a: SurveyResponse, b: SurveyResponse) => {
          return (
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
          );
        });
        const filtered =
          status === "all"
            ? sorted
            : sorted.filter(
                (item: SurveyResponse) => item.is_active === status
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
        {["all", "upcoming", "ongoing", "closed"].map((s) => (
          <button
            key={s}
            className={`text-sm font-medium px-4 py-1 rounded ${
              status === s
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setStatus(s as any)}
          >
            {s === "all"
              ? "전체"
              : statusTextMap[s as keyof typeof statusTextMap]}
          </button>
        ))}
      </div>

      {surveys.map((item) => (
        <List
          key={item.id}
          image={item.music.thumbnail_url}
          artist={item.music.artist}
          title={item.music.title}
          surveyTitle={item.survey_title}
          period={`${item.start_at
            .slice(2, 10)
            .replace(/-/g, ".")} - ${item.end_at
            .slice(2, 10)
            .replace(/-/g, ".")}`}
          status={statusTextMap[item.is_active] as "예정" | "진행중" | "종료"}
          participants={item.survey_custom?.length || 0}
          reward={item.reward_amount}
        />
      ))}
    </div>
  );
}
