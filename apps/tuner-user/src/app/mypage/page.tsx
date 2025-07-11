"use client";

import { useRouter } from "next/navigation";
import UserProfile from "./components/UserProfile";
import WalletInfo from "./components/WalletInfo";
import SurveyStats from "./components/SurveyStats";
import { surveyStats } from "@/features/users/utils/surveyStats";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getUserInfo } from "@/features/users/services/user";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useUserStore } from "@/features/users/store/useUserStore";

export default function MyPage() {
  const router = useRouter();
  const { isInitialized } = useAuthGuard();
  const { user } = useAuthStore();
  const { userInfo, setUserInfo } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        const res = await getUserInfo(Number(user.id));
        console.log("내 정보", res);
        setUserInfo(res.data);
      }
    };
    fetchUser();
  }, [user]);

  if (!isInitialized || !userInfo) return null;

  return (
    <div className="bg-gray-100 space-y-2">
      <Breadcrumb crumbs={[{ label: "마이페이지" }]} />
      <UserProfile nickname={userInfo.nickname} role={userInfo.role} />
      <WalletInfo address={userInfo.wallet_address} />

      <SurveyStats
        title="설문 생성 내역"
        stats={surveyStats(userInfo.surveys).map((item) => ({
          label: item.label,
          value: item.count,
        }))}
        onClick={() => router.push("/mypage/mySurvey")}
      />
      <SurveyStats
        title="설문 참여 내역"
        stats={surveyStats(userInfo.surveys).map((item) => ({
          label: item.label,
          value: item.count,
        }))}
        onClick={() => router.push("/mypage/participantsSurvey")}
      />
    </div>
  );
}
