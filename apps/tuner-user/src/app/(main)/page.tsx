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
        <Card status="ongoing" />
        <button className="flex mx-auto px-4 py-1 border border-blue-300 bg-white hover:bg-blue-50 transition">
          <Link href="/survey">진행중 설문 더보기</Link>
        </button>
      </section>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">종료된 설문</h2>
          <button className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition">
            <Link href="/survey">전체보기</Link>
          </button>
        </div>
        <MainSurveyList status="closed" />
      </section>
    </div>
  );
}
