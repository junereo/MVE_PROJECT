"use client";

import { useState } from "react";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import YoutubeSearchBox from "../../components/YoutubeSearchBox";
import Button from "@/components/ui/Button";
import DateRangePicker from "../../components/DateRangePicker";
import Link from "next/link";

interface Step1Props {
  onNext: () => void;
}

export default function Step1YouTube({ onNext }: Step1Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { selectedVideo, setStep1 } = useSurveyStore();

  const handleNext = () => {
    setStep1({
      video: selectedVideo,
      start_at: startDate?.toISOString(),
      end_at: endDate?.toISOString(),
    });

    onNext();
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button>
          <Link href="/survey">←</Link>
        </button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <h2 className="text-xl font-bold">Step 1: 유튜브</h2>
        <YoutubeSearchBox />

        <DateRangePicker
          label="설문 기간"
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <Button onClick={handleNext} color="blue">
          다음
        </Button>
      </div>
    </>
  );
}
