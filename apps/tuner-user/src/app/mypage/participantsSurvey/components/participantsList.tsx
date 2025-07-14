"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSurveyAnswerStore } from "@/features/users/store/useSurveyAnswerStore";

import List from "@/components/ui/List";

const statusTextMap = {
  draft: "제출",
  complete: "임시저장",
} as const;

const statusList = ["all", "draft", "complete"] as const;
type Status = (typeof statusList)[number];

export default function ParticipantsList() {
  const router = useRouter();
  const { answers: allAnswers } = useSurveyAnswerStore();
  const [status, setStatus] = useState<Status>("all");

  const filtered =
    status === "all"
      ? allAnswers
      : allAnswers.filter((item) => item.status === status);

  const draftCount = allAnswers.filter((a) => a.status === "draft").length;
  const completeCount = allAnswers.filter(
    (a) => a.status === "complete"
  ).length;

  return (
    <div className="space-y-4 max-w-[700px] mx-auto">
      {/* 상태 필터 */}
      <div className="flex justify-around border-b pb-2">
        {statusList.map((s) => (
          <button
            key={s}
            className={`flex-1 py-1 text-sm sm:text-base transition ${
              status === s
                ? "bg-blue-500 text-white font-semibold"
                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
            }`}
            onClick={() => setStatus(s)}
          >
            {s === "all" ? "전체" : statusTextMap[s]}
          </button>
        ))}
      </div>

      {/* 요약 */}
      <div className="flex items-center justify-between mt-4 mb-2 px-1">
        <h2 className="text-lg font-semibold text-gray-800">설문 참여 내역</h2>
        <span className="text-sm text-gray-500">
          임시저장 {completeCount}건 | 제출 {draftCount}건
        </span>
      </div>

      {/* 리스트 */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          참여한 설문이 없습니다.
        </p>
      ) : (
        filtered.map((item) => (
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
    </div>
  );
}
