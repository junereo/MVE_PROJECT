"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useEffect } from "react";
import { useSurveyInfo } from "@/features/users/store/useSurveyInfo";
import { InputTypeEnum } from "@/features/survey/types/enums";
import QuestionText from "@/app/survey/components/QuestionText";
import QuestionOptions from "@/app/survey/components/QuestionOptions";

interface Step1Props {
  surveyId: number;
  surveyTitle: string;
  onNext: () => void;
}

export default function Step1Info({
  surveyId,
  surveyTitle,
  onNext,
}: Step1Props) {
  const { gender, age, genres, isMusicRelated, setUserInfo } = useSurveyInfo();

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

  useEffect(() => {
    console.log("기본 정보", gender, age, genres, isMusicRelated);
  }, [gender, age, genres, isMusicRelated]);

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
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <QuestionText text="성별" />
            <QuestionOptions
              options={["남성", "여성"]}
              value={gender}
              onChange={(val) => setUserInfo({ gender: val as string })}
              type={InputTypeEnum.MULTIPLE}
              layout="horizontal"
            />
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <QuestionText text="연령대" />
            <QuestionOptions
              options={["10대", "20대", "30대", "40대", "50대 이상"]}
              value={age}
              onChange={(val) => setUserInfo({ age: val as string })}
              type={InputTypeEnum.MULTIPLE}
              layout="horizontal"
            />
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <QuestionText text="좋아하는 장르 (복수선택)" />
            <QuestionOptions
              options={genreOptions}
              value={genres}
              onChange={(val) => setUserInfo({ genres: val as string[] })}
              type={InputTypeEnum.CHECKBOX}
              layout="horizontal"
            />
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <QuestionText
              text={`음악을 전공하셨거나\n음악 관련 산업에 종사하고 계신가요?`}
            />
            <QuestionOptions
              options={["예", "아니오"]}
              value={isMusicRelated}
              onChange={(val) => setUserInfo({ isMusicRelated: val as string })}
              type={InputTypeEnum.MULTIPLE}
              layout="horizontal"
            />
          </section>
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
