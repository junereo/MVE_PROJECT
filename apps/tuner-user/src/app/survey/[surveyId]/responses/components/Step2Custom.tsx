"use client";

import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Step2Props {
  onPrev: () => void;
  onNext: () => void;
}

const dummySurvey = {
  id: 1,
  survey_title: "빈지노 Fashion Hoarder 설문",
};

export default function Step2Custom({ onPrev, onNext }: Step2Props) {
  const { id, survey_title } = dummySurvey;

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: `${survey_title}`, href: `/survey/${id}` },
            { label: "커스텀 설문" },
          ]}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="w-[180px] sm:w-[400px]">
          <Button onClick={onNext} color="blue">
            제출
          </Button>
        </div>
      </div>
    </>
  );
}
