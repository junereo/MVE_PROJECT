"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getSurveyList } from "@/features/survey/services/survey";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";
import { usePagination } from "@/features/survey/hooks/usePagination";
import List from "@/components/ui/List";
import Pagination from "@/components/ui/Pagination";
import SortToggle from "@/components/ui/SortToggle";

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
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [sortOption, setSortOption] = useState<
    "latest" | "oldest" | "participants"
  >("latest");

  const filteredSurveys = useMemo(() => {
    return allSurveys
      .filter((item) => {
        const statusMatch = status === "all" || item.is_active === status;
        const keywordMatch = keyword
          ? [item.survey_title, item.artist, item.music_title]
              .filter(Boolean)
              .some((field) =>
                field.toLowerCase().includes(keyword.toLowerCase())
              )
          : true;
        return statusMatch && keywordMatch;
      })
      .sort((a, b) => {
        if (sortOption === "latest") {
          return (
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
          );
        }
        if (sortOption === "oldest") {
          return (
            new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
          );
        }
        if (sortOption === "participants") {
          return (b.participants?.length || 0) - (a.participants?.length || 0);
        }
        return 0;
      });
  }, [allSurveys, status, keyword, sortOption]);

  const {
    currentPage,
    totalPages,
    currentData: paginatedSurveys,
    setCurrentPage,
  } = usePagination(filteredSurveys, 6);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await getSurveyList();
        setAllSurveys(res.data);
      } catch (e) {
        console.error("설문 목록 불러오기 실패", e);
      }
    };
    fetchSurveys();
  }, []);

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
    <div className="space-y-4 min-h-[calc(100vh-100px)] max-w-[700px] mx-auto relative pb-16">
      <div className="flex justify-around border-b pb-2 mb-4">
        {statusList.map((s) => (
          <button
            key={s}
            className={`flex-1 min-w-0 py-1 text-sm sm:text-base transition ${
              status === s
                ? "bg-[#57CC7E] text-white font-semibold shadow-sm"
                : "bg-gray-100 text-gray-800 hover:bg-[#E8FDF0]"
            }`}
            onClick={() => setStatus(s)}
          >
            {s === "all"
              ? "전체"
              : statusTextMap[s as keyof typeof statusTextMap]}
          </button>
        ))}
      </div>

      <SortToggle
        options={[
          { label: "최신순", value: "latest" },
          { label: "오래된순", value: "oldest" },
          { label: "인기순", value: "participants" },
        ]}
        value={sortOption}
        onChange={setSortOption}
      />

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
        paginatedSurveys.map((item) => (
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
