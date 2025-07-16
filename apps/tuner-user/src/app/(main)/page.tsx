"use client";

import Slider from "./components/Slider";
import MainSurveyList from "./components/MainSurveyList";
import Card from "./components/Card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <Slider />
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">진행중인 설문</h2>
          <button className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition">
            <Link href="/survey">전체보기</Link>
          </button>
        </div>
        <Card active="ongoing" status="complete" />
        <Link
          href="/survey"
          className="block w-fit mx-auto px-5 py-2 rounded-xl border border-blue-500 text-blue-500 text-sm sm:text-base font-semibold shadow-sm hover:bg-blue-600 hover:text-white hover:shadow-md transition-all"
        >
          진행중 설문 더보기
        </Link>
      </section>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">종료된 설문</h2>
          <button className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition">
            <Link href="/survey">전체보기</Link>
          </button>
        </div>
        <MainSurveyList status="closed" submitStatus="complete" />
      </section>
    </div>
  );
}
