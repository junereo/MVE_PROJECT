"use client";

import { useState } from "react";
import fixedQuestions from "./components/Templates";
import { createTemplate } from "@/lib/network/api";
import { QuestionTypeEnum } from "@/app/survey/create/complete/type";
import { Question_type } from "@/types";

export interface FixedQuestion {
  category: string;
  question_text: string;
  question_type: Question_type;
  type: QuestionTypeEnum;
  options: string[];
}

const groupByCategory = (
  questions: FixedQuestion[]
): Record<string, FixedQuestion[]> => {
  return questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, FixedQuestion[]>);
};

export default function FixedQuestionTemplatePage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const groupedQuestions = groupByCategory(fixedQuestions); // category별로 묶기

      const formData = {
        Survey_question: "고정 질문1",
        question: groupedQuestions,
        question_type: Question_type.fixed, // 고정 질문 타입
        question_order: 1,
      };

      console.log("전송 데이터 ", formData);
      await createTemplate(formData);
      alert("고정 질문 템플릿 저장 완료!");
    } catch (error) {
      console.error("템플릿 저장 실패 ❌", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🎵 고정 질문 템플릿 업로드
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          아래 버튼을 클릭하면 고정 질문 세트를 서버로 전송합니다.
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "저장 중..." : "📤 템플릿 저장하기"}
        </button>
      </div>
    </div>
  );
}
