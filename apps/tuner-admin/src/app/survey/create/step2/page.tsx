'use client';

import { useState, useEffect } from 'react';
import { useSurveyStore } from '@/store/useSurveyCreateStore';
import { useRouter } from 'next/navigation';
import SurveyTabs from '@/app/survey/create/step2/components/SurveyTabs';
// import SurveyQuestionBase from '@/app/survey/create/step2/components/SurveyQuestionBase';
import SurveyCustomForm from '@/app/survey/create/step2/components/SurveyCustomForm';
import SurveyActions from '@/app/survey/create/step2/components/SurveyActions';
import SurveyNavigation from '@/app/survey/create/step2/components/SurveyNavigation';
import { fetchTemplates, surveyCreate } from '@/lib/network/api';
import { QuestionTypeEnum } from '@/app/survey/create/complete/type';
import { Question_type, SurveyStatus } from '@/types';

interface RawTemplateQuestion {
    question_text: string;
    question_type: string;
    options: string[];
    category: string;
    type: string;
    max_num?: number;
}

export interface Question {
    id: number;
    question_text: string;
    question_type: Question_type;
    type: QuestionTypeEnum;
    options: string[];
    category?: string;
    max_num?: number;
}

export default function SurveyStep2() {
    const router = useRouter();
    const { step1, step2, setStep2, setTemplateSetKey } = useSurveyStore();
    const baseCategories = [
        { key: 'step1', label: 'Step 1' },
        { key: 'step2', label: 'Step 2' },
        { key: 'step3', label: 'Step 3' },
    ];

    const typeOptions = [
        { label: '객관식', value: QuestionTypeEnum.MULTIPLE },
        { label: '체크박스형', value: QuestionTypeEnum.CHECKBOX },
        { label: '서술형', value: QuestionTypeEnum.SUBJECTIVE },
    ];

    const [tabIndex, setTabIndex] = useState(0);
    const allTabs = baseCategories;
    const currentTab = allTabs[tabIndex];

    const [categoryQuestions, setCategoryQuestions] = useState<
        Record<string, Question[]>
    >({});
    const [customQuestions, setCustomQuestions] = useState<
        Record<string, Question[]>
    >({});

    useEffect(() => {
        const loadTemplateOrSurvey = async () => {
            // 기존 설문 수정인 경우
            if (step1.surveyId) {
                try {
                    const rawQuestions = JSON.parse(
                        step1.surveyQuestionsRaw || '[]',
                    );

                    const templateQs: Question[] = [];
                    const customQs: Question[] = [];

                    let idCounter = 0;
                    const categorizedTemplate: Record<string, Question[]> = {};
                    const categorizedCustom: Record<string, Question[]> = {};

                    for (const q of rawQuestions) {
                        const base: Question = {
                            id: idCounter++,
                            question_text: q.question_text,
                            question_type:
                                q.question_type === 'custom'
                                    ? Question_type.custom
                                    : Question_type.fixed,
                            type: q.type,
                            options: q.options || [],
                            category: q.category || 'step2',
                            ...(q.max_num ? { max_num: q.max_num } : {}),
                        };

                        const target =
                            q.question_type === 'custom'
                                ? customQs
                                : templateQs;

                        target.push(base);

                        if (q.question_type === 'custom') {
                            if (!categorizedCustom[base.category!]) {
                                categorizedCustom[base.category!] = [];
                            }
                            categorizedCustom[base.category!].push(base);
                        } else {
                            if (!categorizedTemplate[base.category!]) {
                                categorizedTemplate[base.category!] = [];
                            }
                            categorizedTemplate[base.category!].push(base);
                        }
                    }

                    setCategoryQuestions(categorizedTemplate);
                    setCustomQuestions(categorizedCustom);
                    setTemplateSetKey(JSON.stringify(categorizedTemplate));
                    setStep2({
                        customQuestions: customQs,
                        survey_question: step1.surveyQuestionsRaw,
                        template_id: step2.template_id ?? 1,
                    });

                    console.log('✅ 설문 수정 로드 완료');
                } catch (err) {
                    console.error('❌ 수정 설문 불러오기 실패:', err);
                }
            } else {
                // 새 설문인 경우 템플릿 불러오기
                try {
                    const templateId = 1;
                    const { data } = await fetchTemplates(templateId);
                    console.log('템플릿', data);

                    const template = data[0]?.question;
                    const parsed: Record<string, Question[]> = {};

                    let i = 0;
                    for (const step of ['step1', 'step2', 'step3']) {
                        parsed[step] = (template[step] || []).map(
                            (q: RawTemplateQuestion) => ({
                                id: i++,
                                category: step,
                                question_text: q.question_text,
                                question_type: 'fixed',
                                type: q.type || 'multiple',
                                options: Array.isArray(q.options)
                                    ? q.options
                                    : [],
                                ...(q.type === 'checkbox'
                                    ? { max_num: q.max_num ?? 1 }
                                    : {}),
                            }),
                        );
                    }

                    setCategoryQuestions(parsed);
                    setTemplateSetKey(JSON.stringify(parsed));
                    setStep2({ template_id: data[0].id });
                } catch (error) {
                    console.error('템플릿 불러오기 실패:', error);
                }
            }
        };

        loadTemplateOrSurvey();
    }, [
        step1.surveyId,
        step1.surveyQuestionsRaw, // ✅ 의존성 변경
        setStep2,
        setTemplateSetKey,
        step2.template_id,
    ]);

    const addCustomQuestion = (stepKey: string) => {
        const defaultType = QuestionTypeEnum.MULTIPLE;

        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: [
                ...(prev[stepKey] || []),
                {
                    id: Date.now(),
                    question_text: '',
                    question_type: Question_type.custom,
                    type: defaultType,
                    options: ['', '', '', ''],
                },
            ] as Question[],
        }));
    };

    const handleChangeMaxNum = (
        stepKey: string,
        index: number,
        value: number,
    ) => {
        const safeValue = Math.max(1, value);
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: prev[stepKey].map((q, i) =>
                i === index ? { ...q, max_num: safeValue } : q,
            ),
        }));
    };

    const removeCustomQuestion = (stepKey: string, id: number) => {
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: prev[stepKey].filter((q) => q.id !== id),
        }));
    };
    // 옵션 갯수에 따라 설문 문항 선택수 조절
    const handleRemoveOption = (
        categoryKey: string,
        qIndex: number,
        optIndex: number,
    ) => {
        setCustomQuestions((prev) => {
            const updated = [...(prev[categoryKey] || [])];
            const targetQuestion = updated[qIndex];
            if (!targetQuestion) return prev;

            const newOptions = targetQuestion.options.filter(
                (_, i) => i !== optIndex,
            );
            const newMaxNum = Math.min(
                targetQuestion.max_num ?? 1,
                newOptions.length,
            );

            updated[qIndex] = {
                ...targetQuestion,
                options: newOptions,
                max_num: newMaxNum,
            };

            return {
                ...prev,
                [categoryKey]: updated,
            };
        });
    };

    const handleChangeCustomText = (
        stepKey: string,
        index: number,
        text: string,
    ) => {
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: prev[stepKey].map((q, i) =>
                i === index ? { ...q, question_text: text } : q,
            ),
        }));
    };

    const handleChangeType = (
        stepKey: string,
        index: number,
        type: QuestionTypeEnum,
    ) => {
        setCustomQuestions((prev) => {
            const updatedQuestions = prev[stepKey].map((q, i) => {
                if (i !== index) return q;

                const updatedQuestion: Question = {
                    ...q,
                    question_type: Question_type.custom,
                    type,
                    options:
                        type === QuestionTypeEnum.SUBJECTIVE
                            ? []
                            : q.options.length
                            ? q.options
                            : ['', '', '', ''],
                };

                // 체크박스형이면 max_num 기본 1 설정
                if (type === QuestionTypeEnum.CHECKBOX) {
                    updatedQuestion.max_num = q.max_num ?? 1;
                } else {
                    delete updatedQuestion.max_num;
                }

                return updatedQuestion;
            });

            return {
                ...prev,
                [stepKey]: updatedQuestions,
            };
        });
    };

    const handleChangeOption = (
        stepKey: string,
        qIndex: number,
        optIndex: number,
        value: string,
    ) => {
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: prev[stepKey].map((q, i) =>
                i === qIndex
                    ? {
                          ...q,
                          options: q.options.map((opt, j) =>
                              j === optIndex ? value : opt,
                          ),
                      }
                    : q,
            ),
        }));
    };

    const handleAddOption = (stepKey: string, qIndex: number) => {
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: prev[stepKey].map((q, i) => {
                if (i === qIndex) {
                    if (q.options.length >= 8) return q;
                    return { ...q, options: [...q.options, ''] };
                }
                return q;
            }),
        }));
    };

    const handleTempSave = async () => {
        const validCustom = Object.entries(customQuestions).flatMap(
            ([stepKey, questions]) =>
                questions
                    .filter(
                        (q) =>
                            q.question_text.trim() !== '' &&
                            (q.type === QuestionTypeEnum.SUBJECTIVE ||
                                q.options.every((opt) => opt.trim() !== '')),
                    )
                    .map((q) => {
                        const base = {
                            id: q.id,
                            question_text: q.question_text,
                            question_type: Question_type.custom,
                            type: q.type,
                            category: stepKey,
                            options: q.options,
                        };

                        if (
                            q.type === QuestionTypeEnum.CHECKBOX &&
                            q.max_num !== undefined
                        ) {
                            return { ...base, max_num: q.max_num };
                        }

                        return base;
                    }),
        );

        // 2. 템플릿 문항 정제
        const templateQs = Object.entries(categoryQuestions).flatMap(
            ([stepKey, questions]) =>
                questions.map((q) => ({
                    ...q,
                    category: stepKey,
                })),
        );

        // 3. 최종 allQuestions 배열
        const allQuestions = [...templateQs, ...validCustom];

        // 4. payload 작성
        const draftPayload = {
            survey_title: step1.survey_title,
            title: step1.title,
            music_uri: step1.url,
            thumbnail_uri: step1.youtubeThumbnail,
            artist: step1.artist,
            release_date: step1.releaseDate,
            music_title: step1.title,
            genre: step1.genre,
            start_at: step1.start_at,
            end_at: step1.end_at,
            type: step1.surveyType,
            reward_amount: step1.reward_amount ?? 0,
            reward: step1.reward ?? 0,
            expert_reward: step1.expertReward ?? 0,
            questions: step2.template_id!,
            question_type: 'fixed' as Question_type,
            is_released: step1.isReleased,
            status: SurveyStatus.draft,
            survey_question: JSON.stringify(
                allQuestions.map((q) => {
                    const question = q as Question & { max_num?: number };

                    return {
                        question_text: question.question_text,
                        type: question.type,
                        question_type: String(question.question_type),
                        options: question.options,
                        category: question.category,
                        ...(question.type === QuestionTypeEnum.CHECKBOX &&
                        question.max_num
                            ? { max_num: question.max_num }
                            : {}),
                    };
                }),
            ),
        };

        try {
            const res = await surveyCreate(draftPayload);
            console.log(res);

            alert('임시 저장 완료!');
            router.push('/survey');
        } catch (error) {
            console.error('임시 저장 오류:', error);
            alert('임시 저장 실패');
        }
    };

    const handleComplete = () => {
        const invalid = Object.entries(customQuestions).some(([, questions]) =>
            questions.some((q) => {
                if (q.question_text.trim() === '') return true;
                if (
                    q.type !== QuestionTypeEnum.SUBJECTIVE &&
                    q.options.some((opt) => opt.trim() === '')
                )
                    return true;
                return false;
            }),
        );

        if (invalid) {
            alert('빈 질문 또는 빈 선택지가 있는 문항이 있습니다.');
            return;
        }

        const validCustom = Object.entries(customQuestions).flatMap(
            ([stepKey, questions]) =>
                questions.map((q) => {
                    const base = {
                        id: q.id,
                        question_text: q.question_text,
                        question_type: Question_type.custom,
                        type: q.type,
                        category: stepKey,
                        options: q.options,
                    };

                    if (
                        q.type === QuestionTypeEnum.CHECKBOX &&
                        q.max_num !== undefined
                    ) {
                        return { ...base, max_num: q.max_num };
                    }

                    return base;
                }),
        );

        const templateQs = Object.entries(categoryQuestions).flatMap(
            ([stepKey, questions]) =>
                questions.map((q) => ({
                    ...q,
                    category: stepKey,
                })),
        );

        const allQuestions = [...templateQs, ...validCustom];

        setStep2({
            customQuestions: validCustom,
            survey_question: JSON.stringify(allQuestions),
        });

        router.push('/survey/create/complete');
    };

    return (
        <div>
            <div className="w-full text-black font-bold text-2xl py-3">
                Survey create Step2
            </div>
            <div className="p-6">
                <div className="w-[50%] min-h-[800px] pb-[20px] rounded-xl max-w-[485px] md:max-w-3xl bg-white px-4 sm:px-6 md:px-8">
                    <SurveyTabs
                        tabs={allTabs}
                        current={tabIndex}
                        setTab={setTabIndex}
                    />
                    <h1 className="text-lg md:text-2xl font-bold mb-4 pt-[30px]">
                        🎵 {step1.survey_title}
                    </h1>

                    {(categoryQuestions[currentTab.key] || []).map((q) => (
                        <div key={q.id} className="mb-6 border p-4 rounded">
                            <p className="font-medium mb-1">
                                {q.question_text}
                            </p>
                            {q.options.map((opt, i) => (
                                <div key={i} className="text-sm text-gray-600">
                                    ⦿ {opt}
                                </div>
                            ))}
                        </div>
                    ))}

                    <SurveyCustomForm
                        typeOptions={typeOptions}
                        questions={customQuestions[currentTab.key] || []}
                        onAdd={() => addCustomQuestion(currentTab.key)}
                        onChangeText={(i, text) =>
                            handleChangeCustomText(currentTab.key, i, text)
                        }
                        onChangeType={(i, type) =>
                            handleChangeType(currentTab.key, i, type)
                        }
                        onChangeOption={(qi, oi, val) =>
                            handleChangeOption(currentTab.key, qi, oi, val)
                        }
                        onAddOption={(qi) =>
                            handleAddOption(currentTab.key, qi)
                        }
                        onRemove={(id) =>
                            removeCustomQuestion(currentTab.key, id)
                        }
                        onChangeMaxNum={(index, value) =>
                            handleChangeMaxNum(currentTab.key, index, value)
                        }
                        onRemoveOption={(qi, oi) =>
                            handleRemoveOption(currentTab.key, qi, oi)
                        }
                    />

                    <SurveyNavigation
                        tabIndex={tabIndex}
                        totalTabs={allTabs.length}
                        onPrev={() =>
                            setTabIndex((prev) => Math.max(0, prev - 1))
                        }
                        onNext={() =>
                            setTabIndex((prev) =>
                                Math.min(allTabs.length - 1, prev + 1),
                            )
                        }
                    />

                    <SurveyActions
                        onTempSave={handleTempSave}
                        onComplete={handleComplete}
                    />
                </div>
            </div>
        </div>
    );
}
