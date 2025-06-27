"use client";

import { useState } from "react";
import Link from "next/link";
import Dropdown from "@/app/components/ui/DropDown";

type SurveyStatus = "예정" | "진행중" | "종료";
type SurveyType = "general" | "official";

interface SurveyItem {
  id: number;
  survey_title: string;
  start_at: string;
  end_at: string;
  is_active: SurveyStatus;
  surveyType: SurveyType;
  participantCount: number;
  reward_amount?: number;
}

// 드롭다운 옵션
const statusOptions = ["전체 상태", "예정", "진행중", "종료"];
const typeOptions = ["전체 유형", "일반 설문", "리워드 설문"];

// 샘플 10개 더미 데이터
const dummySurveys: SurveyItem[] = [
  {
    id: 10,
    survey_title: "한숨에대한 설문",
    start_at: "2025-06-22",
    end_at: "2025-06-29",
    is_active: "종료",
    surveyType: "official",
    participantCount: 70,
    reward_amount: 435,
  },
  {
    id: 9,
    survey_title: "빅뱅에 대한 설문 ",
    start_at: "2025-06-23",
    end_at: "2025-06-30",
    is_active: "진행중",
    surveyType: "general",
    participantCount: 50,
  },
  {
    id: 8,
    survey_title: "팝송 대한 설문",
    start_at: "2025-06-21",
    end_at: "2025-06-28",
    is_active: "예정",
    surveyType: "general",
    participantCount: 67,
  },
  {
    id: 7,
    survey_title: "인디 대한 설문",
    start_at: "2025-06-18",
    end_at: "2025-06-25",
    is_active: "진행중",
    surveyType: "general",
    participantCount: 8,
  },
  {
    id: 6,
    survey_title: "락 에 대한 설문",
    start_at: "2025-06-17",
    end_at: "2025-06-24",
    is_active: "종료",
    surveyType: "official",
    participantCount: 13,
    reward_amount: 386,
  },
  {
    id: 5,
    survey_title: "j-pop 설문 ",
    start_at: "2025-06-17",
    end_at: "2025-06-24",
    is_active: "예정",
    surveyType: "official",
    participantCount: 22,
    reward_amount: 410,
  },
  {
    id: 4,
    survey_title: "k-pop 설문",
    start_at: "2025-06-16",
    end_at: "2025-06-23",
    is_active: "진행중",
    surveyType: "general",
    participantCount: 30,
  },
  {
    id: 3,
    survey_title: "1",
    start_at: "2025-06-14",
    end_at: "2025-06-21",
    is_active: "종료",
    surveyType: "general",
    participantCount: 61,
  },
  {
    id: 2,
    survey_title: "샘플 설문 제목 2",
    start_at: "2025-06-13",
    end_at: "2025-06-20",
    is_active: "예정",
    surveyType: "official",
    participantCount: 15,
    reward_amount: 250,
  },
  {
    id: 1,
    survey_title: "제목 1",
    start_at: "2025-06-12",
    end_at: "2025-06-19",
    is_active: "종료",
    surveyType: "general",
    participantCount: 44,
  },
];

export default function SurveyListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체 상태");
  const [typeFilter, setTypeFilter] = useState("전체 유형");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // 페이지네이션
  const surveysPerPage = 5;

  const filteredSurveys = dummySurveys
    .filter((survey) => {
      const matchTitle = survey.survey_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "전체 상태" || survey.is_active === statusFilter;
      const matchType =
        typeFilter === "전체 유형" ||
        (typeFilter === "일반 설문" && survey.surveyType === "general") ||
        (typeFilter === "리워드 설문" && survey.surveyType === "official");
      return matchTitle && matchStatus && matchType;
    })
    .sort((a, b) => (sortNewestFirst ? b.id - a.id : a.id - b.id));

  const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage);
  const paginatedSurveys = filteredSurveys.slice(
    (currentPage - 1) * surveysPerPage,
    currentPage * surveysPerPage
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">설문 리스트</h1>
        <Link href="/survey/create/step1">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            + 설문 만들기
          </button>
        </Link>
      </div>

      {/* 검색창 */}
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <input
          type="text"
          placeholder="제목 또는 음원명 검색"
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
      <div className="mb-4 text-right text-sm">
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

      {/* 설문 리스트 카드 */}
      <div className="space-y-4">
        {paginatedSurveys.map((survey) => (
          <div
            key={survey.id}
            className="p-4 border bg-white rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <p className="text-lg font-semibold">{survey.survey_title}</p>
              <p className="text-sm text-gray-500">
                ID: {survey.id} | 기간: {survey.start_at} ~ {survey.end_at}
              </p>
              <p className="text-sm text-red-600 ">
                {survey.surveyType === "official" ? "리워드 설문" : "일반 설문"}
                {survey.surveyType === "official" && survey.reward_amount && (
                  <span className="ml-2 text-blue-600 font-medium">
                    🎁 {survey.reward_amount} STK
                  </span>
                )}
              </p>
            </div>
            <div className="mt-3 md:mt-0 text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  survey.is_active === "예정"
                    ? "bg-yellow-100 text-yellow-800"
                    : survey.is_active === "진행중"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {survey.is_active}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                참여 인원: {survey.participantCount}명
              </p>
            </div>
          </div>
        ))}
        {paginatedSurveys.length === 0 && (
          <p className="text-gray-500 text-center mt-10">설문이 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2 text-sm">
          {/* 첫 페이지로 이동 */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:text-gray-400"
          >
            «
          </button>

          {/* 이전 페이지 */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:text-gray-400"
          >
            ＜
          </button>

          {/* 페이지 번호 동적 렌더링 */}
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
                return false; // 공간 확보를 위해 생략
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

          {/* 다음 페이지 */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:text-gray-400"
          >
            ＞
          </button>

          {/* 마지막 페이지로 이동 */}
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
