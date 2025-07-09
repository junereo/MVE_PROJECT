'use client';

import React, { useEffect, useState } from 'react';
import { fetchFixedQuestions, createTemplate } from '@/lib/network/api';
import { QuestionTypeEnum } from '@/app/survey/create/complete/type';
import { Question_type, BackendQuestionPayload } from '@/types';
import fixedQuestions from './components/Templates';
import Dropdown from '../components/ui/DropDown';

// 클라이언트 질문 타입
export interface FixedQuestion {
    category: string;
    question_text: string;
    question_type: Question_type;
    type: QuestionTypeEnum;
    options: string[];
    max_num?: number;
}

// 서버로 보낼 전체 페이로드 타입
interface SurveyQuestionPayload {
    survey_id: number | string;
    Survey_question: string;
    question: Record<string, BackendQuestionPayload[]>;
    question_type: Question_type;
    question_order: number;
}

const defaultQuestion: FixedQuestion = {
    category: '',
    question_text: '',
    question_type: Question_type.fixed,
    type: QuestionTypeEnum.MULTIPLE,
    options: [],
    max_num: 1,
};

export default function FixedQuestionTemplatePage() {
    const [questions, setQuestions] = useState<FixedQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [questionnaireId, setQuestionnaireId] = useState<number | string>(1);

    useEffect(() => {
        fetchFixedQuestions(questionnaireId)
            .then((data) => {
                const questionObj = data?.data?.[0]?.question;
                if (questionObj) {
                    const mergedQuestions = Object.values(
                        questionObj,
                    ).flat() as FixedQuestion[];
                    setQuestions(
                        Array.isArray(mergedQuestions) ? mergedQuestions : [],
                    );
                } else {
                    setQuestions(fixedQuestions);
                }
                setInitLoading(false);
            })
            .catch(() => {
                setQuestions(fixedQuestions);
                setInitLoading(false);
            });
    }, [questionnaireId]);

    const handleChange = (
        idx: number,
        field: keyof FixedQuestion,
        value: string | string[] | number | QuestionTypeEnum | Question_type,
    ) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)),
        );
    };

    const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIdx
                    ? {
                          ...q,
                          options: q.options.map((opt, j) =>
                              j === oIdx ? value : opt,
                          ),
                      }
                    : q,
            ),
        );
    };

    const handleMaxNumChange = (idx: number, value: number) => {
        const safeValue = Math.max(1, value);
        setQuestions((prev) =>
            prev.map((q, i) => (i === idx ? { ...q, max_num: safeValue } : q)),
        );
    };

    const addOption = (qIdx: number) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIdx ? { ...q, options: [...q.options, ''] } : q,
            ),
        );
    };

    const removeOption = (qIdx: number, oIdx: number) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIdx
                    ? { ...q, options: q.options.filter((_, j) => j !== oIdx) }
                    : q,
            ),
        );
    };

    const addQuestion = () => {
        setQuestions((prev) => [...prev, { ...defaultQuestion }]);
    };

    const removeQuestion = (idx: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== idx));
    };

    const groupQuestionsToBackendFormat = (
        questions: FixedQuestion[],
    ): Record<string, BackendQuestionPayload[]> => {
        return questions.reduce((acc, q) => {
            if (!acc[q.category]) acc[q.category] = [];

            const typeString =
                q.type === QuestionTypeEnum.CHECKBOX
                    ? 'checkbox'
                    : q.type === QuestionTypeEnum.SUBJECTIVE
                    ? 'subjective'
                    : 'multiple';

            acc[q.category].push({
                question_text: q.question_text,
                type: typeString,
                question_type: Question_type.fixed,
                options: q.options,
                category: q.category,
                ...(q.type === QuestionTypeEnum.CHECKBOX && q.max_num
                    ? { max_num: q.max_num }
                    : {}),
            });

            return acc;
        }, {} as Record<string, BackendQuestionPayload[]>);
    };

    const save = async () => {
        setLoading(true);
        try {
            const grouped = groupQuestionsToBackendFormat(questions);
            const payload: SurveyQuestionPayload = {
                survey_id: questionnaireId,
                Survey_question: '고정 질문 템플릿',
                question: grouped,
                question_type: Question_type.fixed,
                question_order: 1,
            };
            await createTemplate(payload);
            alert('저장 완료!');
        } catch (error) {
            console.log(error);
            alert('저장 실패');
        } finally {
            setLoading(false);
        }
    };

    if (initLoading)
        return (
            <div className="flex justify-center items-center h-64 text-lg">
                로딩중...
            </div>
        );

    return (
        <div className="">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <div className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    고정 질문 템플릿 관리
                </div>

                <div className="flex items-center mb-6 gap-2">
                    <label className="font-semibold text-gray-700">
                        Questionnaire ID:
                    </label>
                    <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        value={questionnaireId}
                        onChange={(e) =>
                            setQuestionnaireId(Number(e.target.value))
                        }
                        min={1}
                    />
                </div>

                {questions.map((q, idx) => (
                    <div
                        key={idx}
                        className="mb-8 border p-4 rounded-lg bg-white shadow-sm"
                    >
                        {/* 질문 상단: 번호 + 드롭다운 + 삭제 버튼 */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="font-semibold text-sm text-gray-800">
                                질문 {idx + 1}
                            </div>

                            <div className="flex items-center gap-2">
                                {/* 질문 유형 드롭다운 */}
                                <Dropdown
                                    options={['객관식', '체크박스', '주관식']}
                                    selected={
                                        q.type === QuestionTypeEnum.CHECKBOX
                                            ? '체크박스'
                                            : q.type ===
                                              QuestionTypeEnum.SUBJECTIVE
                                            ? '주관식'
                                            : '객관식'
                                    }
                                    onSelect={(label) => {
                                        const type =
                                            label === '체크박스'
                                                ? QuestionTypeEnum.CHECKBOX
                                                : label === '주관식'
                                                ? QuestionTypeEnum.SUBJECTIVE
                                                : QuestionTypeEnum.MULTIPLE;
                                        handleChange(idx, 'type', type);
                                    }}
                                />

                                {/* 삭제 버튼 */}
                                <button
                                    onClick={() => removeQuestion(idx)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>

                        {/* 카테고리 라벨 + 인풋 */}
                        <label className="block text-sm font-semibold mb-1 text-gray-700">
                            카테고리
                        </label>
                        <input
                            className="border p-2 rounded w-full text-base mb-3"
                            value={q.category}
                            onChange={(e) =>
                                handleChange(idx, 'category', e.target.value)
                            }
                            placeholder="예: step1"
                        />

                        {/* 설문 제목 라벨 + 인풋 */}
                        <label className="block text-sm font-semibold mb-1 text-gray-700">
                            설문 제목
                        </label>
                        <input
                            className="border p-2 rounded w-full text-base mb-3"
                            value={q.question_text}
                            onChange={(e) =>
                                handleChange(
                                    idx,
                                    'question_text',
                                    e.target.value,
                                )
                            }
                            placeholder="예: 이 음원에 대한 첫인상은 어땠나요?"
                        />

                        {/* 선택지 입력 */}
                        <div className="ml-2 mt-1 space-y-2">
                            {q.options.map((opt, oIdx) => (
                                <div
                                    key={oIdx}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        className="border p-2 rounded text-base flex-1"
                                        value={opt}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                idx,
                                                oIdx,
                                                e.target.value,
                                            )
                                        }
                                        placeholder={`선택지 ${oIdx + 1}`}
                                    />
                                    <button
                                        className="text-xs text-red-400 hover:underline"
                                        onClick={() => removeOption(idx, oIdx)}
                                    >
                                        옵션 삭제
                                    </button>
                                </div>
                            ))}

                            {/* + 선택지 추가 버튼 */}
                            {(q.type === QuestionTypeEnum.MULTIPLE ||
                                q.type === QuestionTypeEnum.CHECKBOX) && (
                                <button
                                    className="text-xs text-blue-500 hover:underline"
                                    onClick={() => addOption(idx)}
                                >
                                    + 선택지 추가
                                </button>
                            )}

                            {/* 체크박스일 경우: 최대 선택 수 드롭다운 (선택지 하단에 위치) */}
                            {q.type === QuestionTypeEnum.CHECKBOX && (
                                <div className="flex items-center gap-2 mt-2">
                                    <label className="text-sm text-gray-600">
                                        최대 선택 수:
                                    </label>
                                    <Dropdown
                                        options={Array.from(
                                            { length: q.options.length },
                                            (_, i) => String(i + 1),
                                        )}
                                        selected={String(q.max_num || 1)}
                                        onSelect={(val) =>
                                            handleMaxNumChange(idx, Number(val))
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    className="w-full bg-gray-200 py-2 rounded mb-4 font-semibold hover:bg-gray-300"
                    onClick={addQuestion}
                >
                    + 질문 추가
                </button>

                <button
                    onClick={save}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 shadow"
                >
                    {loading ? '저장 중...' : '템플릿 저장하기'}
                </button>
            </div>
        </div>
    );
}
