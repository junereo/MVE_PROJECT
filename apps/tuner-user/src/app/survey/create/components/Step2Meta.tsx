"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DatePicker from "../../components/DataPicker";
import Dropdown from "@/components/ui/DropDown";

interface Step2Props {
  onPrev: () => void;
  onNext: () => void;
}

const genreOptions = [
  { value: "rnb", label: "R&B" },
  { value: "hiphop", label: "Hip-Hop" },
  { value: "pop", label: "Pop" },
  { value: "ballad", label: "Ballad" },
  { value: "indie", label: "Indie" },
];

export default function Step2Meta({ onPrev, onNext }: Step2Props) {
  const [releaseType, setReleaseType] = useState<
    "released" | "unreleased" | null
  >(null);
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [genre, setGenre] = useState<string | null>(null);

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex  bg-white text-black border border-red-500 z-30flex items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="p-4 space-y-4 min-h-screen">
        <h2 className="text-xl font-bold">Step 2: 음원 정보</h2>
        <Input label="설문 제목" placeholder="예) 6월 감성 R&B 설문" />
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
            selected={
              genreOptions.find((g) => g.value === genre)?.label || "장르 선택"
            }
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
