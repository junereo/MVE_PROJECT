"use client";

import { useState } from "react";
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

export default function Step4Default({ onPrev, onNext }: Step4Props) {
  const baseCategories = [
    { key: "originality", label: "작품성" },
    { key: "popularity", label: "대중성" },
    { key: "sustainability", label: "지속성" },
    { key: "expandability", label: "확장성" },
    { key: "stardom", label: "스타성" },
  ];

  const [tabIndex, setTabIndex] = useState(0);
  const [choice, setChoice] = useState<string>(""); // 객관식 응답
  const [score, setScore] = useState<number | null>(null); // 점수 응답

  const options = ["매우 참신했다", "참신했다", "보통이다", "진부했다"];

  const allTabs = [...baseCategories];

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex bg-white text-black border border-red-500 z-30 items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="p-4 space-y-4 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Step 4: 기본 설문</h2>

        <SurveyTabs tabs={allTabs} current={tabIndex} setTab={setTabIndex} />
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

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] items-center bg-white text-black border border-green-700 px-4 py-2 z-30 flex justify-end pt-4">
        <Button onClick={onPrev} color="white">
          이전
        </Button>
        <Button onClick={onNext} color="blue">
          다음
        </Button>
      </div>
    </>
  );
}
