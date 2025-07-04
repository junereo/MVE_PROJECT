"use client";

import { useState } from "react";
import Dropdown from "@/app/components/ui/DropDown";
import RankChangeModal from "./components/RankChaingeModal";
import RewardModal from "./components/RewardModal";

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
  const [rewardSort, setRewardSort] = useState("전체");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    nickname: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  const users: User[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    nickname: `유저${i + 1}`,
    email: `user${i + 1}@email.com`,
    role: ["superadmin", "admin", "general", "expert"][i % 4] as User["role"],
    rewardLeft: i % 2 === 0 ? 50 - i : i * 2,
  }));

  const filteredUsers = users
    .filter((user) => {
      const matchQuery =
        user.nickname.includes(searchQuery) || user.email.includes(searchQuery);
      const matchRole =
        roleFilter === "전체" || user.role === roleFilter.toLowerCase();
      return matchQuery && matchRole;
    })
    .sort((a, b) => {
      if (rewardSort === "리워드 많은순") return b.rewardLeft - a.rewardLeft;
      return sortNewestFirst ? b.id - a.id : a.id - b.id;
    });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleRewardClick = (id: number, nickname: string) => {
    setSelectedUser({ id, nickname });
    setRewardModalOpen(true);
  };
  const handleConfirmReward = (amount: number) => {
    if (selectedUser) {
      console.log(
        `${selectedUser.nickname} (ID: ${selectedUser.id})에게 ${amount} 리워드 지급`
      );
      setRewardModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleRankClick = (id: number, nickname: string) => {
    setSelectedUser({ id, nickname });
    setRankModalOpen(true);
  };

  const handleConfirmRankChange = () => {
    if (selectedUser) {
      console.log(
        `${selectedUser.nickname} (ID: ${selectedUser.id}) 등급을 Expert로 변경`
      );
      setRankModalOpen(false);
      setSelectedUser(null);
    }
  };
  const handleUpdateThreshold = () => {
    console.log("저장된 기준:", threshold);
  };

  return (
    <div>
      <div className="w-full  text-black text-2xl py-3  font-bold">
        UserListTable
      </div>
      <div className="p-6">
        {/* 출금 가능 리워드 */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 text-sm">
          현재 출금 가능 리워드 총합:{" "}
          <span className="font-semibold">120 STK</span>
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
            className="border rounded px-3 py-2 text-sm w-[200px]"
          />

          {/* 최신순 버튼 */}
          <button
            onClick={() => {
              setSortNewestFirst((prev) => !prev);
              setCurrentPage(1);
            }}
            className="text-blue-600 border border-gray-300 px-3 py-2 rounded text-sm"
          >
            {sortNewestFirst ? "▼ 최신순" : "▲ 오래된순"}
          </button>

          {/* 전체 등급 필터 */}
          <Dropdown
            options={["전체", "superadmin", "admin", "general", "expert"]}
            selected={roleFilter}
            onSelect={(value) => {
              setRoleFilter(value);
              setCurrentPage(1);
            }}
          />

          {/* 리워드 정렬 필터 */}
          <Dropdown
            options={["전체", "리워드 많은순"]}
            selected={rewardSort}
            onSelect={(value) => {
              setRewardSort(value);
              setCurrentPage(1);
            }}
          />

          {/* Expert 기준 설정 (오른쪽 정렬) */}
          <div className="flex items-center gap-2  bg-white px-3 py-2 rounded shadow ml-auto">
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

        {/* 유저 테이블 */}
        <div className="bg-white rounded-xl shadow p-4 w-full">
          <table className="w-full border text-sm text-center">
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
                      onClick={() => handleRankClick(user.id, user.nickname)}
                    >
                      등급 변경
                    </button>
                    <button
                      className="bg-blue-500 px-2 py-1 rounded text-white text-xs"
                      onClick={() => handleRewardClick(user.id, user.nickname)}
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
