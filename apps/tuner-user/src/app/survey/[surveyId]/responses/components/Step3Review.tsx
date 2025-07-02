"use client";

import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

interface Step3Props {
  onPrev: () => void;
}

type StatusKey = "success" | "error";

interface StatusUI {
  image: string;
  title: string;
  message: string;
  buttonText: string;
  link?: string; // 선택적 링크
}

interface dummySurveyTypes {
  id: number;
  survey_title: string;
}

const dummySurvey: dummySurveyTypes = {
  id: 1,
  survey_title: "빈지노 Fashion Hoarder 설문",
};

const statusMap: Record<StatusKey, StatusUI> = {
  success: {
    image: "/images/check.png",
    title: "설문 제출 완료",
    message: "설문이 성공적으로 제출되었습니다.",
    buttonText: "설문 보기",
    link: `/survey/${dummySurvey.id}`,
  },
  error: {
    image: "/images/x.png",
    title: "설문 제출 실패",
    message: "문제가 발생했습니다. 다시 시도해 주세요.",
    buttonText: "뒤로 가기",
  },
};

export default function Step3Review({ onPrev }: Step3Props) {
  const { surveySubmitStatus } = useAnswerStore();

  const status: StatusKey = surveySubmitStatus || "error";
  const ui = statusMap[status];

  return (
    <div className="min-h-screen flex justify-center px-4">
      <div className="bg-white w-full max-w-[485px] py-10 text-center flex flex-col justify-center items-center gap-10">
        <Image
          src={ui.image}
          alt={status}
          width={64}
          height={64}
          className="object-contain"
        />
        <div className="text-xl font-bold text-gray-800">
          <p>{ui.title}</p>
          <p className="text-base text-gray-600 mt-2">{ui.message}</p>
        </div>

        {ui.link ? (
          <Link href={ui.link} className="w-full">
            <Button color="blue">{ui.buttonText}</Button>
          </Link>
        ) : (
          <Button color="red" onClick={onPrev}>
            {ui.buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
