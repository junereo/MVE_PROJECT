"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { useUserStore } from "@/features/users/store/useUserStore";
import ProfileSection from "./components/ProfileSection";
import ProfileRow from "./components/ProfileRow";
import {
  genderMap,
  ageMap,
  roleMap,
  AgeKey,
  GenderKey,
} from "@/features/users/constants/userInfoMap";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const user = useUserStore((state) => state.userInfo);
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="bg-gray-100">
      <Breadcrumb
        crumbs={[
          { label: "마이페이지", href: "/mypage" },
          { label: "프로필 관리" },
        ]}
      />

      <div className="max-w-2xl mx-auto space-y-2 pt-2">
        <ProfileSection
          title="회원 정보"
          actionLabel="수정"
          onActionClick={() => router.push("/mypage/profile/member")}
        >
          <ProfileRow label="이름" value={`${user.nickname} 님`} />
          <ProfileRow label="등급" value={roleMap[user.role]} />
          <ProfileRow
            label="휴대폰 번호"
            value={user.phone_number || "010-****-****"}
          />
          <ProfileRow label="이메일" value={user.email} />
        </ProfileSection>

        <ProfileSection
          title="간편 비밀번호 설정"
          actionLabel="설정"
          onActionClick={() => router.push("/mypage/profile/wallet")}
        >
          <ProfileRow label="간편 비밀번호" value="******" />
        </ProfileSection>

        <ProfileSection
          title="설문 정보"
          actionLabel="수정"
          onActionClick={() => router.push("/mypage/profile/survey")}
        >
          <ProfileRow
            label="성별"
            value={
              genderMap[(user.gender === true ? "true" : "false") as GenderKey]
            }
          />
          <ProfileRow label="연령대" value={ageMap[user.age as AgeKey]} />
          <ProfileRow label="좋아하는 장르" value={user.genre} />
          <ProfileRow
            label="음악 관련 직무"
            value={user.job_domain ? "예" : "아니오"}
          />
        </ProfileSection>
      </div>
    </div>
  );
}
