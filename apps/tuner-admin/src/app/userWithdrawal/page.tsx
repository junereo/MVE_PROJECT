'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/lib/network/axios';
import Dropdown from '@/app/components/ui/DropDown';
import RewardModal from '../userService/components/RewardModal';
import { useSessionStore } from '@/store/useAuthmeStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { settings, userList, userReward } from '@/lib/network/api';
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
    const [sbtThreshold, setSbtThreshold] = useState(100);
    const usersPerPage = 15;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // 1. 유저 리스트 조회
                const userRes = await userList();
                const userMap = new Map<number, ServerUser>(
                    userRes.data.map((u: ServerUser) => [u.id, u]),
                );

                // 2. 컨트랙트 오너 주소 가져오기
                const contractRes = await axiosClient.get('/contract/ca');

                const spender = contractRes.data.ca_transac;
                const tokenAddress = contractRes.data.ca_token;
                console.log(spender, tokenAddress);

                // 3. 오너 기준 출금 가능 리워드 조회
                let rewardLeft = 0;
                try {
                    const rewardRes = await axiosClient.post(
                        `/contract/wallet/allowance`,
                        {
                            owner: 'owner',
                            spender: spender,
                            tokenAddress: tokenAddress,
                        },
                    );
                    console.log(rewardRes);
                    rewardLeft = rewardRes.data.token ?? 0;
                    console.log('🧪 owner rewardLeft:', rewardLeft);
                } catch (e) {
                    console.error('❌ 오너 리워드 조회 실패:', e);
                }

                // 4. 출금 요청 리스트
                const poolRes = await axiosClient.get(
                    '/contract/tx/pool?status=all',
                );

                // 5. 유저와 머지
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
                            rewardLeft,
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
    const handleUpdateSbtThreshold = async () => {
        try {
            const formData = {
                key: 'sbt_issuance_standard',
                value: String(sbtThreshold),
            };
            const res = await settings(formData);
            console.log('SBT 기준 저장 성공:', res.data);
            alert('Expert 기준이 저장되었습니다.');
        } catch (error) {
            console.error('SBT 기준 저장 실패:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
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
                        {(
                            users.find((u) => u.user_id === 1)?.rewardLeft ?? 0
                        ).toLocaleString()}{' '}
                        MVE
                    </span>
                </div>

                <div>
                    요청 리워드 총합:{' '}
                    <span className="font-semibold">
                        {users
                            .filter((u) => u.status === 'pending')
                            .reduce((acc, u) => acc + (u.amount ?? 0), 0)
                            .toLocaleString()}{' '}
                        MVE
                    </span>
                </div>
                <div>
                    출금 요청 유저 수:{' '}
                    <span className="font-semibold">
                        {
                            Array.from(
                                new Set(
                                    users
                                        .filter((u) => u.status === 'pending')
                                        .map((u) => u.user_id),
                                ),
                            ).length
                        }
                        명
                    </span>
                </div>
                <div>
                    출금 요청 수:{' '}
                    <span className="font-semibold">
                        {users.filter((u) => u.status === 'pending').length}건
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center mb-4 w-full gap-4">
                {/* 왼쪽 영역 */}
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="text"
                        placeholder="User ID (숫자) 또는 이메일 검색"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border min-w-[300px] rounded px-3 py-2 text-sm"
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
                </div>

                {/* 오른쪽 영역 */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded shadow">
                        <span className="text-sm text-gray-600">
                            SBT 발급 기준
                        </span>
                        <button
                            className="bg-gray-300 px-2 rounded text-lg"
                            onClick={() =>
                                setSbtThreshold((prev) =>
                                    Math.max(10, prev - 10),
                                )
                            }
                        >
                            -
                        </button>
                        <span className="font-bold text-sm">
                            {sbtThreshold}
                        </span>
                        <button
                            className="bg-gray-300 px-2 rounded text-lg"
                            onClick={() => setSbtThreshold((prev) => prev + 10)}
                        >
                            +
                        </button>
                        <button
                            onClick={handleUpdateSbtThreshold}
                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded"
                        >
                            저장
                        </button>
                    </div>

                    <Button
                        className="bg-green-500 text-white hover:bg-green-600"
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
            </div>

            <div className="bg-white rounded-xl shadow p-4 w-full overflow-auto max-h-[600px]">
                <table className="w-full table-fixed border text-sm text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 w-[40px]">ID</th>
                            <th className="border px-2 py-1 w-[40px]">
                                User ID
                            </th>
                            <th className="border px-2 py-1 w-[220px]">
                                이메일
                            </th>
                            <th className="border px-2 py-1 w-[100px]">
                                요청한 MVE
                            </th>
                            <th className="border px-2 py-1 w-[100px]">상태</th>
                            <th className="border px-2 py-1 w-[320px]">
                                TxHash(사용자 지갑주소)
                            </th>
                            <th className="border px-2 py-1 w-[160px]">
                                Requested At
                            </th>
                            {/* <th className="border px-2 py-1 w-[80px]">관리</th> */}
                        </tr>
                    </thead>
                    <tbody className="min-h-[720px]">
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
                                    {user.amount} MVE
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
                                {/* <td className="border px-2 py-1">
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
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="min-h-[60px] flex items-center justify-center">
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
            </div>
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
