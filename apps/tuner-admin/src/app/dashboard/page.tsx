'use client';
// import { useSessionStore } from '@/store/authmeStore';
// import { useRouter } from 'next/navigation';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import { DonutChart } from './components/DonutChart';
const Dashboard = () => {
    // 로그인 세션유지
    useSessionCheck(); // 클라이언트 훅 호출

    return (
        <div className="w-full h-screen bg-white">
            <div className="w-full bg-black text-white text-6xl py-3 pl-8">
                dashboad
            </div>
            <div>
                <div className="p-6 space-y-6">
                    {/* 상단 요약 카드들 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* 각종 요약 카드 */}
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
                            <h2 className="text-lg font-semibold mb-2">Reward Status</h2>
                            {/* 선 그래프 컴포넌트 자리 */}
                            {/* <LineChart /> */}
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
        </div>
    );
};

export default Dashboard;
