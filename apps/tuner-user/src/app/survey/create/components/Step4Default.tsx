"use client";

import { useState, useEffect } from "react";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import Button from "@/components/ui/Button";
import SurveyTabs from "../../components/SurveyTabs";
import SurveyTag from "../../components/SurveyTag";
import QuestionText from "../../components/QuestionText";
import QuestionOptions from "../../components/QuestionOptions";
import QuestionScore from "../../components/QuestionScore";

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
] as const;

export default function Step4Default({ onPrev, onNext }: Step4Props) {
  const { step4, setStep4 } = useSurveyStore();
  const [tabIndex, setTabIndex] = useState(0);

  const currentKey = baseCategories[tabIndex].key;

  const [choice, setChoice] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);

  // 기존 상태에서 값 불러오기
  useEffect(() => {
    const prevScore = step4.answers[currentKey];
    if (prevScore !== undefined) setScore(prevScore);

    const prevTag = step4.tags[currentKey];
    if (prevTag) setChoice(prevTag);
  }, [tabIndex]);

  const handleNext = () => {
    // 저장
    setStep4({
      answers: {
        ...step4.answers,
        [currentKey]: score ?? 0,
      },
      tags: {
        ...step4.tags,
        [currentKey]: choice,
      },
      selectedTags: Array.from(new Set([...step4.selectedTags, currentKey])),
    });

    onNext();
  };

  const options = ["매우 참신했다", "참신했다", "보통이다", "진부했다"];

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex bg-white text-black border z-30 items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="space-y-4 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Step 4: 기본 설문</h2>

        <SurveyTabs
          tabs={baseCategories}
          current={tabIndex}
          setTab={setTabIndex}
        />
        <SurveyTag />

        <QuestionText text="이 음원의 구성이 참신했나요?" />
        <QuestionOptions
          options={options}
          selected={choice}
          onChange={setChoice}
        />

        <QuestionText text="작품성 항목은 점수 입력만 가능합니다." />
        <QuestionScore value={score} onChange={setScore} />
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] p-3 flex items-center bg-white text-black border border-green-700 z-30 justify-end gap-3">
        <div className="flex-[1.5]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="flex-[2]">
          <Button onClick={handleNext} color="blue">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
