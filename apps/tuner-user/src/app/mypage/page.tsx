"use client";

import UserProfile from "./components/UserProfile";
import WalletInfo from "./components/WalletInfo";
import SurveyStats from "./components/SurveyStatus";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getUserInfo } from "@/features/users/services/user";
import { useEffect } from "react";

export default function MyPage() {
  const { isInitialized } = useAuthGuard();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserInfo();
      console.log("내 정보", res);
    };
    fetchUser();
  }, []);

  if (!isInitialized) return null; // 아직 로그인 여부 확인 중이면 렌더링 X

  return (
    <div className="bg-gray-100 space-y-2">
      <Breadcrumb crumbs={[{ label: "마이페이지" }]} />
      <UserProfile />
      <WalletInfo />

      <SurveyStats
        title="설문 생성 내역"
        stats={[
          { label: "전체", count: 7 },
          { label: "예정", count: 2 },
          { label: "진행 중", count: 3 },
          { label: "종료", count: 2 },
        ]}
      />
      <SurveyStats
        title="설문 참여 내역"
        stats={[
          { label: "전체", count: 4 },
          { label: "진행 중", count: 1 },
          { label: "종료", count: 3 },
        ]}
      />
    </div>
  );
}
