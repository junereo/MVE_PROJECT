"use client";

import { useEffect, useRef } from "react";
import Dropdown from "@/components/ui/DropDown";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CustomQuestion {
  id: number;
  text: string;
  type: string;
  options: string[];
}

interface CustomFormProps {
  questions: CustomQuestion[];
  typeOptions: { label: string; value: string }[];
  onAdd: () => void;
  onChangeText: (index: number, value: string) => void;
  onChangeType: (index: number, type: string) => void;
  onChangeOption: (qIndex: number, oIndex: number, value: string) => void;
  onAddOption: (qIndex: number) => void;
}

export default function CustomForm({
  questions,
  typeOptions,
  onAdd,
  onChangeText,
  onChangeType,
  onChangeOption,
  onAddOption,
}: CustomFormProps) {
  const lastQuestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [questions.length]);

  return (
    <div className="space-y-6 pb-12">
      <div className="text-right">
        <Button onClick={onAdd} color="blue">
          + 설문 항목 추가
        </Button>
      </div>

      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          ref={qIndex === questions.length - 1 ? lastQuestionRef : null}
          className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              질문 {qIndex + 1}
            </h3>
            <div className="w-40">
              <Dropdown
                options={typeOptions.map((o) => o.label)}
                selected={
                  typeOptions.find((o) => o.value === q.type)?.label ??
                  "유형 선택"
                }
                onSelect={(label: string) => {
                  const found = typeOptions.find((o) => o.label === label);
                  if (found) onChangeType(qIndex, found.value);
                }}
              />
            </div>
          </div>

          <Input
            placeholder="질문을 입력해주세요"
            value={q.text}
            onChange={(e) => onChangeText(qIndex, e.target.value)}
          />

          {(q.type === "multiple" || q.type === "checkbox") && (
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-3">
                  <span
                    className={`inline-block w-4 h-4 ${
                      q.type === "multiple"
                        ? "rounded-full border"
                        : "rounded-sm border"
                    } border-gray-400 flex-shrink-0`}
                  />
                  <Input
                    placeholder={`선택지 ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      onChangeOption(qIndex, optIndex, e.target.value)
                    }
                  />
                </div>
              ))}
              {q.type === "checkbox" && q.options.length < 8 && (
                <button
                  type="button"
                  onClick={() => onAddOption(qIndex)}
                  className="text-blue-500 text-xs underline ml-6 mt-1"
                >
                  + 선택지 추가
                </button>
              )}
            </div>
          )}

          {q.type === "subjective" && (
            <textarea
              className="w-full p-2 border rounded-md text-sm bg-gray-50 text-gray-500"
              placeholder="서술형 답변 예시"
              rows={3}
              disabled
            />
          )}
        </div>
      ))}
    </div>
  );
}
