// 설문 상세 페이지 - 리팩토링 최종본 (UI 원형 유지, 컴포넌트 분리 없음)
'use client';

import { fetchTemplates, surveyView } from '@/lib/network/api';
import { SurveyData } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    // RadarChart,
    // Radar,
    // PolarGrid,
    // PolarAngleAxis,
    // PolarRadiusAxis,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    // Legend,
} from 'recharts';

// 사용 예정: 참여자 타입 (현재 UI에선 사용 안하지만 삭제하지 않음)
// interface SurveyParticipant {
//   id: number;
//   nickname: string;
//   role: "ordinary" | "Expert" | "admin" | "superadmin";
//   reward: number;
// }

interface FixedQuestion {
    type: 'multiple' | 'checkbox' | 'subjective';
    options: string[];
    category: string;
    question_text: string;
    question_type: 'fixed';
}

interface TemplateQuestionResponse {
    id: number;
    question: Record<string, FixedQuestion[]>;
}

interface SurveyResponse {
    user_id: number;
    gender?: string;
    age?: number;
    scores?: Record<string, number>;
    templateAnswers?: Record<string, string | string[]>;
    customAnswers?: Record<string, string | string[]>;
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
    const [templateQuestions, setTemplateQuestions] = useState<FixedQuestion[]>(
        [],
    );
    const [genderFilter, setGenderFilter] = useState('전체');
    const [ageFilter, setAgeFilter] = useState('전체');

    useEffect(() => {
        if (!id) return;

        const fetchSurvey = async () => {
            try {
                const result = await surveyView(Array.isArray(id) ? id[0] : id);
                console.log('설문 데이터', result);

                setSurveyData(result.data);
            } catch (error) {
                console.error('설문 데이터 요청 실패:', error);
            }
        };

        fetchSurvey();
    }, [id]);

    useEffect(() => {
        if (!surveyData || !surveyData.questions) return;

        const fetchQuestions = async () => {
            try {
                const { data }: { data: TemplateQuestionResponse[] } =
                    await fetchTemplates(surveyData.questions);
                if (data.length > 0) {
                    const all: FixedQuestion[] = Object.values(
                        data[0].question,
                    ).flat();
                    setTemplateQuestions(all);
                }
            } catch (err) {
                console.error('질문 템플릿 요청 실패:', err);
            }
        };

        fetchQuestions();
    }, [surveyData]);

    if (!surveyData) return <div className="p-6 text-gray-600">로딩 중...</div>;

    const youtubeId = extractYoutubeId(surveyData.music_uri || '');

    const filteredResponses: SurveyResponse[] = (
        surveyData.surveyResponses || []
    ).filter((res) => {
        const genderOk = genderFilter === '전체' || res.gender === genderFilter;
        const ageOk =
            ageFilter === '전체' ||
            (res.age !== undefined &&
                (ageFilter === '10대'
                    ? res.age < 20
                    : ageFilter === '20대'
                    ? res.age < 30 && res.age >= 20
                    : ageFilter === '30대'
                    ? res.age < 40 && res.age >= 30
                    : ageFilter === '40대'
                    ? res.age < 50 && res.age >= 40
                    : res.age >= 50));
        return genderOk && ageOk;
    });

    return (
        <div>
            {/* 상단 네비게이션 */}
            <div className="w-full  text-black text-2xl py-3  font-bold">
                Survey Detail - {surveyData.survey_title}
            </div>
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* 왼쪽 영역 */}
                    <div className="flex-1 flex flex-col space-y-4">
                        {/* 유튜브 및 작성자 정보 */}
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
                                    📘 설문 유형:{' '}
                                    {surveyData.type === 'official' ? (
                                        <span className="text-green-600 font-bold">
                                            리워드 설문
                                        </span>
                                    ) : (
                                        '일반 설문'
                                    )}
                                </p>
                                <p>
                                    💰 총 리워드: {surveyData.reward_amount} STK
                                </p>
                                <p>
                                    지급 완료: 0 STK / 잔여:{' '}
                                    {surveyData.reward_amount} STK
                                    <br />
                                    일반 유저: {surveyData.reward} STK / Expert:{' '}
                                    {surveyData.expert_reward} STK
                                </p>
                                <div>{surveyData.music_title}</div>

                                {/* 상태 + 수정버튼 */}
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
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded-md font-medium"
                                        >
                                            설문 수정하러 가기
                                        </Link>
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

                        {/* 필터 드롭다운 */}
                        <div className="flex gap-4 mt-4">
                            <select
                                value={genderFilter}
                                onChange={(e) =>
                                    setGenderFilter(e.target.value)
                                }
                                className="border px-2 py-1 text-sm"
                            >
                                <option value="전체">전체 성별</option>
                                <option value="male">남성</option>
                                <option value="female">여성</option>
                            </select>
                            <select
                                value={ageFilter}
                                onChange={(e) => setAgeFilter(e.target.value)}
                                className="border px-2 py-1 text-sm"
                            >
                                <option value="전체">전체 연령</option>
                                <option value="10대">10대</option>
                                <option value="20대">20대</option>
                                <option value="30대">30대</option>
                                <option value="40대">40대</option>
                                <option value="50대+">50대+</option>
                            </select>
                        </div>
                        {/* 연령대별 BarChart 유지 */}
                        <div className="w-full">
                            <BarChart
                                width={400}
                                height={250}
                                data={[
                                    { age: '10대', count: 2 },
                                    { age: '20대', count: 5 },
                                ]}
                            >
                                {' '}
                                {/* 더미 데이터 */}
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" />
                            </BarChart>
                        </div>

                        {/* 질문 아코디언 */}
                        <div className="mt-4">
                            <h2 className="text-lg font-bold mb-2">
                                질문 리스트
                            </h2>
                            {templateQuestions.map((q, i) => {
                                const answerCount = q.options.map((opt) => {
                                    const count = filteredResponses.filter(
                                        (res) => {
                                            const ans =
                                                res.templateAnswers?.[
                                                    q.question_text
                                                ];
                                            return Array.isArray(ans)
                                                ? ans.includes(opt)
                                                : ans === opt;
                                        },
                                    ).length;
                                    return { option: opt, count };
                                });
                                const total = answerCount.reduce(
                                    (acc, cur) => acc + cur.count,
                                    0,
                                );

                                return (
                                    <details
                                        key={i}
                                        className="border rounded px-4 py-2"
                                    >
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
                                                {answerCount.map(
                                                    (
                                                        { option, count },
                                                        idx,
                                                    ) => {
                                                        const percent =
                                                            total === 0
                                                                ? 0
                                                                : Math.round(
                                                                      (count /
                                                                          total) *
                                                                          100,
                                                                  );
                                                        return (
                                                            <li
                                                                key={idx}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <span className="w-1/4">
                                                                    {option}
                                                                </span>
                                                                <div className="w-3/4 bg-gray-200 rounded h-4">
                                                                    <div
                                                                        className="h-4 bg-blue-500 rounded"
                                                                        style={{
                                                                            width: `${percent}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm w-10 text-right">
                                                                    {percent}%
                                                                </span>
                                                            </li>
                                                        );
                                                    },
                                                )}
                                            </ul>
                                        )}
                                    </details>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
