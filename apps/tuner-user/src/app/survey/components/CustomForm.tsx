"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/DropDown";
import Disclosure from "@/components/ui/Disclosure";
import type { CustomQuestion } from "@/features/survey/store/useSurveyStore";
import { InputTypeEnum } from "@/features/survey/types/enums";

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
  return (
    <div className="space-y-6 pb-20">
      {questions.map((q, qIndex) => (
        <Disclosure
          key={q.id}
          title={`질문 ${qIndex + 1}`}
          defaultOpen={qIndex === questions.length - 1}
        >
          <div className="rounded-lg bg-white border p-4 space-y-4">
            <div className="w-full">
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
            <div className="flex flex-col gap-4 w-full">
              <Input
                label="질문 내용"
                value={q.question_text}
                onChange={(e) => onChangeText(qIndex, e.target.value)}
              />
            </div>

            {q.type === InputTypeEnum.MULTIPLE && (
              <div className="space-y-3 w-full">
                {[...Array(5)].map((_, optIndex) => (
                  <div
                    key={optIndex}
                    className="flex items-center gap-2 w-full"
                  >
                    <span className="w-5 h-5 rounded-full border border-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={q.options[optIndex] ?? ""}
                      onChange={(e) =>
                        onChangeOption(qIndex, optIndex, e.target.value)
                      }
                      placeholder={`선택지 ${optIndex + 1}`}
                      className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {q.type === InputTypeEnum.CHECKBOX && (
              <div className="space-y-3 w-full">
                {q.options.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className="flex items-center gap-2 w-full"
                  >
                    <span className="w-5 h-5 border border-gray-400 rounded-sm flex-shrink-0" />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        onChangeOption(qIndex, optIndex, e.target.value)
                      }
                      placeholder={`선택지 ${optIndex + 1}`}
                      className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                {q.options.length < 8 && (
                  <button
                    type="button"
                    onClick={() => onAddOption(qIndex)}
                    className="mt-1 text-blue-500 text-xs underline"
                  >
                    + 선택지 추가
                  </button>
                )}
              </div>
            )}

            {q.type === InputTypeEnum.SUBJECTIVE && (
              <textarea
                className="w-full p-2 border rounded text-sm"
                placeholder="서술형 답변을 입력해주세요"
                rows={3}
                disabled
              />
            )}
          </div>
        </Disclosure>
      ))}

      <div className="pt-4">
        <Button onClick={onAdd} color="blue">
          설문 항목 추가
        </Button>
      </div>
    </div>
  );
}
