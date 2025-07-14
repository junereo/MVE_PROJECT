'use client';

import { surveyView } from '@/lib/network/api';
import { Question_type } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AnswerItem {
    id: number;
    type: 'multiple' | 'checkbox' | 'subjective';
    answer: string | string[];
    question_text: string;
    question_type: Question_type;
}

interface SurveyQuestion {
    question_text: string;
    question_type: 'fixed' | 'custom';
}

interface Participant {
    user: {
        id: number;
        nickname: string;
        role: string;
    };
    reward: number;
    answers: {
        answers: AnswerItem[];
    };
}

export default function ParticipantDetailPage() {
    const { id, userId } = useParams();
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !userId) return;
            const result = await surveyView(Array.isArray(id) ? id[0] : id);

            const surveyQs: SurveyQuestion[] = result.data.survey_question;
            setSurveyQuestions(surveyQs);

            const p = result.data.participants.find(
                (item: {
                    user_id: number;
                    user: Participant['user'];
                    badge_issued_at?: string | null;
                    answers: { answers: Omit<AnswerItem, 'question_type'>[] };
                }) => String(item.user_id) === String(userId),
            );
            if (!p) return;

            const reward =
                p.user.badge_issued_at !== null
                    ? result.data.expert_reward
                    : result.data.reward;

            const enrichedAnswers: AnswerItem[] = (
                p.answers.answers as Omit<AnswerItem, 'question_type'>[]
            ).map((a) => {
                const match = surveyQs.find(
                    (q) => q.question_text === a.question_text,
                );
                const qt = match?.question_type;
                return {
                    ...a,
                    question_type:
                        qt === 'fixed'
                            ? Question_type.fixed
                            : qt === 'custom'
                            ? Question_type.custom
                            : Question_type.fixed, // fallback
                };
            });
            setParticipant({
                user: p.user,
                reward,
                answers: { answers: enrichedAnswers },
            });
        };

        fetchData();
    }, [id, userId]);

    if (!participant) return <div className="p-6">로딩 중...</div>;

    const fixedAnswers = participant.answers.answers.filter(
        (q) => q.question_type === Question_type.fixed,
    );

    const customAnswers = participant.answers.answers.filter(
        (q) => q.question_type === Question_type.custom,
    );

    const renderAnswers = (answers: AnswerItem[], label: string) => (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">{label}</h3>
            {answers.map((q, i) => (
                <details key={i} className="border rounded px-4 py-2 mb-3">
                    <summary className="cursor-pointer font-medium">
                        Q{i + 1}. {q.question_text}
                    </summary>
                    <div className="text-sm text-gray-600 mt-2">
                        유형:{' '}
                        {q.type === 'multiple'
                            ? '객관식'
                            : q.type === 'checkbox'
                            ? '체크박스'
                            : '주관식'}
                    </div>
                    <div className="mt-2 text-sm text-gray-800">
                        <span className="font-medium">응답: </span>
                        {Array.isArray(q.answer)
                            ? q.answer.join(', ')
                            : q.answer}
                    </div>
                </details>
            ))}
        </div>
    );

    return (
        <>
            <div className="text-2xl font-bold py-3">User Survey View</div>
            <div className="p-6 space-y-6">
                <div className="mb-6 border p-4 rounded bg-gray-50">
                    <p>
                        닉네임: <strong>{participant.user.nickname}</strong>
                    </p>
                    <p>
                        등급: <strong>{participant.user.role}</strong>
                    </p>
                    <p>
                        지급 리워드: <strong>{participant.reward} STK</strong>
                    </p>
                </div>

                {renderAnswers(fixedAnswers, '고정 질문')}
                {renderAnswers(customAnswers, '커스텀 질문')}
            </div>
        </>
    );
}
