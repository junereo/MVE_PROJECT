// /app/userService/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/network/axios";
import { SurveyStatus, SurveyType } from "@/types";

interface Survey {
  id: number;
  survey_title: string;
  music_title: string;
  start_at: string;
  end_at: string;
  status: SurveyStatus;
  is_active: "upcoming" | "ongoing" | "closed";
  type: SurveyType;
  reward_amount: number;
  participants?: { id: number }[];
}

interface UserDetail {
  id: number;
  nickname: string;
  email: string;
  role: string;
  balance: number;
  surveys: Survey[];
  surveyResponses: unknown[];
  created_at: string;
  updated_at: string;
  badge_issued_at: string | null;
  wallet_address: string | null;
  gender?: string | null; // 더미
  age?: number | null; // 더미
  job_domain?: string | null; // 더미
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const res = await axiosInstance.get(`/user/${id}`);
      const extended = {
        ...res.data,
        gender: res.data.gender ?? "미입력 (더미)",
        age: res.data.age ?? 0,
        job_domain: res.data.job_domain ?? "미입력 (더미)",
      };
      setUser(extended);
    };

    fetchUser();
  }, [id]);

  if (!user) return <div className="p-6">로딩 중...</div>;

  return (
    <div>
      <div className="w-full text-black text-2xl py-3 font-bold">UserView</div>
      <div className="p-6 space-y-6">
        {/* 상단 정보 카드 */}
        <div className="bg-white shadow rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Info title="닉네임" value={user.nickname} />
          <Info title="이메일" value={user.email} />
          <Info title="등급" value={user.role} />
          <Info title="잔여 리워드" value={`${user.balance} STK`} />
          <Info title="설문 생성 수" value={`${user.surveys.length} 개`} />
          <Info
            title="설문 참여 수"
            value={`${user.surveyResponses.length} 개`}
          />
          <Info title="가입일" value={formatDate(user.created_at)} />
          <Info title="최근 활동" value={formatDate(user.updated_at)} />
          <Info
            title="Expert 뱃지"
            value={user.badge_issued_at ? "발급됨" : "미발급"}
          />
          <Info title="지갑 주소" value={user.wallet_address ?? "미등록"} />
          <Info title="성별" value={user.gender ?? "미입력 (더미)"} />
          <Info
            title="연령"
            value={user.age ? `${user.age}세` : "미입력 (더미)"}
          />
          <Info title="직군" value={user.job_domain ?? "미입력 (더미)"} />
        </div>

        {/* 설문 목록 테이블 */}
        <div className="bg-white rounded-xl shadow p-4 w-full">
          <h2 className="text-lg font-bold mb-3">작성한 설문</h2>
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
                <th className="border px-2 py-1">리워드</th>
                <th className="border px-2 py-1">참여 인원</th>
              </tr>
            </thead>
            <tbody>
              {user.surveys.map((survey) => (
                <tr
                  key={survey.id}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => router.push(`/survey/${survey.id}`)}
                >
                  <td className="border px-2 py-1">{survey.id}</td>
                  <td className="border px-2 py-1">{survey.survey_title}</td>
                  <td className="border px-2 py-1">{survey.music_title}</td>
                  <td className="border px-2 py-1">
                    {survey.start_at.slice(0, 10)} ~{" "}
                    {survey.end_at.slice(0, 10)}
                  </td>
                  <td className="border px-2 py-1">{survey.status}</td>
                  <td className="border px-2 py-1">{survey.is_active}</td>
                  <td className="border px-2 py-1">{survey.type}</td>
                  <td className="border px-2 py-1">
                    {survey.reward_amount} STK
                  </td>
                  <td className="border px-2 py-1">
                    {survey.participants?.length ?? 0}명
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

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="text-base font-semibold truncate break-all">{value}</div>
    </div>
  );
}
