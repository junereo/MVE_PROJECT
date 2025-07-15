// 주요 수정사항 반영 완료:
// 1. 드롭다운 순서 변경: 상태(status) 필터가 앞에, 역할(role) 필터가 뒤에 위치
// 2. 정렬 버튼 제거, 두 번째 드롭다운이 시간 정렬로 변경됨
// 3. 시간 포맷 YYYY-MM-DD HH:mm:ss 형태로 보기 좋게 변경
// 4. 검색은 email, user_id 기준으로 변경

'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/lib/network/axios';
import Dropdown from '@/app/components/ui/DropDown';
import RewardModal from '../userService/components/RewardModal';
import { useSessionStore } from '@/store/useAuthmeStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface User {
    id: number;
    user_id: number;
    email: string;
    nickname: string;
    role: 'superadmin' | 'admin' | 'ordinary' | 'expert';
    rewardLeft: number;
    txhash: string;
    amount: number;
    requested_at: string;
    status: 'pending' | 'completed' | 'failed';
}
interface ServerUser {
    id: number;
    email: string;
    nickname: string;
    role: string;
    balance: number;
    badge_issued_at: string | null;
}
interface PoolItem {
    id: number;
    user_id: number;
    txhash?: string;
    amount?: number;
    requested_at?: string;
    status?: 'pending' | 'completed' | 'failed';
}

export default function UserWithdrawal() {
    const { user } = useSessionStore();
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortNewestFirst, setSortNewestFirst] = useState(true);
    const [selectedUser, setSelectedUser] = useState<{
        id: number;
        nickname: string;
        amount: number;
    } | null>(null);
    const [rewardModalOpen, setRewardModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 15;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userRes = await axiosClient.get('/user');
                const userMap = new Map<number, ServerUser>(
                    userRes.data.map((u: ServerUser) => [u.id, u]),
                );

                const poolRes = await axiosClient.get(
                    '/contract/tx/pool?status=all',
                );

                const mergedData: User[] = poolRes.data.map(
                    (item: PoolItem) => {
                        const userInfo = userMap.get(item.user_id);
                        return {
                            id: item.id,
                            user_id: item.user_id,
                            email: userInfo?.email ?? '',
                            nickname: userInfo?.nickname ?? '-',
                            role: userInfo?.badge_issued_at
                                ? 'expert'
                                : userInfo?.role ?? '-',
                            rewardLeft: userInfo?.balance ?? 0,
                            txhash: item.txhash ?? '',
                            amount: item.amount ?? 0,
                            requested_at: item.requested_at ?? '',
                            status: item.status ?? 'pending',
                        };
                    },
                );

                setUsers(mergedData);
            } catch (err) {
                console.error('유저 or 출금 요청 데이터 불러오기 실패:', err);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users
        .filter((user) => {
            const query = searchQuery.trim();

            const isNumberQuery = /^\d+$/.test(query); // 숫자만 입력된 경우

            const queryMatch =
                query === ''
                    ? true
                    : isNumberQuery
                    ? user.user_id.toString() === query
                    : user.email.toLowerCase().includes(query.toLowerCase());

            const statusMatch =
                statusFilter === '전체' || user.status === statusFilter;

            return queryMatch && statusMatch;
        })
        .sort((a, b) =>
            sortNewestFirst
                ? new Date(b.requested_at).getTime() -
                  new Date(a.requested_at).getTime()
                : new Date(a.requested_at).getTime() -
                  new Date(b.requested_at).getTime(),
        );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage,
    );
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleRewardClick = (
        id: number,
        nickname: string,
        amount: number,
    ) => {
        console.log('선택한 유저:', { id, nickname, amount });
        setSelectedUser({ id, nickname, amount });
        setRewardModalOpen(true);
    };

    const handleConfirmReward = (amount: number) => {
        if (selectedUser) {
            console.log(
                `${selectedUser.nickname} (ID: ${selectedUser.id})에게 ${amount} 리워드 지급`,
            );
            setRewardModalOpen(false);
            setSelectedUser(null);
        }
    };

    const formatDate = (iso: string) => {
        const date = new Date(iso);
        return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date
            .getDate()
            .toString()
            .padStart(2, '0')} ${date
            .getHours()
            .toString()
            .padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${date
            .getSeconds()
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <div className="p-6">
            <div className="text-2xl font-bold mb-4">출금 관리</div>

            <div className="bg-white p-4 rounded-xl shadow mb-6 text-sm flex flex-wrap gap-4">
                <div>
                    출금 가능 리워드:{' '}
                    <span className="font-semibold">
                        {user?.balance ?? 0} STK
                    </span>
                </div>
                <div>
                    전체 리워드 총합:{' '}
                    <span className="font-semibold">
                        {users.reduce((acc, u) => acc + u.rewardLeft, 0)} STK
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4 w-full">
                <input
                    type="text"
                    placeholder="User ID (숫자) 또는 이메일 검색"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border min-w-[500px] rounded px-3 py-2 text-sm"
                />

                <Dropdown
                    options={['전체', 'pending', 'completed', 'failed']}
                    selected={statusFilter}
                    onSelect={(val) => {
                        setStatusFilter(val);
                        setCurrentPage(1);
                    }}
                />

                <Dropdown
                    options={['최신순', '오래된순']}
                    selected={sortNewestFirst ? '최신순' : '오래된순'}
                    onSelect={(val) => {
                        setSortNewestFirst(val === '최신순');
                        setCurrentPage(1);
                    }}
                />
                <Button
                    className="bg-green-500 text-white hover:bg-green-600 ml-auto"
                    onClick={async () => {
                        try {
                            await axiosClient.post('/contract/tx/submit');
                            toast.success('전체 리워드 지급 완료!');
                        } catch (error) {
                            console.error('전체 지급 실패:', error);
                            toast.error('전체 지급에 실패했습니다.');
                        }
                    }}
                >
                    리워드 전체 지급
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow p-4 w-full">
                <table className="w-full table-fixed border text-sm text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">User ID</th>
                            <th className="border px-2 py-1">이메일</th>
                            <th className="border px-2 py-1">Amount</th>
                            <th className="border px-2 py-1">Status</th>
                            <th className="border px-2 py-1">TxHash</th>
                            <th className="border px-2 py-1">Requested At</th>
                            <th className="border px-2 py-1">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="border px-2 py-1">{user.id}</td>
                                <td className="border px-2 py-1">
                                    {user.user_id}
                                </td>
                                <td className="border px-2 py-1">
                                    {user.email}
                                </td>
                                <td className="border px-2 py-1">
                                    {user.amount} STK
                                </td>
                                <td className="border px-2 py-1">
                                    {user.status}
                                </td>
                                <td className="border px-2 py-1 truncate max-w-xs">
                                    {user.txhash}
                                </td>
                                <td className="border px-2 py-1">
                                    {formatDate(user.requested_at)}
                                </td>
                                <td className="border px-2 py-1">
                                    <button
                                        className="bg-blue-500 px-2 py-1 rounded text-white text-xs"
                                        onClick={() =>
                                            handleRewardClick(
                                                user.id,
                                                user.nickname,
                                                user.amount,
                                            )
                                        }
                                    >
                                        리워드 지급
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2 text-sm">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${
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

            {selectedUser && (
                <RewardModal
                    key={selectedUser.id}
                    isOpen={rewardModalOpen}
                    userNickname={selectedUser.nickname}
                    defaultAmount={selectedUser.amount}
                    onClose={() => setRewardModalOpen(false)}
                    onConfirm={handleConfirmReward}
                />
            )}
        </div>
    );
}
