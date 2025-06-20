"use client";

import { useSessionCheck } from "@/hooks/useSessionCheck";
import YoutubeBtn from "../components/ui/Youtube";
import YoutuveVideo from "./components/youtubeVideo";
import { Suspense, useState } from "react";
import ExamplePage from "./components/drop";

const Survey = () => {
  useSessionCheck();

  const [questions, setQuestions] = useState([
    { id: 1, type: "multiple", options: ["", "", "", ""], text: "" },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "multiple",
        options: ["", "", "", ""],
        text: "",
      },
    ]);
  };

  const handleTypeChange = (index: number, newType: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              type: newType,
              options: newType === "multiple" ? ["", "", "", ""] : [],
            }
          : q
      )
    );
  };

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
        {/* 질문 영역 */}
        <div className="mt-6">
          {questions.map((q, index) => (
            <div key={q.id} className="mb-6 border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">질문 {index + 1}</div>
                <select
                  value={q.type}
                  onChange={(e) => handleTypeChange(index, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="multiple">객관식</option>
                  <option value="subjective">서술형</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="질문을 입력해주세요"
                className="w-full mb-3 p-2 border rounded"
              />

              {q.type === "multiple" ? (
                <div className="space-y-2">
                  {q.options.map((_, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      placeholder={`선택지 ${optIndex + 1}`}
                      className="w-full p-2 border rounded"
                    />
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="서술형 답변 예시"
                  className="w-full p-2 border rounded"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end mb-8">
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              + 질문 추가하기
            </button>
          </div>
        </div>

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
