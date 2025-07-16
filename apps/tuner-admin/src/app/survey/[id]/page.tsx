'use client';

import { surveyClose, surveyView, userSurveyData } from '@/lib/network/api';
import { SurveyData } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DonutChartWithLegend from './components/DonutChartWithLegend';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// 사용 예정: 참여자 타입 (현재 UI에선 사용 안하지만 삭제하지 않음)
// interface SurveyParticipant {
//   id: number;
//   nickname: string;
//   role: "ordinary" | "Expert" | "admin" | "superadmin";
//   reward: number;
// }
interface SurveyAnswerStat {
    average: number[];
}

interface QuestionItem {
    question_text: string;
    type: 'multiple' | 'checkbox' | 'subjective';
    question_type: 'fixed' | 'custom';
    options: string[];
    category: string;
    max_num?: number;
}

const extractYoutubeId = (url: string): string => {
    const match = url.match(/(?:v=|\/(?:embed\/)?)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : '';
};

// 상태 값을 한글로 변환
const getStatusLabel = (status: 'upcoming' | 'ongoing' | 'closed') => {
    switch (status) {
        case 'upcoming':
            return '예정';
        case 'ongoing':
            return '진행 중';
        case 'closed':
            return '종료';
        default:
            return status;
    }
};
// 상태 색상 클래스 반환
const getStatusClass = (status: 'upcoming' | 'ongoing' | 'closed') => {
    switch (status) {
        case 'upcoming':
            return 'bg-yellow-100 text-yellow-800';
        case 'ongoing':
            return 'bg-green-100 text-green-800';
        case 'closed':
            return 'bg-gray-200 text-gray-700';
        default:
            return '';
    }
};

export default function SurveyDetailPage() {
    const { id } = useParams();
    const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
    const [fixedQuestions, setFixedQuestions] = useState<QuestionItem[]>([]);
    const [customQuestions, setCustomQuestions] = useState<QuestionItem[]>([]);

    const [surveyStats, setSurveyStats] = useState<Record<
        number,
        SurveyAnswerStat
    > | null>(null);

    const [genderStats, setGenderStats] = useState<{
        male: number;
        female: number;
    }>({ male: 0, female: 0 });
    const [ageStats, setAgeStats] = useState({
        teen: 0,
        twenties: 0,
        thirties: 0,
        forties: 0,
        fifties: 0,
        sixties: 0,
    });

    useEffect(() => {
        if (!id) return;

        const fetchSurvey = async () => {
            try {
                const result = await surveyView(Array.isArray(id) ? id[0] : id);
                const result2 = await userSurveyData(
                    Array.isArray(id) ? id[0] : id,
                );

                const demographics = result2?.data?.demographics;

                if (demographics?.gender) {
                    setGenderStats(demographics.gender);
                } else {
                    console.warn('demographics.gender 없음:', result2);
                }
                if (demographics?.gender) {
                    setGenderStats(demographics.gender);
                }
                if (demographics?.age) {
                    setAgeStats(demographics.age);
                }
                const rawStats = result2.data;
                if (rawStats) {
                    const filteredStats: Record<number, SurveyAnswerStat> = {};
                    Object.entries(rawStats).forEach(([key, value]) => {
                        if (!isNaN(Number(key))) {
                            filteredStats[Number(key)] =
                                value as SurveyAnswerStat;
                        }
                    });
                    setSurveyStats(filteredStats);
                }
                const survey = result.data;

                const normalizedSurvey = {
                    ...survey,
                    reward_amount: survey.reward_amount
                        ? survey.reward_amount / 1000
                        : 0,
                    reward: survey.reward ? survey.reward / 1000 : 0,
                    expert_reward: survey.expert_reward
                        ? survey.expert_reward / 1000
                        : 0,
                };

                setSurveyData(normalizedSurvey);

                if (survey?.survey_question) {
                    const parsed: QuestionItem[] = survey.survey_question;
                    setFixedQuestions(
                        parsed.filter((q) => q.question_type === 'fixed'),
                    );
                    setCustomQuestions(
                        parsed.filter((q) => q.question_type === 'custom'),
                    );
                }
            } catch (error) {
                console.error('설문 데이터 요청 실패:', error);
            }
        };

        fetchSurvey();
    }, [id]);
    const genderChartData = [
        { name: '남성', value: genderStats.male },
        { name: '여성', value: genderStats.female },
    ];
    const ageDonutData = [
        { name: '10대', value: ageStats.teen },
        { name: '20대', value: ageStats.twenties },
        { name: '30대', value: ageStats.thirties },
        { name: '40대', value: ageStats.forties },
        { name: '50대', value: ageStats.fifties },
        { name: '60대+', value: ageStats.sixties },
    ];
    if (!surveyData) return <div className="p-6 text-gray-600">로딩 중...</div>;

    const youtubeId = extractYoutubeId(surveyData.music_uri || '');

    const renderQuestionAccordion = (
        questions: QuestionItem[],
        typeLabel: string,
    ) => (
        <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">{typeLabel}</h2>
            {questions.map((q, i) => {
                const averageData = surveyStats?.[i]?.average || [];
                const answerCount = q.options.map((opt, idx) => {
                    const count = averageData[idx] ?? 0;
                    return { option: opt, count };
                });

                const total = answerCount.reduce(
                    (acc, cur) => acc + cur.count,
                    0,
                );

                return (
                    <details key={i} className="border rounded px-4 py-2 mb-2">
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
                        {q.options.length > 0 && (
                            <ul className="mt-1 text-sm text-gray-700 space-y-1">
                                {answerCount.map(({ option, count }, idx) => {
                                    const percent =
                                        total === 0
                                            ? 0
                                            : Math.round((count / total) * 100);
                                    return (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-2"
                                        >
                                            {/* 왼쪽 퍼센트 텍스트 */}

                                            {/* 항목명 */}
                                            <span className="w-1/4">
                                                {option}
                                            </span>
                                            <span className="text-sm w-10 text-right">
                                                {percent}%
                                            </span>
                                            {/* 막대 그래프 */}
                                            <div className="w-3/4 bg-gray-200 rounded h-4">
                                                <div
                                                    className="h-4 bg-blue-500 rounded"
                                                    style={{
                                                        width: `${percent}%`,
                                                    }}
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </details>
                );
            })}
        </div>
    );

    return (
        <div>
            <div className="w-full text-black text-2xl py-3 font-bold">
                설문 상세정보 - {surveyData.survey_title}
            </div>
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex flex-col space-y-4">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="aspect-[3/2] md:w-[480px] w-full border">
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <p>
                                    👤 작성자: {surveyData.creator.nickname}{' '}
                                    (ID: {surveyData.creator.id})
                                </p>
                                <p>
                                    📅 설문 기간:{' '}
                                    {surveyData.start_at.split('T')[0]} ~{' '}
                                    {surveyData.end_at.split('T')[0]}
                                </p>
                                <p>
                                    📘 설문 유형:{' '}
                                    {surveyData.type === 'official' ? (
                                        <span className="text-green-600 font-bold">
                                            리워드 설문
                                        </span>
                                    ) : (
                                        '일반 설문'
                                    )}
                                </p>
                                {surveyData.type === 'official' && (
                                    <>
                                        <p>
                                            💰 총 리워드:{' '}
                                            {surveyData.reward_amount.toLocaleString()}{' '}
                                            MVE
                                        </p>
                                        <p>
                                            지급 완료:{' '}
                                            {(
                                                surveyData.reward_amount -
                                                surveyData.rest_amount / 1000
                                            ).toLocaleString()}{' '}
                                            MVE / 잔여:{' '}
                                            {(
                                                surveyData.rest_amount / 1000
                                            ).toLocaleString()}{' '}
                                            MVE
                                            <br />
                                            일반 유저:{' '}
                                            {surveyData.reward.toLocaleString()}{' '}
                                            MVE / Expert:{' '}
                                            {surveyData.expert_reward.toLocaleString()}{' '}
                                            MVE
                                        </p>
                                    </>
                                )}
                                <div>{surveyData.music_title}</div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                            surveyData.is_active,
                                        )}`}
                                    >
                                        {getStatusLabel(surveyData.is_active)}
                                    </span>
                                    {surveyData.is_active === 'upcoming' && (
                                        <Link
                                            href={`/survey/create/step1?id=${surveyData.id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-[85px] py-2 text-sm rounded-md font-medium"
                                        >
                                            설문 수정하러 가기
                                        </Link>
                                    )}
                                    {surveyData.is_active === 'ongoing' && (
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-[85px] py-2 text-sm rounded-md font-medium"
                                            onClick={async () => {
                                                try {
                                                    // 조기 종료용 payload 구성

                                                    await surveyClose(
                                                        surveyData.id,
                                                    );

                                                    alert(
                                                        '설문이 조기 종료되었습니다.',
                                                    );
                                                    location.reload(); // 또는 router.refresh()
                                                } catch (error) {
                                                    console.error(
                                                        '조기 종료 실패:',
                                                        error,
                                                    );
                                                    alert(
                                                        '조기 종료에 실패했습니다.',
                                                    );
                                                }
                                            }}
                                        >
                                            설문 조기 종료
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-1 flex-col">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                        target="_blank"
                                        className="bg-red-500 text-white text-sm text-center px-3 py-2 rounded w-full max-w-xs"
                                    >
                                        유튜브에서 보기
                                    </a>
                                    <Link
                                        href={`/survey/${surveyData.id}/participants`}
                                        className="border border-gray-300 text-sm text-center px-3 py-2 rounded w-full max-w-xs"
                                    >
                                        참여자 목록 보러가기
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <DonutChartWithLegend
                                title="연령별 참여 비율"
                                data={ageDonutData}
                            />
                            <DonutChartWithLegend
                                title="성별 참여 비율"
                                data={genderChartData}
                            />
                        </div>
                        {renderQuestionAccordion(fixedQuestions, '고정 질문')}
                        {renderQuestionAccordion(
                            customQuestions,
                            '커스텀 질문',
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
