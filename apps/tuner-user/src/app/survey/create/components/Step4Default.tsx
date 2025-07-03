"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import SurveyTabs from "../../components/SurveyTabs";
import QuestionText from "../../components/QuestionText";
import QuestionOptions from "../../components/QuestionOptions";
import QuestionSubjective from "../../components/QuestionSubjective";
import { fetchSurveyQuestions } from "@/features/survey/services/survey";
import { useDefaultQuestionStore } from "@/features/survey/store/useDefaultQuestionStore";
import { QuestionTypeEnum } from "@/features/survey/types/enums";
// import { defaultQuestions } from "@/features/survey/constants/defaultQuestions";

interface Step4Props {
  onPrev: () => void;
  onNext: () => void;
}
const questionsId = 1;

const baseCategories = [
  { key: "originality", label: "작품성" },
  { key: "popularity", label: "대중성" },
  { key: "sustainability", label: "지속성" },
  { key: "expandability", label: "확장성" },
  { key: "stardom", label: "스타성" },
];

export default function Step4Default({
  onPrev,
  onNext,
}: Omit<Step4Props, "questionsId">) {
  const [tabIndex, setTabIndex] = useState(0);
  const currentKey = baseCategories[tabIndex]?.key ?? "";
  const { questions, setQuestions } = useDefaultQuestionStore();
  const currentQuestions = questions.filter((q) => q.category === currentKey);

  useEffect(() => {
    // 기본 설문 질문 불러옴
    const getData = async () => {
      try {
        const response = await fetchSurveyQuestions(questionsId);

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error("응답 형식이 올바르지 않습니다.");
        }

        const template = response.data[0];
        const defaultQuestions = Object.entries(
          template.question as Record<string, any[]>
        ).flatMap(([category, items]) =>
          items.map((q) => ({
            category,
            ...q,
          }))
        );

        setQuestions(defaultQuestions);
      } catch (error) {
        console.error("설문 질문 불러오기 실패", error);
      }
    };
    getData();
  }, [setQuestions]);

  const handlePrev = () => {
    if (tabIndex > 0) {
      setTabIndex((prev) => prev - 1);
    } else {
      onPrev();
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
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <h2 className="text-xl font-bold text-gray-800">Step 4: 기본 설문</h2>

        <SurveyTabs
          tabs={baseCategories}
          current={tabIndex}
          setTab={setTabIndex}
        />

        {currentQuestions.map((q, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4"
          >
            <QuestionText text={q.question_text} />
            {q.type === QuestionTypeEnum.SUBJECTIVE ? (
              <QuestionSubjective disabled={true} />
            ) : (
              <QuestionOptions
                options={q.options ?? []}
                layout="horizontal"
                disabled={true}
              />
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={handlePrev} color="white">
            이전
          </Button>
        </div>
        <div className="w-[180px] sm:w-[400px]">
          <Button onClick={handleNext} color="blue">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
