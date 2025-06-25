"use client";

import { useState } from "react";
import tp from "@/app/template/components/Templates";
// import { useSurveyStore } from "@/store/surveyStore";
import { useRouter } from "next/navigation";

export default function TemplateSelectPage() {
  const router = useRouter();
  // const { setTemplateSetKey } = useSurveyStore();

  const templateKeys = Object.keys(tp); // ["templates", "templates2", ...]
  const [openKey, setOpenKey] = useState<string | null>(null); // 어떤 템플릿이 열렸는지 상태

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">사용할 템플릿을 선택해주세요</h1>

      <div className="space-y-6">
        {templateKeys.map((key) => (
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

                <button
                  onClick={() => {
                    // setTemplateSetKey(key);
                    router.push("/surveyTest/create/step2");
                  }}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  ✔ 이 템플릿 사용하기
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
