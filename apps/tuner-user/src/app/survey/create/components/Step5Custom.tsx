"use client";

import { useState } from "react";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import type { CustomQuestion } from "@/features/survey/store/useSurveyStore";
import {
  InputTypeEnum,
  QuestionTypeEnum,
  SurveyStatusEnum,
} from "@/features/survey/types/enums";
import { formatSurveyPayload } from "@/features/survey/utils/formatSurveyPayload";
import { createSurvey } from "@/features/survey/services/survey";
import Button from "@/components/ui/Button";
import CustomForm from "../../components/CustomForm";

interface Step5Props {
  onPrev: () => void;
  onNext: () => void;
}

// 질문 타입 옵션 정의
const typeOptions = [
  { label: "객관식", value: InputTypeEnum.MULTIPLE },
  { label: "체크박스형", value: InputTypeEnum.CHECKBOX },
  { label: "서술형", value: InputTypeEnum.SUBJECTIVE },
];

export default function Step5Custom({ onPrev, onNext }: Step5Props) {
  const { setStep5, setSurveySubmitStatus } = useSurveyStore();
  const [questions, setQuestions] = useState<CustomQuestion[]>([
    {
      id: 1,
      question_type: QuestionTypeEnum.CUSTOM,
      question_text: "",
      type: InputTypeEnum.MULTIPLE,
      options: ["", "", "", "", ""],
    },
  ]);

  // 질문 추가
  const addCustomQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        question_type: QuestionTypeEnum.CUSTOM,
        question_text: "",
        type: InputTypeEnum.MULTIPLE,
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
              type: newType as InputTypeEnum,
              options:
                newType === InputTypeEnum.SUBJECTIVE
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

  // 설문 생성
  const handleSubmit = async () => {
    setStep5({ customQuestions: questions });

    try {
      const payload = formatSurveyPayload(SurveyStatusEnum.COMPLETE);
      await createSurvey(payload);
      setSurveySubmitStatus("success");
      onNext();
    } catch (err) {
      console.error("설문 생성 에러", err);
      setSurveySubmitStatus("error");
      onNext();
    }
  };

  // 임시저장
  const handleSave = async () => {
    setStep5({ customQuestions: questions });

    try {
      const payload = formatSurveyPayload(SurveyStatusEnum.DRAFT);
      await createSurvey(payload);
      setSurveySubmitStatus("saved"); // 임시저장 성공 상태로 업데이트
      onNext();
    } catch (err) {
      console.error("임시저장 에러", err);
      setSurveySubmitStatus("save-error"); // 실패 상태로 업데이트
      onNext();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </header>

      <div className="space-y-4 min-h-screen">
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
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="flex items-center">
          <div className="w-[70px] sm:w-[100px]">
            <Button onClick={handleSave} color="white">
              임시저장
            </Button>
          </div>
          <div className="w-[110px] sm:w-[300px]">
            <Button onClick={handleSubmit} color="blue">
              설문 생성
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
