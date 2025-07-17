'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Dropdown from '@/app/components/ui/DropDown';
import { surveyList } from '@/lib/network/api';
import { SurveyStatus } from '@/types';
import {
    SurveyTypeEnum,
    QuestionTypeEnum,
} from '@/app/survey/create/complete/type';

// 서버 응답 타입
interface Creator {
    id: number;
    nickname: string;
    role: string;
}

// 설문 응답 타입
interface SurveyResponseItem {
    id: number;
    survey_title: string;
    music_title: string;
    artist: string;
    music_uri: string;
    thumbnail_uri: string;
    start_at: string;
    end_at: string;
    is_active: 'upcoming' | 'ongoing' | 'closed';
    type: 'general' | 'official';
    status: SurveyStatus;
    reward_amount: number;
    participants: { id: number }[];
    creator: Creator;
    rest_amount?: number;
}

// 리스트에서 사용할 내부 타입
interface SurveyItem {
    id: number;
    survey_title: string;
    title: string;
    start_at: string;
    end_at: string;
    is_active: '예정' | '진행중' | '종료';
    status: SurveyStatus;
    surveyType: SurveyTypeEnum;
    participantCount: number;
    reward_amount?: number;
    question_type: QuestionTypeEnum;
    creatorRole: string;
    rest_amount?: number;
}

// 필터 옵션
const statusOptions = ['진행 상태', '예정', '진행중', '종료'];
const typeOptions = ['전체 유형', '일반 설문', '리워드 설문'];
const surveyStatusOptions = ['설문 상태', '임시저장', '생성 완료'];
const roleOptions = ['전체 등급', 'ordinary', 'expert', 'admin', 'superadmin'];

// 상태 변환 (백엔드 값 -> 프론트 표기용)
const convertStatus = (status: string): '예정' | '진행중' | '종료' => {
    switch (status) {
        case 'upcoming':
            return '예정';
        case 'ongoing':
            return '진행중';
        case 'closed':
            return '종료';
        default:
            return '예정';
    }
};

// 설문 상태 한글화
const getStatusLabel = (status: SurveyStatus) => {
    return status === SurveyStatus.draft ? '임시저장' : '생성 완료';
};

// API 호출 및 변환
const surveylist = async (): Promise<SurveyItem[]> => {
    const { data }: { data: SurveyResponseItem[] } = await surveyList();
    return data.map((item) => {
        return {
            id: item.id,
            survey_title: item.survey_title,
            title: item.music_title || '제목 없음',
            start_at: item.start_at.slice(0, 10),
            end_at: item.end_at.slice(0, 10),
            is_active: convertStatus(item.is_active),
            status: item.status,
            surveyType:
                item.type === 'official'
                    ? SurveyTypeEnum.OFFICIAL
                    : SurveyTypeEnum.GENERAL,
            participantCount: item.participants?.length || 0,
            reward_amount: (item.reward_amount ?? 0) / 1000,
            question_type: QuestionTypeEnum.MULTIPLE,
            creatorRole: item.creator?.role || 'unknown',
            rest_amount: (item.rest_amount ?? 0) / 1000,
        };
    });
};

