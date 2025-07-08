'use client';

import React, { useEffect, useState } from 'react';
import { fetchFixedQuestions, createTemplate } from '@/lib/network/api';
import { QuestionTypeEnum } from '@/app/survey/create/complete/type';
import { Question_type } from '@/types';
import fixedQuestions from './components/Templates';

// 클라이언트 질문 타입
export interface FixedQuestion {
    category: string;
    question_text: string;
    question_type: Question_type;
    type: QuestionTypeEnum;
    options: string[];
    max_num?: number;
}

// 서버로 보낼 질문 항목 타입
interface BackendQuestionPayload {
    question_text: string;
    question_type: string;
    type: string;
    options: string[];
    category?: string;
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
        setQuestions((prev) =>
            prev.map((q, i) => (i === idx ? { ...q, max_num: value } : q)),
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

    //  서버 전송용 포맷으로 그룹핑
    const groupQuestionsToBackendFormat = (
        questions: FixedQuestion[],
    ): Record<string, BackendQuestionPayload[]> => {
        return questions.reduce((acc, q) => {
            if (!acc[q.category]) acc[q.category] = [];
            acc[q.category].push({
                question_text: q.question_text,
                type: q.type.toLowerCase(),
                question_type: Question_type.fixed,
                options: q.options,
                category: q.category,
                ...(q.max_num ? { max_num: q.max_num } : {}),
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <div className="text-3xl font-extrabold text-blue-700 mb-6 text-center drop-shadow">
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
                        className="mb-8 border-b pb-6 bg-gray-50 rounded-xl p-4 shadow-sm"
                    >
                        <div className="flex flex-col md:flex-row gap-2 mb-2">
                            <input
                                className="border p-2 rounded flex-1 text-base"
                                value={q.category}
                                onChange={(e) =>
                                    handleChange(
                                        idx,
                                        'category',
                                        e.target.value,
                                    )
                                }
                                placeholder="카테고리"
                            />
                        </div>
                        <div>
                            <input
                                className="border p-2 rounded flex-1 text-base w-full"
                                value={q.question_text}
                                onChange={(e) =>
                                    handleChange(
                                        idx,
                                        'question_text',
                                        e.target.value,
                                    )
                                }
                                placeholder="질문"
                            />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <select
                                className="border p-2 rounded text-base"
                                value={q.type}
                                onChange={(e) =>
                                    handleChange(
                                        idx,
                                        'type',
                                        e.target.value as QuestionTypeEnum,
                                    )
                                }
                            >
                                <option value={QuestionTypeEnum.MULTIPLE}>
                                    객관식
                                </option>
                                <option value={QuestionTypeEnum.CHECKBOX}>
                                    체크박스
                                </option>
                                <option value={QuestionTypeEnum.SUBJECTIVE}>
                                    주관식
                                </option>
                            </select>
                            <button
                                className="ml-2 text-red-500 hover:underline"
                                onClick={() => removeQuestion(idx)}
                            >
                                삭제
                            </button>
                        </div>
                        <div className="ml-2 mt-2">
                            {q.options.map((opt, oIdx) => (
                                <div
                                    key={oIdx}
                                    className="flex items-center mb-1 gap-2"
                                >
                                    <input
                                        className="border p-1 rounded text-base"
                                        value={opt}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                idx,
                                                oIdx,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="옵션"
                                    />
                                    <button
                                        className="text-xs text-red-400 hover:underline"
                                        onClick={() => removeOption(idx, oIdx)}
                                    >
                                        옵션 삭제
                                    </button>
                                </div>
                            ))}
                            {(q.type === QuestionTypeEnum.MULTIPLE ||
                                q.type === QuestionTypeEnum.CHECKBOX) && (
                                <button
                                    className="text-xs text-blue-500 hover:underline mt-1"
                                    onClick={() => addOption(idx)}
                                >
                                    옵션 추가
                                </button>
                            )}
                        </div>
                        {q.type === QuestionTypeEnum.CHECKBOX && (
                            <div className="flex items-center gap-2 mt-2">
                                <label className="text-sm text-gray-600">
                                    최대 선택 가능 수:
                                </label>
                                <select
                                    className="border p-1 rounded text-base"
                                    value={q.max_num || 1}
                                    onChange={(e) =>
                                        handleMaxNumChange(
                                            idx,
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    {Array.from(
                                        { length: q.options.length },
                                        (_, i) => i + 1,
                                    ).map((i) => (
                                        <option key={i} value={i}>
                                            {i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                ))}
                <button
                    className="w-full bg-gray-200 py-2 rounded mb-4 font-semibold hover:bg-gray-300"
                    onClick={addQuestion}
                >
                    질문 추가
                </button>
                <button
                    onClick={save}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-3 rounded-md font-bold text-lg hover:from-blue-700 hover:to-purple-600 transition disabled:opacity-50 shadow-lg"
                >
                    {loading ? '저장 중...' : '템플릿 저장하기'}
                </button>
            </div>
        </div>
    );
}
