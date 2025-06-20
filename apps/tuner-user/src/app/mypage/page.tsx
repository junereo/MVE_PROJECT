import UserProfile from "./components/UserProfile";
import WalletInfo from "./components/WalletInfo";
import SurveyStats from "./components/SurveyStatus";

export default function MyPage() {
  return (
    <div className="bg-gray-100 min-h-screen space-y-2">
      <UserProfile />
      <WalletInfo />

      <SurveyStats
        title="설문 생성 내역"
        grid="4"
        stats={[
          { label: "전체", count: 7 },
          { label: "예정", count: 2 },
          { label: "진행 중", count: 3 },
          { label: "종료", count: 2 },
        ]}
      />
      <SurveyStats
        title="설문 참여 내역"
        grid="3"
        stats={[
          { label: "전체", count: 4 },
          { label: "진행 중", count: 1 },
          { label: "종료", count: 3 },
        ]}
      />
    </div>
  );
}
