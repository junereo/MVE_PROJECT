"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useUserStore } from "@/features/users/store/useUserStore";
import { useSurveyAnswerStore } from "@/features/users/store/useSurveyAnswerStore";
import { useWithdrawalStore } from "@/features/withdrawal/store/useWithdrawalStore";

import { getUserInfo } from "@/features/users/services/user";
import { getMySurveyAnswer } from "@/features/users/services/survey";
import { getUserWithdrawals } from "@/features/withdrawal/services/withdrawal";
import { getAddressToken } from "@/features/withdrawal/services/contract";

import Breadcrumb from "@/components/ui/Breadcrumb";
import UserProfile from "./components/UserProfile";
import WalletInfo from "./components/WalletInfo";
import SurveyStats from "./components/SurveyStats";

import { surveyStats } from "@/features/users/utils/surveyStats";
import { surveyParticipationStats } from "@/features/users/utils/surveyParticipationStats";

export default function MyPage() {
  const router = useRouter();
  const { isInitialized } = useAuthGuard();
  const { user } = useAuthStore();
  const { userInfo, setUserInfo } = useUserStore();
  const { answers, setAnswers } = useSurveyAnswerStore();
  const { withdrawals, setWithdrawals } = useWithdrawalStore();
  const [tuner, setTuner] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        const res = await getUserInfo(Number(user.id));
        const data = await getMySurveyAnswer();
        const result = await getUserWithdrawals(Number(user.id));
        const tunerRes = await getAddressToken(Number(user.id));

        setUserInfo(res.data);
        setAnswers(data.data);
        setWithdrawals(result.data);
        const parsed = Number(tunerRes.token);
        setTuner(isNaN(parsed) ? 0 : parsed);
      }
    };

    fetchUser();
  }, [user, setUserInfo, setAnswers]);

  if (!isInitialized || !userInfo) return null;

  return (
    <div className="bg-gray-100 space-y-2">
      <Breadcrumb crumbs={[{ label: "마이페이지" }]} />
      <UserProfile nickname={userInfo.nickname} role={userInfo.role} />
      <WalletInfo balance={userInfo.balance} tuner={tuner} />

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
        stats={surveyParticipationStats(answers).map((item) => ({
          label: item.label,
          value: item.count,
        }))}
        onClick={() => router.push("/mypage/participantsSurvey")}
      />
    </div>
  );
}
