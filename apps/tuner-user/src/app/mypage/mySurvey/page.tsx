"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import PageWrapper from "@/components/layouts/PageWrapper";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Survey() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Breadcrumb crumbs={[{ label: "설문 목록" }]} />
        <section className="flex items-end justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">내 설문 목록</h1>
            <p className="text-sm text-gray-500">
              생성한 설문들을 확인해보세요.
            </p>
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
      </PageWrapper>
      <BottomNavbar />
      <Footer />
    </>
  );
}
