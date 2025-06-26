"use client";
// import { useSessionStore } from '@/store/authmeStore';
// import { useRouter } from 'next/navigation';
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { DonutChart } from "./components/DonutChart";
import RewardLineChart from "./components/Recjarts";
import SummaryCard from "./components/SummaryCard";

const Dashboard = () => {
  // 로그인 세션유지
  useSessionCheck(); // 클라이언트 훅 호출

  return (
    <>
      <div className="w-full  text-black text-2xl py-3  font-bold">
        Dashboard
      </div>
      <div>
        <div className="p-6 space-y-6 w-[100%]">
          {/* 상단 요약 카드들 */}
          <div className="flex  gap-5">
            <SummaryCard
              title="설문 갯수"
              value="800"
              trend="Total Surveys"
              percentage="+12.5%"
            />
            <SummaryCard
              title="참여자 수"
              value="1,024"
              trend="Total Participants"
              percentage="+8.2%"
            />
            <SummaryCard
              title="리워드 지급"
              value="842"
              trend="Reward Payouts"
              percentage="+15.4%"
            />
            <SummaryCard
              title="출금 요청"
              value="321"
              trend="Withdrawal Requests"
              percentage="+4.1%"
            />
          </div>
          {/* 중간 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 왼쪽: 도넛 그래프 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">진행중인 설문 비율</h2>
              {/* 도넛 그래프 컴포넌트 자리 */}
              <DonutChart />
            </div>

            {/* 오른쪽: 선 그래프 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">설문 참여율</h2>
              {/* 선 그래프 컴포넌트 자리 */}
              <RewardLineChart />
            </div>
          </div>
          {/* 설문 목록 + 출금 목록 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Survey Management 테이블 */}
            {/* <SurveyTable /> */}

            {/* Withdrawal Requests 테이블 */}
            {/* <WithdrawalTable /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
