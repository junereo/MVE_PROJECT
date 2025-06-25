"use client";

import { useState } from "react";
import Dropdown from "@/app/components/ui/DropDown";

const Survey = () => {
  const typeOptions = [
    { label: "객관식", value: "multiple" },
    { label: "체크박스형", value: "checkbox" },
    { label: "서술형", value: "subjective" },
  ] as const;

  type QuestionType = (typeof typeOptions)[number]["value"]; // ✅ 내부 상태 타입
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "multiple",
      options: ["", "", "", ""],
      text: "",
    },
  ]);
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "multiple",
        options: ["", "", "", ""],
        text: "",
      },
    ]);
  };
  // 질문 추가 함수
  const addOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };
  // 질문 삭제 함수
  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.filter((_, idx) => idx !== optIndex) }
          : q
      )
    );
  };
  // 질문 텍스트 변경 함수
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
                  : ["", "", "", ""],
            }
          : q
      )
    );
  };

  {
    /* 질문 영역 */
  }
  <div className="mt-6">
    {questions.map((q, index) => (
      <div key={q.id} className="mb-6 border p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">질문 {index + 1}</div>
          <Dropdown
            options={typeOptions.map((o) => o.label)}
            selected={
              typeOptions.find((o) => o.value === q.type)?.label ?? "유형 선택"
            }
            onSelect={(label: string) => {
              const found = typeOptions.find((o) => o.label === label);
              if (found) handleTypeChange(index, found.value);
            }}
          />
        </div>
        <input
          type="text"
          placeholder="질문을 입력해주세요"
          className="w-full mb-3 p-2 border rounded"
        />

        {/* 객관식/체크박스 옵션 */}
        {q.type === "multiple" || q.type === "checkbox" ? (
          <div className="space-y-2">
            {q.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`선택지 ${optIndex + 1}`}
                  className="w-full p-2 border rounded"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, optIndex, e.target.value)
                  }
                />
                {q.type === "checkbox" && (
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => removeOption(index, optIndex)}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            {q.type === "checkbox" && (
              <button
                type="button"
                onClick={() => addOption(index)}
                className="text-blue-500 mt-2"
              >
                + 선택지 추가
              </button>
            )}
          </div>
        ) : (
          <input
            type="text"
            placeholder="서술형 답변 예시"
            className="w-full p-2 border rounded"
          />
        )}
      </div>
    ))}

    <div className="flex justify-end mb-8">
      <button
        type="button"
        onClick={addQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + 질문 추가하기
      </button>
    </div>
  </div>;
};
export default Survey;
