"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/DropDown";
import { InputTypeEnum } from "@/features/survey/types/enums";
import { Questions } from "@/features/survey/store/useSurveyStore";

interface CustomFormProps {
  questions: Questions[];
  typeOptions: { label: string; value: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChangeText: (id: number, value: string) => void;
  onChangeType: (id: number, type: string) => void;
  onChangeOption: (qId: number, oIndex: number, value: string) => void;
  onAddOption: (qId: number) => void;
}

export default function CustomForm({
  questions,
  typeOptions,
  onAdd,
  onRemove,
  onChangeText,
  onChangeType,
  onChangeOption,
  onAddOption,
}: CustomFormProps) {
  return (
    <div className="space-y-6 pb-20">
      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          className="relative rounded-xl border bg-white p-5 space-y-4 shadow-sm"
        >
          {/* 질문 번호 + 삭제 버튼 */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-gray-800">{`질문 ${
              qIndex + 1
            }`}</h3>
            <button
              type="button"
              onClick={() => onRemove(qIndex)}
              className="text-xs text-gray-400 hover:text-red-500 font-bold"
            >
              X
            </button>
          </div>

          {/* 유형 드롭다운 */}
          <Dropdown
            options={typeOptions.map((o) => o.label)}
            selected={
              typeOptions.find((o) => o.value === q.type)?.label ?? "유형 선택"
            }
            onSelect={(label: string) => {
              const found = typeOptions.find((o) => o.label === label);
              if (found) onChangeType(q.id, found.value);
            }}
          />

          {/* 질문 입력 */}
          <Input
            label="질문 내용"
            value={q.question_text}
            onChange={(e) => onChangeText(q.id, e.target.value)}
          />

          {/* 객관식 (5개 고정) */}
          {q.type === InputTypeEnum.MULTIPLE && (
            <div className="space-y-2">
              {[...Array(5)].map((_, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={q.options?.[optIndex] ?? ""}
                  onChange={(e) =>
                    onChangeOption(q.id, optIndex, e.target.value)
                  }
                  placeholder={`선택지 ${optIndex + 1}`}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              ))}
            </div>
          )}

          {/* 체크박스형 (기본 5개, 최대 8개) */}
          {q.type === InputTypeEnum.CHECKBOX && (
            <div className="space-y-2">
              {(q.options ?? []).map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    onChangeOption(q.id, optIndex, e.target.value)
                  }
                  placeholder={`선택지 ${optIndex + 1}`}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              ))}

              {(q.options?.length ?? 0) < 8 && (
                <button
                  type="button"
                  onClick={() => onAddOption(q.id)}
                  className="text-xs text-blue-500 underline mt-1"
                >
                  + 선택지 추가
                </button>
              )}
            </div>
          )}

          {/* 서술형 */}
          {q.type === InputTypeEnum.SUBJECTIVE && (
            <textarea
              className="w-full p-2 border rounded text-sm"
              placeholder="서술형 답변을 입력해주세요"
              rows={3}
              disabled
            />
          )}
        </div>
      ))}

      <Button onClick={onAdd} color="blue">
        커스텀 설문 추가
      </Button>
    </div>
  );
}
