"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import List from "@/components/ui/List";
import { usePagination } from "@/features/survey/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import SortToggle from "@/components/ui/SortToggle";
import { MySurveyAnswer } from "@/features/users/types/MySurveyAnswer";

type Props = {
  answers: MySurveyAnswer[];
};

const statusTextMap = {
  draft: "임시저장",
  complete: "참여완료",
} as const;

const statusList = ["all", "draft", "complete"] as const;
type Status = (typeof statusList)[number];

export default function ParticipantsList({ answers }: Props) {
  const router = useRouter();
  const allAnswers = answers;
  const [status, setStatus] = useState<Status>("all");
  const [sortOption, setSortOption] = useState<"latest" | "oldest">("latest");

  // 필터링
  const filtered =
    status === "all"
      ? allAnswers
      : allAnswers.filter((item) => item.status === status);

  // 정렬
  const sorted = [...filtered].sort((a, b) => {
    const aDate = new Date(a.survey.start_at).getTime();
    const bDate = new Date(b.survey.start_at).getTime();
    return sortOption === "latest" ? bDate - aDate : aDate - bDate;
  });

  // 카운트
  const draftCount = allAnswers.filter((a) => a.status === "draft").length;
  const completeCount = allAnswers.filter(
    (a) => a.status === "complete"
  ).length;

  // 페이지네이션

  const {
    currentPage,
    totalPages,
    currentData: paginatedSurveys,
    setCurrentPage,
  } = usePagination(sorted, 6); // 한 페이지당 6개

  return (
    <div className="space-y-4 min-h-[calc(100vh-100px)] max-w-[700px] mx-auto relative pb-16">
      <div className="flex justify-around border-b pb-2">
        {statusList.map((s) => (
          <button
            key={s}
            className={`flex-1 py-1 text-sm sm:text-base transition ${
              status === s
                ? "bg-[#57CC7E] text-white font-semibold"
                : "bg-gray-100 text-gray-800 hover:bg-[#E8FDF0]"
            }`}
            onClick={() => setStatus(s)}
          >
            {s === "all" ? "전체" : statusTextMap[s]}
          </button>
        ))}
      </div>
      <SortToggle
        options={[
          { label: "최신순", value: "latest" },
          { label: "오래된순", value: "oldest" },
        ]}
        value={sortOption}
        onChange={setSortOption}
      />

      <div className="flex items-center justify-between mt-4 mb-2 px-1">
        <h2 className="text-lg font-semibold text-gray-800">설문 참여 내역</h2>
        <span className="text-sm text-gray-500">
          참여완료 {completeCount}건 | 임시저장 {draftCount}건
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 w-full col-span-2">
          <Image
            src="/images/empty-survey.png"
            alt="설문 없음"
            width={96}
            height={96}
            className="mb-4"
          />
          <p className="text-center text-sm text-gray-500">
            {status === "draft"
              ? "임시저장한 설문이 없습니다."
              : status === "complete"
              ? "참여완료한 설문이 없습니다."
              : "참여한 설문이 없습니다."}
          </p>
        </div>
      ) : (
        paginatedSurveys.map((item) => (
          <List
            key={item.id}
            onClick={() => router.push(`/survey/${item.survey.id}`)}
            image={item.survey.thumbnail_uri}
            artist={item.survey.artist}
            title={item.survey.music_title}
            surveyTitle={item.survey.survey_title}
            period={`${item.survey.start_at
              .slice(2, 10)
              .replace(/-/g, ".")} - ${item.survey.end_at
              .slice(2, 10)
              .replace(/-/g, ".")}`}
            status={statusTextMap[item.status]}
            surveyType={item.survey.type}
            reward={item.survey.reward_amount}
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
