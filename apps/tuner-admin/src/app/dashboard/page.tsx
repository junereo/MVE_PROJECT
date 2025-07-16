'use client';

import { useEffect, useState } from 'react';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import { COLORS, DonutChart } from './components/DonutChart';
import RewardLineChart from './components/Recjarts';
import SummaryCard from './components/SummaryCard';
import { surveyList, participantList } from '@/lib/network/api';
import { SurveyTypeEnum } from '../survey/create/complete/type';

import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/network/axios';
interface Survey {
    id: number;
    survey_title: string;
    music_title: string;
    is_active: 'upcoming' | 'ongoing' | 'closed';
    status: 'draft' | 'complete';
    participants: { id: number }[];
    reward_amount: number;
    type: SurveyTypeEnum;
    creator: {
        id: number;
        nickname: string;
        role: string;
    };
}

interface Participant {
    id: number;
    user_id: number;
    survey_id: number;
}

interface WithdrawalRow {
    id: number;
    user_id: number;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    txhash: string;
    requested_at: string;
}

const Dashboard = () => {
    useSessionCheck();

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const surveyRes = await surveyList();
            const participantRes = await participantList();
            const withdrawalRes = await axiosClient.get(
                '/contract/tx/pool?status=all',
            );
            console.log('출금 요청 데이터', withdrawalRes);

            setSurveys(surveyRes.data);
            setParticipants(participantRes.data);
            setWithdrawals(withdrawalRes.data);
        };
        fetchData();
    }, []);

    const totalSurveys = surveys.length;
    const totalParticipants = participants.length;
    const router = useRouter();
    const statusCount = {
        예정: 0,
        진행중: 0,
        종료: 0,
        임시저장: 0,
    };

    surveys.forEach((s) => {
        if (s.status === 'draft') statusCount['임시저장']++;
        else {
            switch (s.is_active) {
                case 'upcoming':
                    statusCount['예정']++;
                    break;
                case 'ongoing':
                    statusCount['진행중']++;
                    break;
                case 'closed':
                    statusCount['종료']++;
                    break;
            }
        }
    });

    const donutData = Object.entries(statusCount).map(([name, value]) => ({
        name,
        value,
    }));

    const recentSurveys = [...surveys].sort((a, b) => b.id - a.id).slice(0, 5);

    return (
        <>
            <div className="text-2xl font-bold py-3">대시 보드</div>
            <div className="p-6 space-y-6">
                {/* 상단 요약 카드 */}
                <div className="flex gap-5">
                    <SummaryCard
                        title="설문 갯수"
                        value={String(totalSurveys)}
                        trend="Total Surveys"
                        percentage="+12.5%"
                    />
                    <SummaryCard
                        title="참여자 수"
                        value={String(totalParticipants)}
                        trend="Total Participants"
                        percentage="+8.2%"
                    />
                    <SummaryCard
                        title="리워드 지급"
                        value="842"
                        trend="Reward Payouts"
                        percentage="+15.4%"
                    />
                    <SummaryCard
                        title="출금 요청"
                        value="321"
                        trend="Withdrawal Requests"
                        percentage="+4.1%"
                    />
                </div>

                {/* 그래프 섹션 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow p-4 flex flex-row items-center pl-20">
                        <div>
                            <DonutChart data={donutData} />
                        </div>
                        <div className="flex flex-col gap-2 ml-8">
                            {donutData.map((item, idx) => (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-2 text-sm pl-20 py-4"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS?.[idx % COLORS.length] ||
                                                '#ccc',
                                        }}
                                    />
                                    <span className="font-medium text-xl">
                                        {item.name} 설문
                                    </span>
                                    <span className="text-gray-500 text-xl">
                                        ({item.value}개)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            설문 참여율
                        </h2>
                        <RewardLineChart />
                    </div>
                </div>

                {/* 최신 설문 리스트 */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-lg font-semibold mb-2">생성된 설문</h2>
                    <table className="w-full text-sm text-center border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">설문 제목</th>
                                <th className="border px-2 py-1">음원명</th>
                                <th className="border px-2 py-1">설문 상태</th>
                                <th className="border px-2 py-1">진행 상태</th>
                                <th className="border px-2 py-1">유형</th>
                                <th className="border px-2 py-1">
                                    리워드 잔량
                                </th>
                                <th className="border px-2 py-1">참여자 수</th>
                                <th className="border px-2 py-1">등급</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentSurveys.map((survey) => (
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
                                    <td className="border px-2 py-1 h-[40px] text-left pl-3">
                                        <div
                                            className="truncate max-w-[180px]"
                                            title={survey.survey_title}
                                        >
                                            {survey.survey_title}
                                        </div>
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] text-left pl-3">
                                        <div
                                            className="truncate max-w-[180px]"
                                            title={survey.music_title}
                                        >
                                            {survey.music_title}
                                        </div>
                                    </td>
                                    <td className="border px-2 py-1 h-[40px]">
                                        {survey.status === 'draft'
                                            ? '임시저장'
                                            : '생성 완료'}
                                    </td>
                                    <td className="border px-2 py-1 h-[40px]">
                                        <span
                                            className={`px-2 py-1 h-[40px] rounded-full text-xs font-medium ${
                                                survey.is_active === 'upcoming'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : survey.is_active ===
                                                      'ongoing'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {survey.is_active === 'upcoming'
                                                ? '예정'
                                                : survey.is_active === 'ongoing'
                                                ? '진행중'
                                                : '종료'}
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1 h-[40px]">
                                        <span
                                            className={`px-2 py-1 h-[40px] rounded-full text-xs font-medium ${
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
                                    <td className="border px-2 py-1 h-[40px]">
                                        <span
                                            className={`px-2 py-1 h-[40px] rounded-full text-xs font-medium ${
                                                survey.reward_amount === 0
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {survey.reward_amount / 1000} MVE
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1">
                                        {survey.participants?.length ?? 0}명
                                    </td>
                                    <td className="border px-2 py-1">
                                        {survey.creator?.role || 'unknown'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* 출금 요청 리스트 */}
                <div className="bg-white rounded-xl shadow p-4 mt-6">
                    <h2 className="text-lg font-semibold mb-2">
                        출금 요청 리스트
                    </h2>
                    <table className="w-full text-sm text-center border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">UserId</th>
                                <th className="border px-2 py-1">Amount</th>
                                <th className="border px-2 py-1">Status</th>
                                <th className="border px-2 py-1">TxHash</th>
                                <th className="border px-2 py-1">
                                    Requested At
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map((row) => (
                                <tr key={row.id}>
                                    <td className="border px-2 py-1">
                                        {row.id}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {row.user_id}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {row.amount}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {row.status}
                                    </td>
                                    <td
                                        className="border px-2 py-1 truncate max-w-[160px]"
                                        title={row.txhash}
                                    >
                                        {row.txhash || '-'}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {new Date(
                                            row.requested_at,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
