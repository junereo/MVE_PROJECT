"use client";

import { useEffect, useRef } from "react";
import Dropdown from "@/app/components/ui/DropDown";
import { QuestionTypeEnum } from "@/app/survey/create/complete/type";

interface CustomQuestion {
  id: number;
  question_text: string;
  question_type: QuestionTypeEnum;
  options: string[];
}

interface SurveyCustomFormProps {
  questions: CustomQuestion[];
  typeOptions: { label: string; value: QuestionTypeEnum }[];
  onAdd: () => void;
  onChangeText: (index: number, text: string) => void;
  onChangeType: (index: number, type: QuestionTypeEnum) => void;
  onChangeOption: (qIndex: number, optIndex: number, value: string) => void;
  onAddOption: (qIndex: number) => void;
}

export default function SurveyCustomForm({
  questions,
  typeOptions,
  onAdd,
  onChangeText,
  onChangeType,
  onChangeOption,
  onAddOption,
}: SurveyCustomFormProps) {
  const lastQuestionRef = useRef<HTMLDivElement>(null);

  // 마지막 질문으로 자동 스크롤 이동
  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [questions.length]);

  return (
    <div className="mb-12">
      <p className="text-lg font-semibold mb-4">커스텀 설문</p>

      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          ref={qIndex === questions.length - 1 ? lastQuestionRef : null}
          className="mb-6 border p-4 rounded"
        >
          {/* 질문 제목과 유형 드롭다운 */}
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">질문 {qIndex + 1}</div>
            <Dropdown
              options={typeOptions.map((o) => o.label)}
              selected={
                typeOptions.find((o) => o.value === q.question_type)?.label ??
                "유형 선택"
              }
              onSelect={(label: string) => {
                const selectedOption = typeOptions.find(
                  (opt) => opt.label === label
                );
                if (selectedOption) {
                  onChangeType(qIndex, selectedOption.value);
                }
              }}
            />
          </div>

          {/* 질문 텍스트 입력 */}
          <input
            type="text"
            placeholder="질문을 입력해주세요"
            className="w-full mb-3 p-2 border rounded"
            value={q.question_text}
            onChange={(e) => onChangeText(qIndex, e.target.value)}
          />

          {/* 객관식/체크박스형일 경우 선택지 */}
          {q.question_type === QuestionTypeEnum.MULTIPLE ||
          q.question_type === QuestionTypeEnum.CHECKBOX ? (
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`선택지 ${optIndex + 1}`}
                  className="w-full p-2 border rounded"
                  value={opt}
                  onChange={(e) =>
                    onChangeOption(qIndex, optIndex, e.target.value)
                  }
                />
              ))}

              {/* 체크박스형일 경우에만 선택지 추가 허용 */}
              {q.question_type === QuestionTypeEnum.CHECKBOX &&
                q.options.length < 8 && (
                  <button
                    type="button"
                    onClick={() => onAddOption(qIndex)}
                    className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  >
                    + 선택지 추가하기
                  </button>
                )}
            </div>
          ) : (
            // 서술형일 경우 비활성화 예시 input
            <input
              type="text"
              placeholder="서술형 답변 예시"
              className="w-full p-2 border rounded"
              disabled
            />
          )}
        </div>
      ))}

      {/* 질문 추가 버튼 */}
      <div className="text-right">
        <button
          onClick={onAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + 설문 추가하기
        </button>
      </div>
    </div>
  );
}
