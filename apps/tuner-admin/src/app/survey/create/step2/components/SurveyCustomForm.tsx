'use client';

import { useEffect, useRef } from 'react';
import Dropdown from '@/app/components/ui/DropDown';
import { QuestionTypeEnum } from '@/app/survey/create/complete/type';
import { Question } from '../page';

interface SurveyCustomFormProps {
    questions: Question[];
    typeOptions: { label: string; value: QuestionTypeEnum }[];
    onAdd: () => void;
    onChangeText: (index: number, text: string) => void;
    onChangeType: (index: number, type: QuestionTypeEnum) => void;
    onChangeOption: (qIndex: number, optIndex: number, value: string) => void;
    onAddOption: (qIndex: number) => void;
    onRemove: (id: number) => void;
    onChangeMaxNum: (index: number, max: number) => void;
    onRemoveOption: (qIndex: number, optIndex: number) => void;
}

export default function SurveyCustomForm({
    questions,
    typeOptions,
    onAdd,
    onChangeText,
    onChangeType,
    onChangeOption,
    onAddOption,
    onRemove,
    onChangeMaxNum,
    onRemoveOption,
}: SurveyCustomFormProps) {
    const lastQuestionRef = useRef<HTMLDivElement>(null);

    // 마지막 질문으로 자동 스크롤 이동
    useEffect(() => {
        if (lastQuestionRef.current) {
            lastQuestionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [questions.length]);

    return (
        <div className="mb-12">
            <p className="text-lg font-semibold mb-4">커스텀 설문</p>

            {questions.map((q, qIndex) => (
                <div
                    key={q.id}
                    ref={
                        qIndex === questions.length - 1 ? lastQuestionRef : null
                    }
                    className="mb-6 border p-4 rounded relative"
                >
                    <button
                        onClick={() => onRemove(q.id)}
                        className="absolute top-0 right-1  text-blue-500 text-sm hover:text-red-500"
                        title="질문 삭제"
                    >
                        ✕
                    </button>

                    {/* 질문 제목 + 드롭다운 */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">질문 {qIndex + 1}</div>
                        <Dropdown
                            options={typeOptions.map((o) => o.label)}
                            selected={
                                typeOptions.find((o) => o.value === q.type)
                                    ?.label ?? '유형 선택'
                            }
                            onSelect={(label: string) => {
                                const selectedOption = typeOptions.find(
                                    (opt) => opt.label === label,
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
                    {q.type === QuestionTypeEnum.MULTIPLE ||
                    q.type === QuestionTypeEnum.CHECKBOX ? (
                        <div className="space-y-2">
                            {q.options.map((opt, optIndex) => (
                                <div
                                    key={optIndex}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        placeholder={`선택지 ${optIndex + 1}`}
                                        className="w-full p-2 border rounded"
                                        value={opt}
                                        onChange={(e) =>
                                            onChangeOption(
                                                qIndex,
                                                optIndex,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {q.options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemoveOption(qIndex, optIndex)
                                            }
                                            className="text-xs text-red-400 hover:underline whitespace-nowrap"
                                        >
                                            옵션 삭제
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* 체크박스형일 경우에만 선택지 추가 허용 */}
                            {(q.type === QuestionTypeEnum.MULTIPLE ||
                                q.type === QuestionTypeEnum.CHECKBOX) &&
                                q.options.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={() => onAddOption(qIndex)}
                                        className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                                    >
                                        + 선택지 추가하기
                                    </button>
                                )}

                            {/* 체크박스형일 경우 최대 선택 수 설정 */}
                            {q.type === QuestionTypeEnum.CHECKBOX && (
                                <div className="mt-2">
                                    <label className="text-sm mr-2">
                                        최대 선택 개수:
                                    </label>
                                    <Dropdown
                                        options={Array.from(
                                            { length: q.options.length },
                                            (_, i) => String(i + 1),
                                        )}
                                        selected={String(q.max_num)}
                                        onSelect={(val) =>
                                            onChangeMaxNum(qIndex, Number(val))
                                        }
                                    />

                                    {q.max_num! > q.options.length && (
                                        <p className="text-red-500 text-sm mt-1">
                                            ⚠ 최대 선택 수는 선택지 수보다 클 수
                                            없습니다.
                                        </p>
                                    )}
                                </div>
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
