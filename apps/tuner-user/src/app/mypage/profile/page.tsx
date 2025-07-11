"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { useUserStore } from "@/features/users/store/useUserStore";

const genderMap = {
  true: "남성",
  false: "여성",
};

const ageMap = {
  teen: "10대",
  twenties: "20대",
  thirties: "30대",
  forties: "40대",
  fifties: "50대",
  sixties: "60대 이상",
};

const roleMap = {
  ordinary: "일반 회원",
  expert: "전문가 회원",
};

export default function ProfilePage() {
  const user = useUserStore((state) => state.userInfo);

  if (!user) return null;

  return (
    <div className="bg-gray-100">
      <Breadcrumb
        crumbs={[
          { label: "마이페이지", href: "/mypage" },
          { label: "내 정보" },
        ]}
      />

      <div className="max-w-2xl mx-auto space-y-2 pt-2">
        {/* 회원 정보 */}
        <Section title="회원정보" actionLabel="수정">
          <ProfileRow label="이름" value={`${user.nickname} 님`} />
          <ProfileRow label="등급" value={roleMap[user.role]} />
          <ProfileRow
            label="휴대폰 번호"
            value={user.phone_number || "010-****-****"}
          />
          <ProfileRow label="이메일" value={user.email} />
        </Section>

        {/* 배송지 관리 */}
        <Section title="지갑 관리" actionLabel="설정">
          <ProfileRow
            label="지갑 주소"
            value={user.wallet_address || "지갑 주소가 없습니다."}
          />
          <ProfileRow
            label="간편 비밀번호"
            value={user.simple_password || "********"}
          />
        </Section>

        {/* 추가 정보 (설문 용) */}
        <Section title="설문 정보" actionLabel="수정">
          <ProfileRow label="성별" value={genderMap[user.gender]} />
          <ProfileRow label="연령대" value={ageMap[user.age]} />
          <ProfileRow label="좋아하는 장르" value={user.genre} />
          <ProfileRow
            label="음악 관련 직무"
            value={user.job_domain ? "예" : "아니오"}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  actionLabel,
  children,
}: {
  title: string;
  actionLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 space-y-2">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {actionLabel && (
          <button className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
            {actionLabel}
          </button>
        )}
      </div>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <li>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base text-gray-800 break-all">{value}</div>
    </li>
  );
}
