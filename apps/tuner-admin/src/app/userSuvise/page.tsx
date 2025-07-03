"use client";

import { useState } from "react";
import Dropdown from "@/app/components/ui/DropDown";

interface User {
  id: number;
  nickname: string;
  email: string;
  role: "superadmin" | "admin" | "general" | "expert";
  rewardLeft: number;
}

export default function AdminUserPage() {
  const [threshold, setThreshold] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("전체");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  const users: User[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    nickname: `유저${i + 1}`,
    email: `user${i + 1}@email.com`,
    role: ["superadmin", "admin", "general", "expert"][i % 4] as User["role"],
    rewardLeft: i % 2 === 0 ? 50 : 0,
  }));

  const filteredUsers = users
    .filter((user) => {
      const matchQuery =
        user.nickname.includes(searchQuery) || user.email.includes(searchQuery);
      const matchRole =
        roleFilter === "전체" || user.role === roleFilter.toLowerCase();
      return matchQuery && matchRole;
    })
    .sort((a, b) => (sortNewestFirst ? b.id - a.id : a.id - b.id));

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleStatusClick = (id: number) => {
    console.log("상태 변경:", id);
  };

  const handleRewardClick = (id: number) => {
    console.log("리워드 지급:", id);
  };

  const handleUpdateThreshold = () => {
    console.log("저장된 기준:", threshold);
  };

  return (
    <div className="p-6 bg-[#EBEBEB] min-h-screen">
      <div className="text-xl font-bold mb-4">관리자 유저 관리</div>

      {/* 출금 가능 리워드 */}
      <div className="bg-white p-4 rounded shadow mb-6 text-sm">
        현재 출금 가능 리워드 총합:{" "}
        <span className="font-semibold">120 STK</span>
      </div>

      {/* 필터 / 기준 설정 */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <input
          type="text"
          placeholder="닉네임 또는 이메일 검색"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2 text-sm w-[200px]"
        />
        <Dropdown
          options={["전체", "superadmin", "admin", "general", "expert"]}
          selected={roleFilter}
          onSelect={(value) => {
            setRoleFilter(value);
            setCurrentPage(1);
          }}
        />
        <div className="ml-auto flex items-center gap-2 bg-white px-3 py-2 rounded shadow">
          <span className="text-sm text-gray-600">Expert 자동 기준</span>
          <button
            className="bg-gray-300 px-2 rounded text-lg"
            onClick={() => setThreshold((prev) => Math.max(1, prev - 1))}
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

      {/* 정렬 */}
      <div className="mb-4 text-sm text-right">
        <button
          onClick={() => {
            setSortNewestFirst((prev) => !prev);
            setCurrentPage(1);
          }}
          className="text-blue-600 hover:underline"
        >
          {sortNewestFirst ? "▼ 최신순" : "▲ 오래된순"}
        </button>
      </div>

      {/* 유저 테이블 */}
      <div className="bg-white rounded-xl shadow p-4 w-full">
        <table className="min-w-full table-auto border text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">닉네임</th>
              <th className="border px-2 py-1">이메일</th>
              <th className="border px-2 py-1">등급</th>
              <th className="border px-2 py-1">리워드 잔량</th>
              <th className="border px-2 py-1">관리</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50">
                <td className="border px-2 py-1">{user.id}</td>
                <td className="border px-2 py-1">{user.nickname}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1 capitalize">{user.role}</td>
                <td className="border px-2 py-1">{user.rewardLeft} STK</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded text-white text-xs"
                    onClick={() => handleStatusClick(user.id)}
                  >
                    상태 변경
                  </button>
                  <button
                    className="bg-blue-500 px-2 py-1 rounded text-white text-xs"
                    onClick={() => handleRewardClick(user.id)}
                  >
                    리워드 지급
                  </button>
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
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
