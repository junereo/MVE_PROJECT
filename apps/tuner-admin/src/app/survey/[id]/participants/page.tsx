// /app/survey/[id]/participants/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { surveyView } from '@/lib/network/api';
interface Participant {
    id: number;
    user: {
        id: number;
        nickname: string;
        role: 'ordinary' | 'expert' | 'admin' | 'superadmin';
        badge_issued_at: string | null;
    };
    rewarded: number;
    status: string;
    created_at: string;
}

export default function SurveyParticipantsPage() {
    const { id } = useParams();
    const router = useRouter();
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
                console.log('참여자 데이터', rawParticipants);

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
                설문 참여 리스트
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
                    <option value="expert">expert</option>
                </select>

                <span className="text-sm text-gray-600">
                    ※ 설문이 완료되어야 실제 지급된 리워드가 표시됩니다.
                </span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 w-full">
                <table className="w-full border text-sm text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 w-[40px]">ID</th>
                            <th className="border px-2 py-1  w-[150px]">
                                닉네임
                            </th>
                            <th className="border px-2 py-1  w-[150px]">
                                등급
                            </th>
                            <th className="border px-2 py-1  w-[250px]">
                                참여시각
                            </th>
                            <th className="border px-2 py-1  w-[40px]">
                                지급여부
                            </th>
                            <th className="border px-2 py-1  w-[40px]">
                                리워드
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {pageData.map((p) => (
                            <tr
                                key={p.user.id}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    router.push(
                                        `/survey/${id}/participants/${p.user.id}`,
                                    )
                                }
                            >
                                <td className="border px-2 py-1">
                                    {p.user.id}
                                </td>
                                <td className="border px-2 py-1">
                                    {p.user.nickname}
                                </td>
                                <td className="border px-2 py-1">
                                    {p.user.role}
                                </td>
                                <td className="border px-2 py-1 w-[160px]">
                                    {p.created_at.split('T')[0]}{' '}
                                    {p.created_at.split('T')[1]?.slice(0, 8)}
                                </td>
                                <td className="border px-2 py-1">{p.status}</td>
                                <td className="border px-2 py-1 w-[100px]">
                                    {p.rewarded} 포인트
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
