"use client";

import UserProfile from "./components/UserProfile";
import WalletInfo from "./components/WalletInfo";
import SurveyStats from "./components/SurveyStatus";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth"); // 비로그인 시 로그인 페이지로
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="bg-gray-100 min-h-screen space-y-2">
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
