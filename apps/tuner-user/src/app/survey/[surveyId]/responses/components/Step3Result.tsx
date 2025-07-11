"use client";

import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

interface Step3Props {
  onPrev: () => void;
  surveyId: number;
}

type StatusKey = "success" | "error" | "saved" | "save-error";

interface StatusUI {
  image: string;
  title: string;
  message: string;
  buttonText: string;
  link?: string;
}

const getStatusUI = (status: StatusKey, surveyId: number): StatusUI =>
  ({
    success: {
      image: "/images/check.png",
      title: "설문 제출 완료",
      message: "설문이 성공적으로 제출되었습니다.",
      buttonText: "설문 보기",
      link: `/survey/${surveyId}`,
    },
    error: {
      image: "/images/x.png",
      title: "설문 제출 실패",
      message: "문제가 발생했습니다. 다시 시도해 주세요.",
      buttonText: "뒤로 가기",
    },
    saved: {
      image: "/images/check.png",
      title: "임시저장 완료",
      message: "설문이 임시저장되었습니다.",
      buttonText: "설문 보기",
      link: `/survey/${surveyId}`,
    },
    "save-error": {
      image: "/images/x.png",
      title: "임시저장 실패",
      message: "임시저장 중 문제가 발생했습니다. 다시 시도해 주세요.",
      buttonText: "뒤로 가기",
    },
  }[status]);

export default function Step3Result({ surveyId, onPrev }: Step3Props) {
  const { surveySubmitStatus } = useAnswerStore();
  const status: StatusKey = surveySubmitStatus || "error";
  const ui = getStatusUI(status, surveyId);

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
