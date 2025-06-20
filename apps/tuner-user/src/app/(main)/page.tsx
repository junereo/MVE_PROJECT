"use client";

import Slider from "./components/Slider";
import List from "./components/List";
import Card from "./components/Card";

export default function Home() {
  return (
    <div className="space-y-10">
      <Slider />
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">진행중인 설문</h2>
          <button className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition">
            전체보기
          </button>
        </div>
        <Card />
        <button className="flex mx-auto px-4 py-1 border border-blue-300 bg-white hover:bg-blue-50 transition">
          진행중 설문 더보기
        </button>
      </section>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">종료된 설문</h2>
          <button className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition">
            전체보기
          </button>
        </div>
        <List />
      </section>
    </div>
  );
}
