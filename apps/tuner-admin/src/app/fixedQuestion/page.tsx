"use client";

import { useState } from "react";
// import tp from "@/app/template/components/Templates";
import fixedQuestions from "@/app/fixedQuestion/components/Templates";
// import { useRouter } from "next/navigation";
import { createTemplate } from "@/lib/network/api";
import { SurveyQuestion } from "@/types";

export default function TemplateSelectPage() {
  const [loading, setLoading] = useState(false); // 버튼 중복 방지

  const handleTemplateSave = async () => {
    try {
      setLoading(true);
      const formData: SurveyQuestion = {
        Survey_question: "고정 질문1",
        question: fixedQuestions, //
      };
      console.log(formData);

      await createTemplate(formData); //
      alert("저장 완료!");
    } catch (err) {
      console.error("템플릿 저장 실패:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <div className="w-full  text-black text-2xl py-3  font-bold">
        FixedQuestion
      </div>
      <div className="space-y-6 p-6">
        <button
          onClick={handleTemplateSave}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          템플릿 저장하기
        </button>
        {/* {templateKeys.map((key) => (
          <div key={key} className="border rounded-lg p-4 shadow">
            <div
              className="cursor-pointer font-semibold text-lg text-indigo-600 flex justify-between items-center"
              onClick={() => setOpenKey(openKey === key ? null : key)}
            >
              📦 {key} 템플릿
              <span>{openKey === key ? "▲" : "▼"}</span>
            </div>

            {openKey === key && (
              <div className="mt-4 space-y-4">
                {(tp as any)[key] &&
                  Object.entries((tp as any)[key]).map(
                    ([category, questions]) => (
                      <div key={category}>
                        <p className="font-bold mb-1">📁 {category}</p>
                        {(questions as any[]).map((q, idx) => (
                          <div key={idx} className="ml-4 mb-3">
                            <p className="font-medium">📝 {q.question}</p>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {q.options.map((opt: string, i: number) => (
                                <li key={i}>⦿ {opt}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => router.push("/surveyTest/create/step2")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    ✔ 이 템플릿 사용하기
                  </button>
                </div>
              </div>
            )}
          </div>
        ))} */}
      </div>
    </div>
  );
}
