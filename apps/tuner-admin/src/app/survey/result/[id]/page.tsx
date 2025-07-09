'use client';
// 설문 아이디를 받아서 결과를 보여주는 페이지
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface CustomQuestionOption {
    option: string;
    count: number;
}

interface CustomQuestion {
    id: string | number;
    text: string;
    options: CustomQuestionOption[];
}

interface SurveyResult {
    youtubeTitle: string;
    thumbnail: string;
    averageScores: Record<string, number>;
    customQuestions: CustomQuestion[];
    totalParticipants: number;
}

export default function SurveyResultPage() {
    const { id } = useParams();
    const [result, setResult] = useState<SurveyResult | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            const { data } = await axios.get(`/api/survey/${id}/result`);
            setResult(data);
        };
        fetchResult();
    }, [id]);

    if (!result) return <div className="p-6">결과 로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">
                🎵 {result.youtubeTitle} 설문 결과
            </h1>

            {/* 유튜브 썸네일 */}
            <img
                src={result.thumbnail}
                alt="썸네일"
                className="w-60 rounded mb-4"
            />

            {/* 기본 평가 점수 */}
            <h2 className="text-lg font-semibold mb-2">📊 기본 평가 점수</h2>
            <ul className="list-disc pl-5 mb-6">
                {Object.entries(result.averageScores).map(([category, avg]) => (
                    <li key={category}>
                        {category} 평균 점수: {avg.toFixed(1)}점
                    </li>
                ))}
            </ul>

            {/* 커스텀 설문 결과 */}
            <h2 className="text-lg font-semibold mb-2">📋 커스텀 설문 결과</h2>
            {result.customQuestions.map((q: CustomQuestion) => (
                <div key={q.id} className="border p-4 rounded mb-4">
                    <p className="mb-2 font-medium">{q.text}</p>
                    <ul className="pl-4">
                        {q.options.map((opt: CustomQuestionOption) => (
                            <li key={opt.option}>
                                {opt.option}: {opt.count}명 선택
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* 통계 요약 */}
            <div className="mt-6 text-sm text-gray-600">
                총 참여 인원: {result.totalParticipants}명
            </div>
        </div>
    );
}
