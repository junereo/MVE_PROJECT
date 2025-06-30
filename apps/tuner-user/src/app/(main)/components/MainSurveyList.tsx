"use client";

import { useState, useEffect } from "react";
import { surveyList } from "@/features/survey/services/survey";
import List from "@/components/ui/List";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";

const statusTextMap: Record<
  SurveyResponse["is_active"],
  "예정" | "진행중" | "종료"
> = {
  upcoming: "예정",
  ongoing: "진행중",
  closed: "종료",
};

export default function MainSurveyList({
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
    <div className="flex flex-col gap-3">
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
          status={
            statusTextMap[item.is_active as keyof typeof statusTextMap] ??
            "종료"
          }
          participants={item.survey_custom?.length || 0}
          reward={item.reward_amount}
        />
      ))}
    </div>
  );
}
