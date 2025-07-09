'use client';

import { useState } from 'react';

interface User {
    id: number;
    nickname: string;
    email: string;
    role: 'general' | 'expert';
    status: 'active' | 'suspended' | 'withdrawn';
}

export default function UserListPage() {
    const [threshold, setThreshold] = useState(5);

    const users: User[] = [
        {
            id: 1,
            nickname: '감자도리',
            email: 'potato@music.com',
            role: 'expert',
            status: 'active',
        },
        {
            id: 2,
            nickname: '김밥실',
            email: 'kimbap@naver.com',
            role: 'general',
            status: 'suspended',
        },
        {
            id: 3,
            nickname: '김밥실',
            email: 'kimbap@naver.com',
            role: 'general',
            status: 'suspended',
        },
        {
            id: 4,
            nickname: '김밥실',
            email: 'kimbap@naver.com',
            role: 'general',
            status: 'suspended',
        },
        {
            id: 5,
            nickname: '김밥실',
            email: 'kimbap@naver.com',
            role: 'general',
            status: 'suspended',
        },
        {
            id: 6,
            nickname: '김밥실',
            email: 'kimbap@naver.com',
            role: 'general',
            status: 'suspended',
        },
        {
            id: 7,
            nickname: '김밥실',
            email: 'kimbap@naver.com',
            role: 'general',
            status: 'suspended',
        },
    ];

    const handleStatusClick = (id: number) => {
        console.log('상태 변경:', id);
    };

    const handleRewardClick = (id: number) => {
        console.log('리워드 지급:', id);
    };

    const handleUpdateThreshold = () => {
        console.log('설정된 Expert 기준:', threshold);
        // 서버 반영 로직 (예: axios.post("/api/admin/expert-threshold", { threshold }))
    };

    return (
        <div className="p-8 bg-[#EBEBEB] min-h-screen">
            {/* 헤더 + 설정 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">👥 유저 목록</h2>

                {/* Expert 기준 설정 버튼 */}
                <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-lg">
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
                    <span className="font-bold">{threshold}</span>
                    <button
                        className="bg-gray-300 px-2 rounded text-lg"
                        onClick={() => setThreshold((prev) => prev + 1)}
                    >
                        +
                    </button>
                    <button
                        onClick={handleUpdateThreshold}
                        className="bg-blue-500 text-white text-sm px-3 py-1 rounded ml-2"
                    >
                        저장
                    </button>
                </div>
            </div>

            {/* 유저 테이블 */}
            <div className="bg-white rounded-xl shadow p-6 w-full">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border">
                        <thead className="bg-gray-100 text-sm">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">닉네임</th>
                                <th className="px-4 py-2 border">이메일</th>
                                <th className="px-4 py-2 border">등급</th>
                                <th className="px-4 py-2 border">상태</th>
                                <th className="px-4 py-2 border">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="text-sm text-center"
                                >
                                    <td className="border px-4 py-2">
                                        {user.id}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {user.nickname}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {user.email}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {user.role}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {user.status}
                                    </td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <button
                                            className="bg-yellow-400 px-2 py-1 rounded text-white text-xs"
                                            onClick={() =>
                                                handleStatusClick(user.id)
                                            }
                                        >
                                            등급 변경
                                        </button>
                                        <button
                                            className="bg-blue-500 px-2 py-1 rounded text-white text-xs"
                                            onClick={() =>
                                                handleRewardClick(user.id)
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
            </div>
        </div>
    );
}
