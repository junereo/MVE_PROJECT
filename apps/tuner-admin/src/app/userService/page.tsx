'use client';

import { useEffect, useState } from 'react';
import { settings, userList, userReward, userExpert } from '@/lib/network/api';
import Dropdown from '@/app/components/ui/DropDown';
import RankChangeModal from './components/RankChaingeModal';
import RewardModal from './components/RewardModal';
import { useSessionStore } from '@/store/useAuthmeStore';
import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/network/axios';

interface User {
    id: number;
    nickname: string;
    email: string;
    role: 'superadmin' | 'admin' | 'ordinary' | 'expert';
    rewardLeft: number;
}
interface ServerUser {
    id: number;
    email: string;
    nickname: string;
    role: 'superadmin' | 'admin' | 'ordinary';
    balance: number;
    badge_issued_at: string | null;
    rewardLeft?: number;
}
export default function AdminUserPage() {
    const { user } = useSessionStore();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [threshold, setThreshold] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('전체');
    const [rewardSort, setRewardSort] = useState('전체');
    const [sortNewestFirst, setSortNewestFirst] = useState(true);
    const [rewardModalOpen, setRewardModalOpen] = useState(false);
    const [rankModalOpen, setRankModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: number;
        nickname: string;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ownerRewardLeft, setOwnerRewardLeft] = useState<number>(0);
    const usersPerPage = 15;

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const { data } = await userList();
    //             console.log(data);

    //             const mappedUsers: User[] = data.map((user: ServerUser) => ({
    //                 id: user.id,
    //                 nickname: user.nickname,
    //                 email: user.email,
    //                 role: user.badge_issued_at
    //                     ? 'expert'
    //                     : user.role === 'ordinary'
    //                     ? 'ordinary'
    //                     : user.role,
    //                 rewardLeft: user.balance ?? 0,
    //             }));

    //             setUsers(mappedUsers);
    //         } catch (err) {
    //             console.error('유저 목록 불러오기 실패:', err);
    //         }
    //     };

    //     fetchUsers();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. 유저 리스트
                const { data: userListData } = await userList();

                // 2. 각 유저별 보유 리워드 조회
                const usersWithReward = await Promise.all(
                    userListData.map(async (u: ServerUser): Promise<User> => {
                        try {
                            const res = await userReward(u.id);
                            return {
                                id: u.id,
                                nickname: u.nickname,
                                email: u.email,
                                role: u.badge_issued_at ? 'expert' : u.role,
                                rewardLeft: res.data.token ?? 0,
                            };
                        } catch (e) {
                            console.error(
                                `❌ 유저 ${u.id} 보유 리워드 조회 실패`,
                                e,
                            );
                            return {
                                id: u.id,
                                nickname: u.nickname,
                                email: u.email,
                                role: u.badge_issued_at ? 'expert' : u.role,
                                rewardLeft: 0,
                            };
                        }
                    }),
                );

                setUsers(usersWithReward);

                // 3. 오너 출금 가능 리워드 (allowance)
                const caRes = await axiosClient.get('/contract/ca');
                const spender = caRes.data.ca_transac;
                const tokenAddress = caRes.data.ca_token;

                try {
                    const rewardRes = await axiosClient.post(
                        '/contract/wallet/allowance',
                        {
                            owner: 'owner',
                            spender,
                            tokenAddress,
                        },
                    );
                    setOwnerRewardLeft(rewardRes.data.allowance ?? 0);
                } catch (e) {
                    console.error('❌ 오너 allowance 조회 실패:', e);
                    setOwnerRewardLeft(0);
                }
            } catch (err) {
                console.error('❌ 전체 유저 및 오너 리워드 조회 실패:', err);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users
        .filter((user) => {
            const matchQuery =
                user.nickname.includes(searchQuery) ||
                user.email.includes(searchQuery);
            const matchRole = roleFilter === '전체' || user.role === roleFilter;
            return matchQuery && matchRole;
        })
        .sort((a, b) => {
            if (rewardSort === '리워드 많은순')
                return b.rewardLeft - a.rewardLeft;
            return sortNewestFirst ? b.id - a.id : a.id - b.id;
        });
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage,
    );
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // const handleRewardClick = (id: number, nickname: string) => {
    //     setSelectedUser({ id, nickname });
    //     setRewardModalOpen(true);
    // };
    const handleConfirmReward = (amount: number) => {
        if (selectedUser) {
            console.log(
                `${selectedUser.nickname} (ID: ${selectedUser.id})에게 ${amount} 리워드 지급`,
            );
            setRewardModalOpen(false);
            setSelectedUser(null);
        }
    };

    const handleRankClick = (id: number, nickname: string) => {
        setSelectedUser({ id, nickname });
        setRankModalOpen(true);
    };

    const handleConfirmRankChange = async () => {
        if (selectedUser) {
            try {
                const userToUpdate = users.find(
                    (u) => u.id === selectedUser.id,
                );
                console.log(userToUpdate);

                if (
                    userToUpdate?.role === 'admin' ||
                    userToUpdate?.role === 'superadmin'
                ) {
                    alert('admin 및 superadmin의 등급은 변경할 수 없습니다.');
                    return;
                }

                await userExpert(userToUpdate!.id, {
                    ...userToUpdate,
                    role: 'expert',
                });
                alert(
                    `${
                        userToUpdate!.nickname
                    }의 등급이 Expert로 변경되었습니다.`,
                );

                // 사용자 목록 갱신
                const { data } = await userList();

                const mappedUsers = data.map((user: ServerUser) => ({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    role: user.badge_issued_at
                        ? 'expert'
                        : user.role === 'ordinary'
                        ? 'ordinary'
                        : user.role,
                    rewardLeft: user.balance ?? 0,
                }));
                setUsers(mappedUsers);

                setRankModalOpen(false);
                setSelectedUser(null);
            } catch (error) {
                console.error('❌ 등급 변경 실패:', error);
                alert('등급 변경 중 오류가 발생했습니다.');
            }
        }
    };

    const handleUpdateThreshold = async () => {
        try {
            const formData = {
                key: 'Expert_thresh',
                value: String(threshold),
            };
            const res = await settings(formData);
            console.log('✅ 저장 성공:', res.data);
            alert('Expert 기준이 저장되었습니다.');
        } catch (error) {
            console.error('❌ Expert 기준 저장 실패:', error);
        }
    };

    return (
        <div>
            <div className="w-full text-black text-2xl py-3 font-bold">
                유저 관리
            </div>
            <div className="p-6">
                <div className="bg-white p-4 rounded-xl shadow mb-6 text-sm flex flex-wrap gap-4">
                    <div>
                        출금 가능 리워드:{' '}
                        <span className="font-semibold">
                            {ownerRewardLeft.toLocaleString()} MVE
                        </span>
                    </div>
                    <div>
                        배포된 전체 리워드 총합:{' '}
                        <span className="font-semibold">
                            {users.reduce((acc, user) => {
                                const reward = Number(user.rewardLeft);
                                return isNaN(reward) || reward === 0
                                    ? acc
                                    : acc + reward;
                            }, 0)}{' '}
                            MVE
                        </span>
                    </div>
                </div>
                {/* 상단 필터 줄 */}
                <div className="flex flex-wrap items-center gap-2 mb-4 w-full">
                    {/* 검색창 */}
                    <input
                        type="text"
                        placeholder="닉네임 또는 이메일 검색"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border min-w-[500px] rounded px-3 py-2 text-sm w-[200px]"
                    />

                    {/* 최신순 버튼 */}
                    <button
                        onClick={() => {
                            setSortNewestFirst((prev) => !prev);
                            setCurrentPage(1);
                        }}
                        className="text-blue-600 border border-gray-300 px-3 py-2 rounded text-sm"
                    >
                        {sortNewestFirst ? '▼ 최신순' : '▲ 오래된순'}
                    </button>

                    {/* 전체 등급 필터 */}
                    <Dropdown
                        options={[
                            '전체',
                            'superadmin',
                            'admin',
                            'ordinary',
                            'expert',
                        ]}
                        selected={roleFilter}
                        onSelect={(value) => {
                            setRoleFilter(value);
                            setCurrentPage(1);
                        }}
                    />

                    {/* 리워드 정렬 필터 */}
                    <Dropdown
                        options={['전체', '리워드 많은순']}
                        selected={rewardSort}
                        onSelect={(value) => {
                            setRewardSort(value);
                            setCurrentPage(1);
                        }}
                    />

                    {/* Expert 기준 설정 (오른쪽 정렬) */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded shadow ml-auto">
                        <span className="text-sm text-gray-600">
                            Expert 자동 기준
                        </span>
                        <button
                            className="bg-gray-300 px-2 rounded text-lg"
                            onClick={() =>
                                setThreshold((prev) => Math.max(1, prev - 1))
                            }
                        >
                            -
                        </button>
                        <span className="font-bold text-sm">{threshold}</span>
                        <button
                            className="bg-gray-300 px-2 rounded text-lg"
                            onClick={() => setThreshold((prev) => prev + 1)}
                        >
                            +
                        </button>
                        <button
                            onClick={handleUpdateThreshold}
                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded"
                        >
                            저장
                        </button>
                    </div>
                </div>

                {/* 유저 테이블 */}
                <div className="bg-white rounded-xl shadow p-4 w-full">
                    <table className="w-full table-fixed border text-sm text-center">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1 w-[25px]">
                                    ID
                                </th>
                                <th className="border px-2 py-1 w-[140px]">
                                    닉네임
                                </th>
                                <th className="border px-2 py-1 w-[200px]">
                                    이메일
                                </th>
                                <th className="border px-2 py-1 w-[100px]">
                                    등급
                                </th>
                                <th className="border px-2 py-1 w-[120px]">
                                    MVE 리워드 잔량
                                </th>
                                <th className="border px-2 py-1 w-[160px]">
                                    관리
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-blue-50 cursor-pointer"
                                    onClick={() =>
                                        router.push(`/userService/${user.id}`)
                                    }
                                >
                                    <td className="border px-2 py-1">
                                        {user.id}
                                    </td>
                                    <td
                                        className="border px-2 py-1 truncate whitespace-nowrap overflow-hidden max-w-[140px]"
                                        title={user.nickname}
                                    >
                                        {user.nickname}
                                    </td>
                                    <td
                                        className="border px-2 py-1 truncate whitespace-nowrap overflow-hidden max-w-[200px]"
                                        title={user.email}
                                    >
                                        {user.email}
                                    </td>
                                    <td className="border px-2 py-1 capitalize">
                                        {user.role}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {user.rewardLeft} MVE
                                    </td>
                                    <td
                                        className="border px-2 py-1 space-x-2"
                                        onClick={(e) => e.stopPropagation()} // ⚠️ 버튼 클릭 시 페이지 이동 막기
                                    >
                                        <button
                                            className="bg-yellow-400 px-2 py-1 rounded text-white text-xs"
                                            disabled={
                                                user.role === 'admin' ||
                                                user.role === 'superadmin'
                                            }
                                            onClick={() => {
                                                if (
                                                    user.role === 'admin' ||
                                                    user.role === 'superadmin'
                                                ) {
                                                    alert(
                                                        'admin 및 superadmin의 등급은 변경할 수 없습니다.',
                                                    );
                                                    return;
                                                }
                                                handleRankClick(
                                                    user.id,
                                                    user.nickname,
                                                );
                                            }}
                                        >
                                            등급 변경
                                        </button>
                                        {/* <button
                                            className="bg-blue-500 px-2 py-1 rounded text-white text-xs"
                                            onClick={() =>
                                                handleRewardClick(
                                                    user.id,
                                                    user.nickname,
                                                )
                                            }
                                        >
                                            포인트 지급
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center items-center gap-2 text-sm">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
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

                {selectedUser && (
                    <RankChangeModal
                        isOpen={rankModalOpen}
                        userNickname={selectedUser.nickname}
                        onClose={() => setRankModalOpen(false)}
                        onConfirm={handleConfirmRankChange}
                    />
                )}
            </div>
        </div>
    );
}
