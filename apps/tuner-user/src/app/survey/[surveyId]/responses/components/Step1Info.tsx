"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSurveyInfo } from "@/features/users/store/useSurveyInfo";

interface Step1Props {
  onNext: () => void;
}

export default function Step1Info({ onNext }: Step1Props) {
  const params = useParams();
  const surveyId = Number(params.id);
  const { setUserInfo } = useSurveyInfo();
  const [surveyTitle, setSurveyTitle] = useState("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [isMusicRelated, setIsMusicRelated] = useState<string>("");

  const genreOptions = [
    "발라드",
    "힙합",
    "R&B",
    "락",
    "댄스",
    "재즈",
    "클래식",
    "EDM",
    "국악",
  ];

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleNext = () => {
    setUserInfo({ gender, age, genres, isMusicRelated });
    onNext();
  };

  const isValid = gender && age && genres.length > 0 && isMusicRelated;

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <Link href={`/survey/${surveyId}`}>←</Link>
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: surveyTitle, href: `/survey/${surveyId}` },
            { label: "사용자 기본 정보 수집" },
          ]}
        />
        <div className="space-y-4">
          <h2 className="font-bold">성별</h2>
          <div className="flex gap-3">
            <Button
              color={gender === "남성" ? "blue" : "white"}
              onClick={() => setGender("남성")}
            >
              남성
            </Button>
            <Button
              color={gender === "여성" ? "blue" : "white"}
              onClick={() => setGender("여성")}
            >
              여성
            </Button>
          </div>

          <h2 className="font-bold">연령대</h2>
          <div className="flex flex-wrap gap-2">
            {["10대", "20대", "30대", "40대", "50대 이상"].map((a) => (
              <Button
                key={a}
                color={age === a ? "blue" : "white"}
                onClick={() => setAge(a)}
              >
                {a}
              </Button>
            ))}
          </div>

          <h2 className="font-bold">좋아하는 장르 (복수 선택)</h2>
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((g) => (
              <Button
                key={g}
                color={genres.includes(g) ? "blue" : "white"}
                onClick={() => toggleGenre(g)}
              >
                {g}
              </Button>
            ))}
          </div>

          <h2 className="font-bold">
            음악을 전공하셨거나 음악 관련 산업에 종사하고 계신가요?
          </h2>
          <div className="flex gap-3">
            <Button
              color={isMusicRelated === "예" ? "blue" : "white"}
              onClick={() => setIsMusicRelated("예")}
            >
              예
            </Button>
            <Button
              color={isMusicRelated === "아니오" ? "blue" : "white"}
              onClick={() => setIsMusicRelated("아니오")}
            >
              아니오
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <Button onClick={handleNext} disabled={!isValid} color="blue">
          다음
        </Button>
      </div>
    </>
  );
}
