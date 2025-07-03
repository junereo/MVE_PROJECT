"use client";

import { useMemo, useState } from "react";
import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import QuestionText from "@/app/survey/components/QuestionText";
import QuestionOptions from "@/app/survey/components/QuestionOptions";
import QuestionSubjective from "@/app/survey/components/QuestionSubjective";
import { InputTypeEnum } from "@/features/survey/types/enums";

interface Step2Props {
  onPrev: () => void;
  onNext: () => void;
}

const dummySurvey = {
  id: 1,
  survey_title: "빈지노 Fashion Hoarder 설문",
};

type CustomQuestion = {
  question_text: string;
  type: InputTypeEnum;
  options?: string[];
};

const dummyCustomQuestions: CustomQuestion[] = [
  {
    question_text: "이 음원을 추천하고 싶은 대상은 누구인가요?",
    type: InputTypeEnum.MULTIPLE,
    options: ["친구", "가족", "연인", "직장 동료"],
  },
  {
    question_text: "어떤 상황에서 이 음원을 듣고 싶나요?",
    type: InputTypeEnum.CHECKBOX,
    options: ["운전 중", "공부할 때", "샤워할 때", "운동할 때"],
  },
  {
    question_text: "이 음원에 대해 자유롭게 의견을 남겨주세요.",
    type: InputTypeEnum.SUBJECTIVE,
  },
];

export default function Step2Custom({ onPrev, onNext }: Step2Props) {
  const { answers, setAnswer } = useAnswerStore();

  const getCategoryAnswers = (
    key: string
  ): { [key: number]: string | string[] } => answers[key] || {};
  const currentAnswers = getCategoryAnswers("custom");

  const { id, survey_title } = dummySurvey;

  const isValid = useMemo(() => {
    return dummyCustomQuestions.every((_, idx) => {
      const val = currentAnswers[idx];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== "";
    });
  }, [currentAnswers]);

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: `${survey_title}`, href: `/survey/${id}` },
            { label: "커스텀 설문" },
          ]}
        />

        {dummyCustomQuestions.map((q, idx) => {
          const saved = (currentAnswers[idx] ??
            (q.type === InputTypeEnum.CHECKBOX ? [] : "")) as string | string[];

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4"
            >
              <QuestionText text={`Q${idx + 1}. ${q.question_text}`} />

              {q.type === InputTypeEnum.SUBJECTIVE ? (
                <QuestionSubjective
                  value={typeof saved === "string" ? saved : ""}
                  onChange={(val) => setAnswer("custom", idx, val)}
                />
              ) : (
                <QuestionOptions
                  options={q.options ?? []}
                  value={saved}
                  type={q.type}
                  onChange={(val) => setAnswer("custom", idx, val)}
                  layout="horizontal"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="w-[180px] sm:w-[400px]">
          <Button onClick={onNext} disabled={!isValid} color="blue">
            제출
          </Button>
        </div>
      </div>
    </>
  );
}
