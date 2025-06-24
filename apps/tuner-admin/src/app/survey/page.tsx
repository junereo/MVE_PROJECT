"use client";

import { useSessionCheck } from "@/hooks/useSessionCheck";
import YoutubeBtn from "../components/ui/Youtube";
import YoutuveVideo from "./components/youtubeVideo";
import { Suspense } from "react";
import ExamplePage from "./components/drop";
const Survey = () => {
  useSessionCheck();
  return (
    <div className="w-full flex justify-center bg-gray-50 py-10">
      <div className="w-[1200px] bg-white p-8 rounded shadow">
        {/* 유튜브 영상 */}
        <div className="flex justify-end mb-4">
          <YoutubeBtn type="button">유튜브 영상 찾으러 가기</YoutubeBtn>
        </div>
        <Suspense fallback={<div>유튜브 로딩 중...</div>}>
          <YoutuveVideo />
        </Suspense>
        <ExamplePage />

        {/* 리워드 영역 */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">총 리워드 총량</label>
            <input
              type="number"
              placeholder="예: 1000"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">일반 유저 리워드</label>
            <input
              type="number"
              placeholder="예: 10"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Expert 유저 리워드</label>
            <input
              type="number"
              placeholder="예: 20"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
