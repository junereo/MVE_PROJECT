"use client";

import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

interface Step6Props {
  onPrev: () => void;
}

type StatusKey = "success" | "error" | "saved" | "save-error";

interface StatusUI {
  image: string;
  title: string;
  message: string;
  buttonText: string;
  link?: string;
}

const statusMap: Record<StatusKey, StatusUI> = {
  success: {
    image: "/images/check.png",
    title: "설문 생성 완료",
    message: "설문이 성공적으로 생성되었습니다.",
    buttonText: "설문 보기",
  },
  error: {
    image: "/images/x.png",
    title: "설문 생성 실패",
    message: "문제가 발생했습니다. 다시 시도해 주세요.",
    buttonText: "뒤로 가기",
  },
  saved: {
    image: "/images/check.png",
    title: "임시저장 완료",
    message: "설문이 임시 저장되었습니다.",
    buttonText: "설문 목록으로 이동",
    link: "/survey",
  },
  "save-error": {
    image: "/images/x.png",
    title: "임시저장 실패",
    message: "임시저장에 실패했습니다. 다시 시도해 주세요.",
    buttonText: "뒤로 가기",
  },
};

export default function Step5Result({ onPrev }: Step6Props) {
  const { surveySubmitStatus, createdSurveyId } = useSurveyStore();

  const status: StatusKey = surveySubmitStatus || "error";
  const ui = statusMap[status];

  const dynamicLink =
    status === "success" && createdSurveyId
      ? `/survey/${createdSurveyId}`
      : ui.link;

  return (
    <div className="flex justify-center px-4">
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

        {dynamicLink ? (
          <Link href={dynamicLink} className="w-full">
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
