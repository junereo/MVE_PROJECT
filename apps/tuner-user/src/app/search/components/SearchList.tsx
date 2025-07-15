"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearchSurveyStore } from "@/features/survey/store/useSearchSurveyStore";
import { getSurveyList } from "@/features/survey/services/survey";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";
import List from "@/components/ui/List";

const statusTextMap: Record<SurveyResponse["is_active"], string> = {
  upcoming: "예정",
  ongoing: "진행중",
  closed: "종료",
};

const statusList = ["all", "upcoming", "ongoing", "closed"] as const;
type Status = (typeof statusList)[number];

export default function SearchList() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("all");
  const [allSurveys, setAllSurveys] = useState<SurveyResponse[]>([]);
  const { keyword } = useSearchSurveyStore();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await getSurveyList();
        const sorted = res.data.sort(
          (a, b) =>
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
        );
        setAllSurveys(sorted);
      } catch (e) {
        console.error("설문 목록 불러오기 실패", e);
      }
    };
    fetchSurveys();
  }, []);

  const filteredSurveys = useMemo(() => {
    return allSurveys.filter((item) => {
      const statusMatch = status === "all" || item.is_active === status;
      const keywordMatch = keyword
        ? [item.survey_title, item.artist, item.music_title]
            .filter(Boolean)
            .some((field) =>
              field.toLowerCase().includes(keyword.toLowerCase())
            )
        : true;
      return statusMatch && keywordMatch;
    });
  }, [allSurveys, status, keyword]);

  const emptyMessage = useMemo(() => {
    if (!keyword) {
      if (status === "upcoming") return "예정된 설문이 없습니다.";
      if (status === "ongoing") return "진행중인 설문이 없습니다.";
      if (status === "closed") return "종료된 설문이 없습니다.";
      return "등록된 설문이 없습니다.";
    }
    return `"${keyword}"에 대한 설문 결과가 없습니다.`;
  }, [status, keyword]);

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

      {filteredSurveys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Image
            src="/images/empty-survey.png"
            alt="설문 없음"
            width={96}
            height={96}
            className="mb-4"
          />
          <p className="text-sm text-center whitespace-pre-line">
            {emptyMessage}
          </p>
        </div>
      ) : (
        filteredSurveys.map((item) => (
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
