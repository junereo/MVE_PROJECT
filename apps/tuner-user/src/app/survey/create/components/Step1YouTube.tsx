"use client";

import { useState } from "react";
import Link from "next/link";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import YoutubeSearchBox from "../../components/YoutubeSearchBox";
import Button from "@/components/ui/Button";
import DateRangePicker from "../../components/DateRangePicker";

interface Step1Props {
  onNext: () => void;
}

export default function Step1YouTube({ onNext }: Step1Props) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const { selectedVideo, setStep1 } = useSurveyStore();
  const [error, setError] = useState<string | null>(null);

  const isValid =
    selectedVideo !== null &&
    startDate instanceof Date &&
    !isNaN(startDate.getTime()) &&
    endDate instanceof Date &&
    !isNaN(endDate.getTime());

  const handleNext = () => {
    if (
      !startDate ||
      !endDate ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      setError("설문 시작일과 종료일을 정확히 입력해주세요.");
      return;
    }

    setStep1({
      video: selectedVideo,
      start_at: startDate?.toISOString(),
      end_at: endDate?.toISOString(),
    });

    setError(null);
    onNext();
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button>
          <Link href="/survey" className="text-lg font-medium text-gray-700">
            ←
          </Link>
        </button>
        <h1 className="flex-1 text-center text-base sm:text-lg font-bold text-gray-900">
          설문 생성
        </h1>
      </header>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-16">
          Step 1 : 유튜브
        </h2>

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
        {error && <p className="text-sm text-red-500 mt-2 px-2">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <Button onClick={handleNext} disabled={!isValid} color="blue">
          다음
        </Button>
      </div>
    </>
  );
}
