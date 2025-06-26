"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import type { CustomQuestion } from "@/features/survey/store/useSurveyStore";
import { QuestionTypeEnum } from "@/features/survey/types/enums";
import { formatSurveyPayload } from "@/features/survey/utils/formatSurveyPayload";
import { createSurvey } from "@/features/survey/services/createSurvey";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import CustomForm from "../../components/CustomForm";

interface Step5Props {
  onPrev: () => void;
}

// 질문 타입 옵션 정의
const typeOptions = [
  { label: "객관식", value: QuestionTypeEnum.MULTIPLE },
  { label: "체크박스형", value: QuestionTypeEnum.CHECKBOX },
  { label: "서술형", value: QuestionTypeEnum.SUBJECTIVE },
];

export default function Step5Custom({ onPrev }: Step5Props) {
  const { setStep5 } = useSurveyStore();
  const [questions, setQuestions] = useState<CustomQuestion[]>([
    {
      id: 1,
      question_text: "",
      question_type: QuestionTypeEnum.MULTIPLE,
      options: ["", "", "", "", ""],
    },
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
      {
        id: newId,
        question_text: "",
        question_type: QuestionTypeEnum.MULTIPLE,
        options: ["", "", "", ""],
      },
    ]);
  };

  // 질문 텍스트 변경
  const handleQuestionChange = (index: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, question_text: text } : q))
    );
  };

  // 질문 유형 변경
  const handleTypeChange = (index: number, newType: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              question_type: newType as QuestionTypeEnum,
              options:
                newType === QuestionTypeEnum.SUBJECTIVE
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

  // !-완료 시 상태 저장 및 전체 설문 api 요청-!
  const handleSubmit = async () => {
    setStep5({ customQuestions: questions });
    try {
      const payload = formatSurveyPayload();

      await createSurvey(payload);

      // 설문 생성
      setModalContent({
        image: "check.png",
        description: "설문 생성을 완료했습니다.",
        buttonLabel: "확인",
        redirectTo: "/survey",
      });
      setIsModalOpen(true);
    } catch (err) {
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
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </header>

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
        <h2 className="text-xl font-bold">
          Step 5: 커스텀 설문 <span className="text-red-500">(선택)</span>
        </h2>

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

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[100px] sm:w-[200px]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="w-[140px] sm:w-[200px]">
          <Button color="white">임시저장</Button>
        </div>
        <div className="w-[180px] sm:w-[400px]">
          <Button onClick={handleSubmit} color="blue">
            생성 완료
          </Button>
        </div>
      </div>
    </>
  );
}
