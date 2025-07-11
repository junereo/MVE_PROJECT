"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useUserStore } from "@/features/users/store/useUserStore";
import MySurveyList from "./components/MySurveyList";

export default function MySurvey() {
  const { userInfo } = useUserStore();

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: "마이페이지", href: "/mypage" },
          { label: "설문 생성 내역" },
        ]}
      />
      <section className="flex items-end justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">내 설문 목록</h1>
          <p className="text-sm text-gray-500">생성한 설문들을 확인해보세요.</p>
        </div>

        <Link
          href="/survey/create"
          className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">설문 생성</span>
          <span className="sm:hidden">생성</span>
        </Link>
      </section>

      <section className="space-y-3 pb-8">
        {userInfo?.surveys?.length === 0 && (
          <p className="text-sm text-gray-500">생성한 설문이 없습니다.</p>
        )}
        <MySurveyList userId={userInfo?.id} />
      </section>
    </>
  );
}
