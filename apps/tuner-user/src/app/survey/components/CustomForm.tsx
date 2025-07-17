"use client";

import { useEffect, useRef } from "react";
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
  onChangeMaxNum: (id: number, max: number) => void;
  onRemoveOption: (qId: number, oIndex: number) => void;
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
  onChangeMaxNum,
  onRemoveOption,
}: CustomFormProps) {
  const lastQuestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [questions.length]);

  return (
    <div className="flex flex-col gap-8 pb-28">
      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          ref={qIndex === questions.length - 1 ? lastQuestionRef : null}
          className="relative rounded-xl border bg-white p-5 space-y-4 shadow-sm"
        >
          {/* 질문 번호 + 삭제 버튼 */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-800">{`질문 ${
              qIndex + 1
            }`}</h3>
            <button
              type="button"
              onClick={() => onRemove(qIndex)}
              className="text-sm text-gray-400 hover:text-red-500"
            >
              삭제
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

          {/* 객관식 */}
          {q.type === InputTypeEnum.MULTIPLE && (
            <div className="space-y-2">
              {[...Array(5)].map((_, optIndex) => (
                <input
                  key={`${q.id}-m-${optIndex}`}
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

          {/* 체크박스 */}
          {q.type === InputTypeEnum.CHECKBOX && (
            <div className="space-y-2">
              {/* 최대 선택 개수 */}
              {q.type === InputTypeEnum.CHECKBOX && (
                <div className="flex justify-end items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700 pt-2">
                    최대 선택 개수
                  </label>

                  <div className="w-32">
                    <Dropdown
                      options={
                        q.options && q.options.length > 0
                          ? Array.from({ length: q.options.length }, (_, i) =>
                              String(i + 1)
                            )
                          : ["1"]
                      }
                      selected={String(q.max_num ?? "")}
                      onSelect={(val) => onChangeMaxNum(q.id, Number(val))}
                    />
                  </div>
                  {q.max_num && q.options && q.max_num > q.options.length && (
                    <p className="text-sm text-red-500">
                      ⚠ 최대 선택 수는 선택지 수보다 클 수 없습니다.
                    </p>
                  )}
                </div>
              )}
              {(q.options ?? []).map((opt, optIndex) => (
                <div
                  key={`${q.id}-c-${optIndex}`}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      onChangeOption(q.id, optIndex, e.target.value)
                    }
                    placeholder={`선택지 ${optIndex + 1}`}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveOption(q.id, optIndex)}
                    className="text-xs text-red-400 hover:underline whitespace-nowrap"
                  >
                    옵션 삭제
                  </button>
                </div>
              ))}

              {(q.options?.length ?? 0) < 8 && (
                <button
                  type="button"
                  onClick={() => onAddOption(q.id)}
                  className="text-[#57CC7E] text-sm font-medium underline hover:opacity-80 transition"
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

      <Button onClick={onAdd} color="green">
        커스텀 설문 추가
      </Button>
    </div>
  );
}
