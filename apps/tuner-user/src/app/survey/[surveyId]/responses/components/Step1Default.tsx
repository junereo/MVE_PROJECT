"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import { useDefaultQuestionStore } from "@/features/survey/store/useDefaultQuestionStore";
import { fetchSurveyQuestions } from "@/features/survey/services/survey";
import type { QuestionItem } from "@/features/survey/store/useDefaultQuestionStore";
import { InputTypeEnum, QuestionTypeEnum } from "@/features/survey/types/enums";

import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SurveyTabs from "@/app/survey/components/SurveyTabs";
import QuestionText from "@/app/survey/components/QuestionText";
import QuestionOptions from "@/app/survey/components/QuestionOptions";
import QuestionSubjective from "@/app/survey/components/QuestionSubjective";

interface Step1Props {
  onNext: () => void;
}

const baseCategories = [
  { key: "originality", label: "작품성" },
  { key: "popularity", label: "대중성" },
  { key: "sustainability", label: "지속성" },
  { key: "expandability", label: "확장성" },
  { key: "stardom", label: "스타성" },
];

export default function Step1Default({ onNext }: Step1Props) {
  const params = useParams();
  const surveyId = Number(params.id);

  const { answers, setAnswer } = useAnswerStore();
  const { questions, setQuestions } = useDefaultQuestionStore();

  const [tabIndex, setTabIndex] = useState(0);
  const [surveyTitle, setSurveyTitle] = useState(""); // 서버에서 받아올 title

  const currentKey = baseCategories[tabIndex]?.key ?? "";
  const currentQuestions = useMemo(
    () => questions.filter((q) => q.category === currentKey),
    [questions, currentKey]
  );

  const isValid = useMemo(() => {
    const currentAnswers = answers[currentKey] || {};
    return currentQuestions.every((_, idx) => {
      const val = currentAnswers[idx];
      return Array.isArray(val)
        ? val.length > 0
        : val !== undefined && val !== "";
    });
  }, [answers, currentKey, currentQuestions]);

  useEffect(() => {
    if (questions.length === 0) {
      // 기본 설문 불러옴
      fetchSurveyQuestions(1).then((res) => {
        const data = res.data[0];

        setSurveyTitle(data.title);

        type RawQuestion = {
          id: number;
          question_text: string;
          type: InputTypeEnum;
          options?: string[];
          question_type?: QuestionTypeEnum;
        };

        type QuestionMap = Record<string, RawQuestion[]>;

        const rawMap = data.question as QuestionMap;

        const defaultQuestions: QuestionItem[] = Object.entries(rawMap).flatMap(
          ([category, items]) =>
            items.map(
              (q): QuestionItem => ({
                id: q.id,
                category,
                question_text: q.question_text,
                type: q.type,
                options: q.options,
                question_type: QuestionTypeEnum.FIXED,
              })
            )
        );

        setQuestions(defaultQuestions);
      });
    }
  }, [questions.length, setQuestions]);

  const handlePrev = () => {
    if (tabIndex > 0) {
      setTabIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (tabIndex < baseCategories.length - 1) {
      setTabIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  useEffect(() => {
    console.log("📦 현재 저장된 답변 상태:", answers);
  }, [answers]);

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <Link href={`/survey/${surveyId}`}>←</Link>
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: surveyTitle, href: `/survey/${surveyId}` },
            { label: "기본 설문" },
          ]}
        />

        <SurveyTabs
          tabs={baseCategories}
          current={tabIndex}
          setTab={setTabIndex}
        />

        {currentQuestions.map((q, idx) => {
          const saved = answers[currentKey]?.[idx] as
            | string
            | string[]
            | undefined;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4"
            >
              <QuestionText text={`Q${idx + 1}. ${q.question_text}`} />

              {q.type === InputTypeEnum.SUBJECTIVE ? (
                <QuestionSubjective
                  value={typeof saved === "string" ? saved : ""}
                  onChange={(val) => setAnswer(currentKey, idx, val)}
                />
              ) : (
                <QuestionOptions
                  options={q.options ?? []}
                  value={saved}
                  type={q.type}
                  onChange={(val) => setAnswer(currentKey, idx, val)}
                  layout="horizontal"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={handlePrev} color="white">
            이전
          </Button>
        </div>
        <div className="w-[180px] sm:w-[400px]">
          <Button onClick={handleNext} disabled={!isValid} color="blue">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
