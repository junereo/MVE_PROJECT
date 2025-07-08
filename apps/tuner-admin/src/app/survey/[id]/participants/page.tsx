// /app/survey/[id]/participants/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { surveyView } from '@/lib/network/api';

interface Participant {
    id: number;
    user: {
        id: number;
        nickname: string;
        role: 'ordinary' | 'Expert' | 'admin' | 'superadmin';
        badge_issued_at: string | null;
    };
    reward: number;
}

export default function SurveyParticipantsPage() {
    const { id } = useParams();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [, setSurveyTitle] = useState('');
    const [filter, setFilter] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);

    const perPage = 20;

    useEffect(() => {
        if (!id) return;

        const fetchSurvey = async () => {
            try {
                const result = await surveyView(Array.isArray(id) ? id[0] : id);
                const rawParticipants = result.data
                    .participants as Participant[];

                const enriched = rawParticipants.map((p) => ({
                    ...p,
                    reward:
                        p.user.badge_issued_at !== null
                            ? result.data.expert_reward
                            : result.data.reward,
                }));

                setParticipants(enriched);
                setSurveyTitle(result.data.survey_title);
            } catch (error) {
                console.error('참여자 데이터 불러오기 실패:', error);
            }
        };

        fetchSurvey();
    }, [id]);

    const filtered =
        filter === '전체'
            ? participants
            : participants.filter((p) => p.user.role === filter);

    const totalPages = Math.ceil(filtered.length / perPage);
    const pageData = filtered.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage,
    );

    return (
        <div>
            <div className="w-full  text-black text-2xl py-3  font-bold">
                Survey User List
            </div>

            <div className="flex justify-between items-center mb-4">
                <select
                    value={filter}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setFilter(e.target.value);
                    }}
                    className="border px-2 py-1 text-sm"
                >
                    <option value="전체">전체</option>
                    <option value="ordinary">일반</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>

            <table className="w-full border text-sm text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">닉네임</th>
                        <th className="border px-2 py-1">등급</th>
                        <th className="border px-2 py-1">리워드</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map((p) => (
                        <tr key={p.user.id} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{p.user.id}</td>
                            <td className="border px-2 py-1">
                                {p.user.nickname}
                            </td>
                            <td className="border px-2 py-1">{p.user.role}</td>
                            <td className="border px-2 py-1">{p.reward} STK</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 text-sm rounded ${
                                currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
