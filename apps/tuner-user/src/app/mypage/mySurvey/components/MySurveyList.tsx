"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSurveyList } from "@/features/survey/services/survey";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";
import { usePagination } from "@/features/survey/hooks/usePagination";
import List from "@/components/ui/List";
import Pagination from "@/components/ui/Pagination";
import SortToggle from "@/components/ui/SortToggle";

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

  const {
    currentPage,
    totalPages,
    currentData: paginatedSurveys,
    setCurrentPage,
  } = usePagination(surveys, 6); // 한 페이지당 6개

  const [sortOption, setSortOption] = useState<
    "latest" | "oldest" | "participants"
  >("latest");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSurveyList();

        const filtered =
          statusFilter === "draft"
            ? res.data.filter(
                (item) =>
                  item.status === "draft" &&
                  (!userId || item.user_id === userId)
              )
            : statusFilter === "all"
            ? res.data.filter(
                (item) =>
                  (item.status === "complete" || item.status === "draft") &&
                  (!userId || item.user_id === userId)
              )
            : res.data.filter(
                (item) =>
                  item.status === "complete" &&
                  item.is_active === statusFilter &&
                  (!userId || item.user_id === userId)
              );

        const sorted = filtered.sort((a, b) => {
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
            return (
              (b.participants?.length || 0) - (a.participants?.length || 0)
            );
          }
          return 0;
        });

        setSurveys(sorted);
      } catch (e) {
        console.error("설문 리스트 불러오기 실패", e);
      }
    };

    fetch();
  }, [statusFilter, userId, sortOption]);

  return (
    <div className="space-y-4 min-h-[calc(100vh-100px)] max-w-[700px] mx-auto relative pb-16">
      <div className="flex justify-around border-b pb-2">
        {statusFilterList.map(({ label, value }) => (
          <button
            key={value}
            className={`flex-1 min-w-0 py-1 text-sm sm:text-base transition ${
              statusFilter === value
                ? "bg-[#57CC7E] text-white font-semibold shadow-sm"
                : "bg-gray-100 text-gray-800 hover:bg-[#E8FDF0]"
            }`}
            onClick={() => setStatusFilter(value)}
          >
            {label}
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

      {surveys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 w-full col-span-2">
          <Image
            src="/images/empty-survey.png"
            alt="설문 없음"
            width={96}
            height={96}
            className="mb-4"
          />
          <p className="text-center text-sm text-gray-500 py-10">
            {statusFilter === "draft"
              ? "임시저장된 설문이 없습니다."
              : "생성한 설문이 없습니다."}
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
