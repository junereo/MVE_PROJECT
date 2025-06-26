"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import SurveyTabs from "../../components/SurveyTabs";
import SurveyTag from "../../components/SurveyTag";
import QuestionText from "../../components/QuestionText";
import QuestionOptions from "../../components/QuestionOptions";
import QuestionScore from "../../components/QuestionScore";
import { defaultQuestions } from "@/features/survey/constants/defaultQuestions";

interface Step4Props {
  onPrev: () => void;
  onNext: () => void;
}

const baseCategories = [
  { key: "originality", label: "작품성" },
  { key: "popularity", label: "대중성" },
  { key: "sustainability", label: "지속성" },
  { key: "expandability", label: "확장성" },
  { key: "stardom", label: "스타성" },
];

export default function Step4Default({ onPrev, onNext }: Step4Props) {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [scores, setScores] = useState<Record<string, number | null>>({});

  const currentKey = baseCategories[tabIndex].key;
  const currentTemplate = defaultQuestions[currentKey];

  const handleSelectOption = (value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentKey]: value,
    }));
  };

  const handleScoreChange = (value: number) => {
    setScores((prev) => ({
      ...prev,
      [currentKey]: value,
    }));
  };

  const handleNext = () => {
    if (tabIndex < baseCategories.length - 1) {
      setTabIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const isLast = tabIndex === baseCategories.length - 1;

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex  bg-white text-black border border-red-500 z-30 items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="space-y-4 min-h-screen">
        <h2 className="text-xl font-bold">Step 4: 기본 설문</h2>

        <SurveyTabs
          tabs={baseCategories}
          current={tabIndex}
          setTab={setTabIndex}
        />

        <SurveyTag />

        {currentTemplate.map((q, idx) => (
          <div key={idx} className="space-y-2">
            <QuestionText text={q.question} />
            <QuestionOptions
              options={q.options}
              selected={selectedOptions[currentKey] || ""}
              onChange={handleSelectOption}
            />
          </div>
        ))}

        <QuestionText text={`${[currentKey]} 점수를 입력해 주세요`} />
        <QuestionScore
          value={scores[currentKey] ?? null}
          onChange={handleScoreChange}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] p-3 flex items-center bg-white text-black border border-green-700 z-30 justify-end gap-3">
        <div className="flex-[1.5]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="flex-[2]">
          <Button onClick={handleNext} color="blue">
            {isLast ? "다음 (Step5)" : "다음"}
          </Button>
        </div>
      </div>
    </>
  );
}
