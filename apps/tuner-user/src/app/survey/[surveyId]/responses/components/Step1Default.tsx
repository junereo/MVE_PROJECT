"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SurveyTabs from "@/app/survey/components/SurveyTabs";
import QuestionText from "@/app/survey/components/QuestionText";
import QuestionOptions from "@/app/survey/components/QuestionOptions";
import QuestionSubjective from "@/app/survey/components/QuestionSubjective";
import { InputTypeEnum } from "@/features/survey/types/enums";
import { useDefaultQuestionStore } from "@/features/survey/store/useDefaultQuestionStore";
import { fetchSurveyQuestions } from "@/features/survey/services/survey";
import { QuestionTypeEnum } from "@/features/survey/types/enums";
import type { QuestionItem } from "@/features/survey/store/useDefaultQuestionStore";

interface Step1props {
  onNext: () => void;
}

const baseCategories = [
  { key: "originality", label: "작품성" },
  { key: "popularity", label: "대중성" },
  { key: "sustainability", label: "지속성" },
  { key: "expandability", label: "확장성" },
  { key: "stardom", label: "스타성" },
];

const dummySurvey = {
  id: 1,
  survey_title: "빈지노 Fashion Hoarder 설문",
};

export default function Step1Default({ onNext }: Step1props) {
  const { answers, setAnswer } = useAnswerStore();

  const [tabIndex, setTabIndex] = useState(0);
  const currentKey = baseCategories[tabIndex]?.key ?? "";
  const { questions, setQuestions } = useDefaultQuestionStore();
  const currentQuestion = useMemo(
    () => questions.filter((q) => q.category === currentKey),
    [questions, currentKey]
  );

  const { id, survey_title } = dummySurvey;

  const isValid = useMemo(() => {
    const currentAnswers = answers[currentKey] || {};
    return currentQuestion.every((_, idx) => {
      const val = currentAnswers[idx];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== "";
    });
  }, [answers, currentKey, currentQuestion]);

  useEffect(() => {
    if (questions.length === 0) {
      fetchSurveyQuestions(id).then((res) => {
        const template = res.data[0];

        type RawQuestion = {
          id: number;
          question_text: string;
          type: InputTypeEnum;
          options?: string[];
          question_type?: string;
        };

        type QuestionMap = Record<string, RawQuestion[]>;

        const rawMap = template.question as QuestionMap;

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
  }, [id, questions.length, setQuestions]);

  const handlePrev = () => {
    if (tabIndex > 0) {
      setTabIndex((prev) => prev - 1);
    } else {
      return;
    }
  };

  const handleNext = () => {
    if (tabIndex < baseCategories.length - 1) {
      setTabIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <Link href={`/survey/${id}`}>←</Link>
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: `${survey_title}`, href: `/survey/${id}` },
            { label: "기본 설문" },
          ]}
        />

        <SurveyTabs
          tabs={baseCategories}
          current={tabIndex}
          setTab={setTabIndex}
        />

        {currentQuestion.map((q, idx) => {
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
