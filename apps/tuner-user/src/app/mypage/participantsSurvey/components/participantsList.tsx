"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMySurveyAnswer } from "@/features/users/services/survey";
import List from "@/components/ui/List";
import type { MySurveyAnswer } from "@/features/survey/types/surveyResponse";

const statusTextMap = {
  draft: "임시저장",
  complete: "제출",
};

const statusList = ["all", "draft", "complete"] as const;
type Status = (typeof statusList)[number];

export default function ParticipantsList() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("all");
  const [answers, setAnswers] = useState<MySurveyAnswer[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMySurveyAnswer();
        const sorted = res.data.sort(
          (a: MySurveyAnswer, b: MySurveyAnswer) =>
            new Date(b.survey.start_at).getTime() -
            new Date(a.survey.start_at).getTime()
        );
        const filtered =
          status === "all"
            ? sorted
            : sorted.filter((item) => item.status === status);
        setAnswers(filtered);
      } catch (e) {
        console.error("참여 설문 불러오기 실패", e);
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

      {answers.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          참여한 설문이 없습니다.
        </p>
      ) : (
        answers.map((item) => (
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
            participants={undefined}
            reward={item.survey.reward_amount}
          />
        ))
      )}
    </div>
  );
}
