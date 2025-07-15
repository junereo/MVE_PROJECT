'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/lib/network/axios';
import Dropdown from '@/app/components/ui/DropDown';
import RewardModal from '../userService/components/RewardModal';
import { useSessionStore } from '@/store/useAuthmeStore';

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

export default function UserWithdrawal() {
    const { user } = useSessionStore();
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortNewestFirst, setSortNewestFirst] = useState(true);
    const [selectedUser, setSelectedUser] = useState<{
        id: number;
        nickname: string;
    } | null>(null);
    const [rewardModalOpen, setRewardModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('전체');
    const [roleFilter, setRoleFilter] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 15;
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // 1. 유저 목록 가져오기
                const userRes = await axiosClient.get('/user');
                const userMap = new Map<number, ServerUser>(
                    userRes.data.map((u: ServerUser) => [u.id, u]),
                );

                // 2. 출금 요청 목록 가져오기
                const poolRes = await axiosClient.get(
                    '/contract/tx/pool?status=all',
                );

                // 3. 출금 정보 + 유저 정보 병합
                const mergedData: User[] = poolRes.data.map((item: any) => {
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
                });

                setUsers(mergedData);
            } catch (err) {
                console.error('유저 or 출금 요청 데이터 불러오기 실패:', err);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users
        .filter((user) => {
            const queryMatch =
                (user.email?.includes(searchQuery) ?? false) ||
                (user.txhash?.includes(searchQuery) ?? false);
            const roleMatch = roleFilter === '전체' || user.role === roleFilter;
            const statusMatch =
                statusFilter === '전체' || user.status === statusFilter;
            return queryMatch && roleMatch && statusMatch;
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

    const handleRewardClick = (id: number, nickname: string) => {
        setSelectedUser({ id, nickname });
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

    return (
        <div className="p-6">
            <div className="text-2xl font-bold mb-4">User Withdrawal</div>

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
                    placeholder="이메일 또는 TxHash 검색"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border min-w-[500px] rounded px-3 py-2 text-sm"
                />

                <button
                    onClick={() => {
                        setSortNewestFirst((prev) => !prev);
                        setCurrentPage(1);
                    }}
                    className="text-blue-600 border border-gray-300 px-3 py-2 rounded text-sm"
                >
                    {sortNewestFirst ? '▼ 최신순' : '▲ 오래된순'}
                </button>

                <Dropdown
                    options={[
                        '전체',
                        'superadmin',
                        'admin',
                        'ordinary',
                        'expert',
                    ]}
                    selected={roleFilter}
                    onSelect={(val) => setRoleFilter(val)}
                />

                <Dropdown
                    options={['전체', 'pending', 'completed', 'failed']}
                    selected={statusFilter}
                    onSelect={(val) => setStatusFilter(val)}
                />
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
                                    {user.requested_at}
                                </td>
                                <td className="border px-2 py-1">
                                    <button
                                        className="bg-blue-500 px-2 py-1 rounded text-white text-xs"
                                        onClick={() =>
                                            handleRewardClick(
                                                user.id,
                                                user.nickname,
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
                    isOpen={rewardModalOpen}
                    userNickname={selectedUser.nickname}
                    onClose={() => setRewardModalOpen(false)}
                    onConfirm={handleConfirmReward}
                />
            )}
        </div>
    );
}
