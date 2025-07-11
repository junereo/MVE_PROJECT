"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import MemberEditForm from "./components/MemberEditForm";
import PasswordEditForm from "./components/PasswordEditForm";
import SurveyEditForm from "./components/SurveyEditForm";

const sectionMap = {
  member: "회원 정보",
  password: "간편 비밀번호",
  survey: "설문 정보",
} as const;

export default function ProfileEditPage() {
  const { section } = useParams();

  const currentSection = Array.isArray(section) ? section[0] : section;

  if (!currentSection || !(currentSection in sectionMap)) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div className="bg-gray-100">
      <Breadcrumb
        crumbs={[
          { label: "마이페이지", href: "/mypage" },
          { label: "프로필 관리", href: "/mypage/profile" },
          {
            label: `${
              sectionMap[currentSection as keyof typeof sectionMap]
            } 수정`,
          },
        ]}
      />

      <div className="max-w-2xl mx-auto pt-2">
        <h1 className="text-xl font-semibold bg-white p-4">
          {sectionMap[currentSection as keyof typeof sectionMap]} 수정
        </h1>

        {section === "member" && <MemberEditForm />}
        {section === "password" && <PasswordEditForm />}
        {section === "survey" && <SurveyEditForm />}
      </div>
    </div>
  );
}
