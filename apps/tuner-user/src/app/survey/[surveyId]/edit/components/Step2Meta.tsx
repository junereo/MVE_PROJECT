"use client";

import { useState } from "react";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DatePicker from "../../../components/DataPicker";
import Dropdown from "@/components/ui/DropDown";

interface Step2Props {
  onPrev: () => void;
  onNext: () => void;
}

const genreOptions = [
  { value: "ballad", label: "발라드" },
  { value: "hiphop", label: "힙합" },
  { value: "rnb", label: "R&B" },
  { value: "dance", label: "댄스" },
  { value: "jazz", label: "재즈" },
  { value: "classical", label: "클래식" },
  { value: "edm", label: "EDM" },
  { value: "gukak", label: "국악" },
  { value: "rock", label: "락" },
];

export default function Step2Meta({ onPrev, onNext }: Step2Props) {
  const { step2, setStep2 } = useSurveyStore();

  const [surveyTitle, setSurveyTitle] = useState(step2.survey_title);
  const [releaseType, setReleaseType] = useState<
    "released" | "unreleased" | null
  >(step2.is_released ? "released" : "unreleased");
  const [releaseDate, setReleaseDate] = useState<Date | null>(
    step2.release_date ? new Date(step2.release_date) : null
  );
  const [genre, setGenre] = useState<string | undefined>(step2.genre);

  // genre가 바뀔 때마다 label을 계산
  const selectedGenreLabel =
    genreOptions.find((g) => g.value === genre)?.label || "장르 선택";

  const isValid =
    surveyTitle.trim() !== "" &&
    releaseType !== null &&
    genreOptions.some((g) => g.value === genre) &&
    (releaseType === "unreleased" ||
      (releaseType === "released" && releaseDate));

  const handleNext = () => {
    setStep2({
      survey_title: surveyTitle,
      is_released: releaseType === "released",
      release_date: releaseDate?.toISOString() || "",
      genre,
    });

    onNext();
  };

  console.log("step2", step2);

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev} className="text-lg font-medium text-gray-700">
          ←
        </button>
        <h1 className="flex-1 text-center text-base sm:text-lg font-bold text-gray-900">
          설문 수정
        </h1>
      </header>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-16">
          Step 2 : 음원 정보
        </h2>

        <Input
          label="설문 제목"
          placeholder="30자 이내, 예) 6월 감성 R&B 설문"
          value={surveyTitle}
          maxLength={30}
          onChange={(e) => setSurveyTitle(e.target.value)}
        />
        <div className="space-y-2">
          <div className="text-sm font-medium">음원 상태</div>
          <div className="flex gap-2">
            <Button
              color={releaseType === "unreleased" ? "blue" : "white"}
              onClick={() => setReleaseType("unreleased")}
            >
              미발매
            </Button>
            <Button
              color={releaseType === "released" ? "blue" : "white"}
              onClick={() => setReleaseType("released")}
            >
              발매
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">음악 장르</div>
          <Dropdown
            options={genreOptions.map((g) => g.label)}
            selected={selectedGenreLabel}
            onSelect={(label) => {
              const selectedGenre = genreOptions.find((g) => g.label === label);
              if (selectedGenre) {
                setGenre(selectedGenre.value);
              }
            }}
          />
        </div>
        {releaseType === "released" && (
          <DatePicker
            label="발매일"
            selected={releaseDate}
            onChange={(date) => setReleaseDate(date)}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={onPrev} color="white">
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
