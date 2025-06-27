"use client";

import { useState } from "react";
import Link from "next/link";
import Dropdown from "../components/ui/DropDown";

// 타입 정의
interface SurveyItem {
  id: number;
  survey_title: string;
  title: string; // 음원명
  start_at: string;
  end_at: string;
  is_active: "예정" | "진행중" | "종료";
  surveyType: "general" | "official";
  participantCount: number;
  reward_amount?: number;
}

const statusOptions = ["전체 상태", "예정", "진행중", "종료"];
const typeOptions = ["전체 유형", "일반 설문", "리워드 설문"];

// 20개 메타데이터 샘플
const dummySurveys: SurveyItem[] = Array.from({ length: 20 }, (_, i) => {
  const id = 20 - i;
  const statuses = ["예정", "진행중", "종료"] as const;
  const types = ["general", "official"] as const;
  return {
    id,
    survey_title: `설문 제목 ${id}`,
    title: `음원 ${id}`,
    start_at: "2025-06-01",
    end_at: "2025-06-30",
    is_active: statuses[id % 3],
    surveyType: types[id % 2],
    participantCount: Math.floor(Math.random() * 100),
    reward_amount: id % 2 === 1 ? undefined : 100 + id * 5,
  };
});

export default function SurveyListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체 상태");
  const [typeFilter, setTypeFilter] = useState("전체 유형");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const surveysPerPage = 10;

  const filteredSurveys = dummySurveys
    .filter((survey) => {
      const matchTitle = survey.survey_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchMusic = survey.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "전체 상태" || survey.is_active === statusFilter;
      const matchType =
        typeFilter === "전체 유형" ||
        (typeFilter === "일반 설문" && survey.surveyType === "general") ||
        (typeFilter === "리워드 설문" && survey.surveyType === "official");
      return (matchTitle || matchMusic) && matchStatus && matchType;
    })
    .sort((a, b) => (sortNewestFirst ? b.id - a.id : a.id - b.id));

  const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage);
  const paginatedSurveys = filteredSurveys.slice(
    (currentPage - 1) * surveysPerPage,
    currentPage * surveysPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">설문 리스트</h1>
        <Link href="/survey/create/step1">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            + 설문 만들기
          </button>
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="설문 제목 또는 음원명 검색"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 w-full md:w-1/2"
        />
        <Dropdown
          options={statusOptions}
          selected={statusFilter}
          onSelect={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        />
        <Dropdown
          options={typeOptions}
          selected={typeFilter}
          onSelect={(value) => {
            setTypeFilter(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 정렬 버튼 */}
      <div className="mb-2 text-right text-sm">
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

      {/* 테이블 형식 목록 */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">설문 제목</th>
              <th className="border px-2 py-1">음원명</th>
              <th className="border px-2 py-1">설문 기간</th>
              <th className="border px-2 py-1">상태</th>
              <th className="border px-2 py-1">유형</th>
              <th className="border px-2 py-1">참여 인원</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSurveys.map((survey) => (
              <tr key={survey.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{survey.id}</td>
                <td className="border px-2 py-1 text-left pl-3">
                  {survey.survey_title}
                </td>
                <td className="border px-2 py-1 text-left pl-3">
                  {survey.title}
                </td>
                <td className="border px-2 py-1">
                  {survey.start_at} ~ {survey.end_at}
                </td>
                <td className="border px-2 py-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      survey.is_active === "예정"
                        ? "bg-yellow-100 text-yellow-800"
                        : survey.is_active === "진행중"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {survey.is_active}
                  </span>
                </td>
                <td className="border px-2 py-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      survey.surveyType === "official"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {survey.surveyType === "official"
                      ? "리워드 설문"
                      : "일반 설문"}
                  </span>
                </td>
                <td className="border px-2 py-1">
                  {survey.participantCount}명
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 (그대로 유지) */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2 text-sm">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:text-gray-400"
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:text-gray-400"
          >
            ＜
          </button>
          {Array.from({ length: totalPages })
            .map((_, i) => i + 1)
            .filter((pageNum) => {
              if (totalPages <= 7) return true;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(currentPage - pageNum) <= 1
              )
                return true;
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2)
                return false;
              return false;
            })
            .map((pageNum, index, arr) => {
              const prev = arr[index - 1];
              const showEllipsis = prev && pageNum - prev > 1;
              return (
                <span key={pageNum} className="flex items-center">
                  {showEllipsis && <span className="px-1">...</span>}
                  <button
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                </span>
              );
            })}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:text-gray-400"
          >
            ＞
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:text-gray-400"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
