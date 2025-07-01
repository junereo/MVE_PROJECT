"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import Wrapper from "@/components/layouts/Wrapper";
import SurveyList from "./components/ui/SurveyList";
import SurveyBreadcrumb from "@/features/survey/components/SurveyBreadcrumb";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Survey() {
  return (
    <>
      <Header />

      <Wrapper>
        <SurveyBreadcrumb />
        <section className="mb-6">
          <h1 className="pt-[20px] text-xl font-bold text-gray-900 mb-2">
            설문 목록
          </h1>
          <p className="pb-[10px] text-sm text-gray-500">
            현재 진행 중인 설문들을 확인해보세요.
          </p>
        </section>

        <SurveyList />
      </Wrapper>

      <Link
        href="/survey/create"
        className="    fixed bottom-[80px] z-20 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm"
        style={{
          right: "max(calc(50% - 320px), 1rem)",
        }}
      >
        <Plus className="w-4 h-4" />
        설문 생성
      </Link>

      <BottomNavbar />
      <Footer />
    </>
  );
}
