"use client";

import { useState, useEffect } from "react";
import { surveyList } from "@/features/survey/services/survey";
import ListItem from "../../../components/ui/ListItem";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";

export default function List() {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await surveyList();

        const sorted = res.data.sort(
          (a: SurveyResponse, b: SurveyResponse) =>
            new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
        );

        setSurveys(sorted);
      } catch (err) {
        console.error("설문 목록 가져오기 실패:", err);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {surveys.map((item) => (
        <ListItem
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
          status={item.is_active === "ongoing" ? "진행중" : "종료"}
          participants={item.survey_custom?.length || 0}
          reward={item.reward_amount}
        />
      ))}
    </div>
  );
}
