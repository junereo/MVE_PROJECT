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
    type?: string;
}

interface Question {
    id: number;
    question_text: string;
    question_type: QuestionTypeEnum;
    options: string[];
    category?: string;
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

    const mapToQuestionTypeEnum = (
        question_type?: string,
    ): QuestionTypeEnum => {
        switch (question_type?.toLowerCase()) {
            case 'multiple':
                return QuestionTypeEnum.MULTIPLE;
            case 'checkbox':
                return QuestionTypeEnum.CHECKBOX;
            case 'subjective':
                return QuestionTypeEnum.SUBJECTIVE;
            default:
                return QuestionTypeEnum.MULTIPLE;
        }
    };

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
        const loadTemplate = async () => {
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
                            question_type: mapToQuestionTypeEnum(
                                q.question_type || q.type,
                            ),
                            options: Array.isArray(q.options) ? q.options : [],
                        }),
                    );
                }

                setCategoryQuestions(parsed);
                setTemplateSetKey(JSON.stringify(parsed));
                setStep2({ template_id: data[0].id });
            } catch (error) {
                console.error('템플릿 불러오기 실패:', error);
            }
        };
        loadTemplate();
    }, [setStep2, setTemplateSetKey]);

    const addCustomQuestion = (stepKey: string) => {
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: [
                ...(prev[stepKey] || []),
                {
                    id: Date.now(),
                    question_text: '',
                    question_type: QuestionTypeEnum.MULTIPLE,
                    options: ['', '', '', ''],
                },
            ],
        }));
    };

    const removeCustomQuestion = (stepKey: string, id: number) => {
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: prev[stepKey].filter((q) => q.id !== id),
        }));
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
        setCustomQuestions((prev) => ({
            ...prev,
            [stepKey]: prev[stepKey].map((q, i) =>
                i === index
                    ? {
                          ...q,
                          question_type: type,
                          options:
                              type === QuestionTypeEnum.SUBJECTIVE
                                  ? []
                                  : q.options.length
                                  ? q.options
                                  : ['', '', '', ''],
                      }
                    : q,
            ),
        }));
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
        const draftPayload = {
            survey_title: step1.survey_title,
            title: step1.title,
            music_uri: step1.url,
            thumbnail_uri: step1.youtubeThumbnail,
            artist: step1.artist,
            release_date: step1.releaseDate,
            thumbnail_url: step1.youtubeThumbnail,
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
        };

        try {
            const res = await surveyCreate(draftPayload);
            console.log(res);

            alert('임시 저장 완료!');
        } catch (error) {
            console.error('임시 저장 오류:', error);
            alert('임시 저장 실패');
        }
    };

    const handleComplete = () => {
        const validCustom = Object.entries(customQuestions).flatMap(
            ([stepKey, questions]) =>
                questions
                    .filter(
                        (q) =>
                            q.question_text.trim() !== '' &&
                            (q.question_type === QuestionTypeEnum.SUBJECTIVE ||
                                q.options.every((opt) => opt.trim() !== '')),
                    )
                    .map((q) => ({
                        ...q,
                        category: stepKey,
                        type: q.question_type.toLowerCase(), // "multiple", etc.
                        question_type: Question_type.custom, // "custom"
                    })),
        );

        const templateQs = Object.entries(categoryQuestions).flatMap(
            ([stepKey, questions]) =>
                questions.map((q) => ({
                    ...q,
                    category: stepKey,
                    // type은 명시 안 함 (혹은 "fixed"를 넣고 싶으면 추가 가능)
                })),
        );

        const allQuestions = [...templateQs, ...validCustom];

        setStep2({
            customQuestions: validCustom,
            allQuestions: JSON.stringify(allQuestions),
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
