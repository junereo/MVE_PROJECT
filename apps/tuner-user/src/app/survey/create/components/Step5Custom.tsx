"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import type {
  CustomQuestion,
  QuestionType,
} from "@/features/survey/store/useSurveyStore";
import { useSubmitSurvey } from "@/features/survey/hooks/useSubmitSurvey";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import CustomForm from "../../components/CustomForm";

interface Step5Props {
  onPrev: () => void;
}

// 질문 타입 옵션 정의
const typeOptions = [
  { label: "객관식", value: "multiple" },
  { label: "체크박스형", value: "checkbox" },
  { label: "서술형", value: "subjective" },
];

export default function Step5Custom({ onPrev }: Step5Props) {
  const { setStep5 } = useSurveyStore();
  const { submit } = useSubmitSurvey();
  const [questions, setQuestions] = useState<CustomQuestion[]>([
    { id: 1, text: "", type: "multiple", options: ["", "", "", "", ""] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    image: "",
    description: "",
    buttonLabel: "",
    redirectTo: "",
  });

  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setIsModalOpen(false);
    router.push(modalContent.redirectTo);
  };

  // 질문 추가
  const addCustomQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      { id: newId, text: "", type: "multiple", options: ["", "", "", ""] },
    ]);
  };

  // 질문 텍스트 변경
  const handleQuestionChange = (index: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text } : q))
    );
  };

  // 질문 유형 변경
  const handleTypeChange = (index: number, newType: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              type: newType as QuestionType,
              options:
                newType === "subjective"
                  ? []
                  : q.options.length
                  ? q.options
                  : ["", "", "", "", ""],
            }
          : q
      )
    );
  };

  // 옵션 추가
  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex && q.options.length < 8
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  // 옵션 내용 수정
  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  // !-완료 시 전체 설문 api 요청 필요-!
  const handleSubmit = async () => {
    setStep5({ customQuestions: questions });
    try {
      await submit();
      // 설문 생성
      setModalContent({
        image: "check.png",
        description: "설문 생성을 완료했습니다.",
        buttonLabel: "확인",
        redirectTo: "/survey",
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error("설문 제출 실패", err);
      // 설문 생성 실패
      setModalContent({
        image: "x.png",
        description: `${err}`,
        buttonLabel: "다시 시도하기",
        redirectTo: "/survey/create?step=step5",
      });
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex  bg-white text-black border border-red-500 z-30 items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="space-y-4 min-h-screen">
        {isModalOpen && (
          <Modal
            image={modalContent.image}
            description={modalContent.description}
            buttonLabel={modalContent.buttonLabel}
            onClick={handleNext}
            onClose={handleClose}
            color={modalContent.image === "check.png" ? "blue" : "red"}
          />
        )}
        <h2 className="text-xl font-bold">Step 5: 커스텀 설문</h2>

        <div className="space-y-2">
          <CustomForm
            questions={questions}
            typeOptions={typeOptions}
            onAdd={addCustomQuestion}
            onChangeText={handleQuestionChange}
            onChangeType={handleTypeChange}
            onChangeOption={handleOptionChange}
            onAddOption={handleAddOption}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] p-3 flex items-center bg-white text-black border border-green-700 z-30 justify-end gap-3">
        <div className="flex-[1.5]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="flex-[2]">
          <Button onClick={handleSubmit} color="blue">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