export default function SurveyListPage() {
    const router = useRouter();
    const [surveys, setSurveys] = useState<SurveyItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('진행 상태');
    const [typeFilter, setTypeFilter] = useState('전체 유형');
    const [surveyStatusFilter, setSurveyStatusFilter] = useState('설문 상태');
    const [roleFilter, setRoleFilter] = useState('전체 등급');
    const [sortNewestFirst, setSortNewestFirst] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const surveysPerPage = 10;

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const list = await surveylist();
                console.log('불러온 설문 리스트:', list);
                setSurveys(list);
            } catch (err) {
                console.error('설문 리스트 불러오기 실패:', err);
            }
        };
        fetchSurveys();
    }, []);

    const filteredSurveys = surveys
        .filter((survey) => {
            const matchTitle = survey.survey_title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchMusic = survey.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchStatus =
                statusFilter === '진행 상태' ||
                survey.is_active === statusFilter;
            const matchType =
                typeFilter === '전체 유형' ||
                (typeFilter === '일반 설문' &&
                    survey.surveyType === SurveyTypeEnum.GENERAL) ||
                (typeFilter === '리워드 설문' &&
                    survey.surveyType === SurveyTypeEnum.OFFICIAL);
            const matchSurveyStatus =
                surveyStatusFilter === '설문 상태' ||
                getStatusLabel(survey.status) === surveyStatusFilter;
            const matchRole =
                roleFilter === '전체 등급' || survey.creatorRole === roleFilter;

            return (
                (matchTitle || matchMusic) &&
                matchStatus &&
                matchType &&
                matchSurveyStatus &&
                matchRole
            );
        })
        .sort((a, b) => (sortNewestFirst ? b.id - a.id : a.id - b.id));

    const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage);
    const paginatedSurveys = filteredSurveys.slice(
        (currentPage - 1) * surveysPerPage,
        currentPage * surveysPerPage,
    );

    return (
        <div>
            <div className="w-full text-black text-2xl py-3 font-bold">
                설문 리스트
            </div>
            <div className="p-6">
                {/* 검색 + 필터 + 설문 만들기 버튼 */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    {/* 왼쪽: 검색 + 필터 */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="설문 제목 또는 음원명 검색"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border p-2 min-w-[800px] md:w-60 "
                        />
                        <Dropdown
                            options={surveyStatusOptions}
                            selected={surveyStatusFilter}
                            onSelect={(value) => {
                                setSurveyStatusFilter(value);
                                setCurrentPage(1);
                            }}
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
                        <Dropdown
                            options={roleOptions}
                            selected={roleFilter}
                            onSelect={(value) => {
                                setRoleFilter(value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* 오른쪽: 설문 만들기 버튼 */}
                    <Link href="/survey/create/step1">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap">
                            + 설문 만들기
                        </button>
                    </Link>
                </div>

                {/* 정렬 */}
                <div className="mb-2 text-right text-sm">
                    <button
                        onClick={() => {
                            setSortNewestFirst((prev) => !prev);
                            setCurrentPage(1);
                        }}
                        className="text-blue-600 hover:underline"
                    >
                        {sortNewestFirst ? '▼ 최신순' : '▲ 오래된순'}
                    </button>
                </div>

                {/* 테이블 */}
                <div className="bg-white rounded-xl shadow p-4 w-full">
                    <table className="w-full border text-sm text-center">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">설문 제목</th>
                                <th className="border px-2 py-1">음원명</th>
                                <th className="border px-2 py-1">설문 기간</th>
                                <th className="border px-2 py-1">설문 상태</th>
                                <th className="border px-2 py-1">진행 상태</th>
                                <th className="border px-2 py-1">유형</th>
                                <th className="border px-2 py-1">리워드잔량</th>
                                <th className="border px-2 py-1">참여 인원</th>
                                <th className="border px-2 py-1">등급</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSurveys.map((survey) => (
                                <tr
                                    key={survey.id}
                                    onClick={() =>
                                        router.push(`/survey/${survey.id}`)
                                    }
                                    className={`hover:bg-blue-50 cursor-pointer`}
                                >
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        {survey.id}
                                    </td>
                                    <td className="border px-2 py-1 text-left pl-3 h-[40px] align-middle">
                                        <div
                                            className="truncate max-w-[180px]"
                                            title={survey.survey_title}
                                        >
                                            {survey.survey_title}
                                        </div>
                                    </td>
                                    <td className="border px-2 py-1 text-left pl-3 h-[40px] align-middle">
                                        <div
                                            className="truncate max-w-[180px]"
                                            title={survey.title}
                                        >
                                            {survey.title}
                                        </div>
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        {survey.start_at} ~ {survey.end_at}
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        {getStatusLabel(survey.status)}
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                survey.is_active === '예정'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : survey.is_active ===
                                                      '진행중'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {survey.is_active}
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                survey.surveyType ===
                                                SurveyTypeEnum.OFFICIAL
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {survey.surveyType ===
                                            SurveyTypeEnum.OFFICIAL
                                                ? '리워드 설문'
                                                : '일반 설문'}
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                survey.rest_amount === 0
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {survey.rest_amount} 포인트
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        {survey.participantCount}명
                                    </td>
                                    <td className="border px-2 py-1 h-[40px] align-middle">
                                        {survey.creatorRole}
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
            </div>
        </div>
    );
}
