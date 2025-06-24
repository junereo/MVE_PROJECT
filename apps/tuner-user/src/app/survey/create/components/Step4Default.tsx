"use client";

import Button from "@/components/ui/Button";
import SurveyTabs from "./ui/SurveyTabs";
import { useState } from "react";

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

  const allTabs = [...baseCategories];
  const currentTab = allTabs[tabIndex];
  const isStardomTab = currentTab.key === "stardom";

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex  bg-white text-black border border-red-500 z-30flex items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold">Step 4: 기본 설문</h2>

        <div className="space-y-2">
          <SurveyTabs tabs={allTabs} current={tabIndex} setTab={setTabIndex} />
        </div>

        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] items-center bg-white text-black border border-green-700 px-4 py-2 z-30 flex justify-end pt-4">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
          <Button onClick={onNext} color="blue">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
