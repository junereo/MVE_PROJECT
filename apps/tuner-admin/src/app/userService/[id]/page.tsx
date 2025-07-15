// /app/userService/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/network/axios';
import { SurveyStatus, SurveyType } from '@/types';

interface Survey {
    id: number;
    survey_title: string;
    music_title: string;
    start_at: string;
    end_at: string;
    status: SurveyStatus;
    is_active: 'upcoming' | 'ongoing' | 'closed';
    type: SurveyType;
    reward_amount: number;
    participants?: { id: number }[];
}

interface UserDetail {
    id: number;
    nickname: string;
    email: string;
    role: string;
    balance: number;
    surveys: Survey[];
    surveyResponses: unknown[];
    created_at: string;
    updated_at: string;
    badge_issued_at: string | null;
    wallet_address: string | null;
    gender?: string | null;
    age?: number | null;
    job_domain?: string | null;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const getStatusLabel = (status: SurveyStatus) => {
    return status === SurveyStatus.draft ? '임시저장' : '생성 완료';
};

const convertStatus = (status: string): '예정' | '진행중' | '종료' => {
    switch (status) {
        case 'upcoming':
            return '예정';
        case 'ongoing':
            return '진행중';
        case 'closed':
            return '종료';
        default:
            return '예정';
    }
};

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<UserDetail | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            const res = await axiosInstance.get(`/user/${id}`);
            const extended = {
                ...res.data,
                gender: res.data.gender ?? '미입력 (더미)',
                age: res.data.age ?? 0,
                job_domain: res.data.job_domain ?? '미입력 (더미)',
            };
            setUser(extended);
        };

        fetchUser();
    }, [id]);

    if (!user) return <div className="p-6">로딩 중...</div>;

    return (
        <div>
            <div className="w-full text-black text-2xl py-3 font-bold">
                유저 상세
            </div>
            <div className="p-6 space-y-6">
                <div className="bg-white shadow rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <Info title="닉네임" value={user.nickname} />
                    <Info title="이메일" value={user.email} />
                    <Info title="등급" value={user.role} />
                    <Info title="잔여 리워드" value={`${user.balance} STK`} />
                    <Info
                        title="설문 생성 수"
                        value={`${user.surveys.length} 개`}
                    />
                    <Info
                        title="설문 참여 수"
                        value={`${user.surveyResponses.length} 개`}
                    />
                    <Info title="가입일" value={formatDate(user.created_at)} />
                    <Info
                        title="최근 활동"
                        value={formatDate(user.updated_at)}
                    />
                    <Info
                        title="Expert 뱃지"
                        value={user.badge_issued_at ? '발급됨' : '미발급'}
                    />
                    <Info
                        title="지갑 주소"
                        value={user.wallet_address ?? '미등록'}
                    />
                    <Info title="성별" value={user.gender ?? '미입력 (더미)'} />
                    <Info
                        title="연령"
                        value={user.age ? `${user.age}세` : '미입력 (더미)'}
                    />
                    <Info
                        title="직군"
                        value={user.job_domain ?? '미입력 (더미)'}
                    />
                </div>

                <div className="bg-white rounded-xl shadow p-4 w-full">
                    <h2 className="text-lg font-bold mb-3">작성한 설문</h2>
                    <table className="w-full border text-sm text-center">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">설문 제목</th>
                                <th className="border px-2 py-1">음원명</th>
                                <th className="border px-2 py-1">설문 기간</th>
                                <th className="border px-2 py-1">설문 상태</th>
                                <th className="border px-2 py-1">진행 상태</th>
                                <th className="border px-2 py-1">유형</th>
                                <th className="border px-2 py-1">리워드</th>
                                <th className="border px-2 py-1">참여 인원</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.surveys.map((survey) => (
                                <tr
                                    key={survey.id}
                                    className="hover:bg-blue-50 cursor-pointer"
                                    onClick={() =>
                                        router.push(`/survey/${survey.id}`)
                                    }
                                >
                                    <td className="border px-2 py-1">
                                        {survey.id}
                                    </td>
                                    <td className="border px-2 py-1 text-left pl-3">
                                        <div
                                            className="truncate max-w-[180px]"
                                            title={survey.survey_title}
                                        >
                                            {survey.survey_title}
                                        </div>
                                    </td>
                                    <td className="border px-2 py-1 text-left pl-3">
                                        <div
                                            className="truncate max-w-[180px]"
                                            title={survey.music_title}
                                        >
                                            {survey.music_title}
                                        </div>
                                    </td>
                                    <td className="border px-2 py-1">
                                        {survey.start_at.slice(0, 10)} ~{' '}
                                        {survey.end_at.slice(0, 10)}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {getStatusLabel(survey.status)}
                                    </td>
                                    <td className="border px-2 py-1">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                convertStatus(
                                                    survey.is_active,
                                                ) === '예정'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : convertStatus(
                                                          survey.is_active,
                                                      ) === '진행중'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {convertStatus(survey.is_active)}
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                survey.type === 'official'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {survey.type === 'official'
                                                ? '리워드 설문'
                                                : '일반 설문'}
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                survey.reward_amount === 0
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {survey.reward_amount} STK
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1">
                                        {survey.participants?.length ?? 0}명
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Info({ title, value }: { title: string; value: string }) {
    return (
        <div className="">
            <div className="text-xs text-gray-500 mb-1">{title}</div>
            <div className="text-base font-semibold truncate break-all">
                {value}
            </div>
        </div>
    );
}
