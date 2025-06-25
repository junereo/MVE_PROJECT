"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CustomForm from "../../components/CustomForm"; // 상대 경로 확인

interface Step5Props {
  onPrev: () => void;
}

// 질문 타입 옵션 정의
const typeOptions = [
  { label: "객관식", value: "multiple" },
  { label: "체크박스형", value: "checkbox" },
  { label: "서술형", value: "subjective" },
];

type QuestionType = (typeof typeOptions)[number]["value"];

type Question = {
  id: number;
  text: string;
  type: QuestionType;
  options: string[];
};

export default function Step5Custom({ onPrev }: Step5Props) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "", type: "multiple", options: ["", "", "", "", ""] },
  ]);

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

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex  bg-white text-black border border-red-500 z-30 items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="p-4 space-y-6 min-h-screen">
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

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] items-center bg-white text-black border border-green-700 px-4 py-2 z-30 flex justify-end pt-4">
        <Button onClick={onPrev} color="white">
          이전
        </Button>
        <Button color="blue">작성 완료</Button>
      </div>
    </>
  );
}
