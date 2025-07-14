"use client";

import Link from "next/link";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import Button from "@/components/ui/Button";
import DateRangePicker from "../../../components/DateRangePicker";
import { useState } from "react";
import YoutubeSearchBox from "@/app/survey/components/YoutubeSearchBox";
import ThumbnailUploader from "@/app/survey/components/ThumbnailUploader";

interface Step1Props {
  onNext: () => void;
}

export default function Step1YouTube({ onNext }: Step1Props) {
  const { selectedVideo, setSelectedVideo, step1, setStep1 } = useSurveyStore();

  const { start_at, end_at, video } = step1;

  const [showMusicUri, setShowMusicUri] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDateValid = (start: Date | null, end: Date | null): boolean => {
    return (
      start instanceof Date &&
      end instanceof Date &&
      !isNaN(start.getTime()) &&
      !isNaN(end.getTime()) &&
      start <= end
    );
  };

  const handleNext = () => {
    if (!selectedVideo) {
      setSelectedVideo(video);
      if (!video) {
        setError("유튜브 영상을 선택해주세요.");
      }
      return;
    }

    if (!start_at || !end_at) {
      setError("설문 시작일과 종료일을 정확히 입력해주세요.");
      return;
    }

    if (!isDateValid(start_at, end_at)) {
      setError("종료일은 시작일보다는 빠를 수 없습니다.");
      return;
    }

    setError(null);
    setStep1({
      video: selectedVideo,
      start_at,
      end_at,
    });

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
          설문 수정
        </h1>
      </header>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-16">
          Step 1 : 유튜브
        </h2>

        <YoutubeSearchBox
          music_uri={!selectedVideo ? video?.music_uri : undefined}
          editMode={true}
          showMusicUri={showMusicUri}
          setShowMusicUri={setShowMusicUri}
        />

        <ThumbnailUploader />

        <DateRangePicker
          label="설문 기간"
          startDate={start_at}
          endDate={end_at}
          onChange={(start, end) => {
            setStep1({ start_at: start, end_at: end });
          }}
        />

        {error && <p className="text-sm text-red-500 mt-2 px-2">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <Button onClick={handleNext} color="blue">
          다음
        </Button>
      </div>
    </>
  );
}
