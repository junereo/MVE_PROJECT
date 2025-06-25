"use client";

import { useState } from "react";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import YoutubeSearchBox from "../../components/YoutubeSearchBox";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
    });

    onNext();
  };

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex bg-white text-black border border-red-500 z-30 items-center justify-between px-4 py-3">
        <button>
          <Link href="/survey">←</Link>
        </button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="p-4 space-y-4 min-h-screen">
        <h2 className="text-xl font-bold">Step 1: 유튜브</h2>
        <YoutubeSearchBox />

        <Input
          label="곡 제목"
          value={selectedVideo?.title || ""}
          placeholder="곡 제목을 입력해주세요."
        />
        <Input
          label="아티스트"
          value={selectedVideo?.channelTitle || ""}
          placeholder="아티스트명을 입력해주세요."
        />

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

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] items-center bg-white text-black border border-green-700 px-4 py-2 z-30 flex justify-end pt-4">
        <Button onClick={handleNext} color="blue">
          다음
        </Button>
      </div>
    </>
  );
}
