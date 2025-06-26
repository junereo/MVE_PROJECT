"use client";

import { useState } from "react";
import tp from "@/app/template/components/Templates";
import templates from "@/app/template/components/Templates";
import { useRouter } from "next/navigation";
import { createTemplate } from "@/lib/network/api";
import { TemplateType } from "@/types";

export default function TemplateSelectPage() {
  const router = useRouter();
  const templateKeys = Object.keys(tp); // ["originality", "popularity", ...]
  const [openKey, setOpenKey] = useState<string | null>(null); // 펼친 상태
  const [loading, setLoading] = useState(false); // 버튼 중복 방지

  const handleTemplateSave = async () => {
    try {
      setLoading(true);
      const formData: TemplateType = {
        template_name: "템플릿 초안1",
        template: templates, //
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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">사용할 템플릿을 선택해주세요</h1>

      <div className="space-y-6">
        <button
          onClick={handleTemplateSave}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          📝 템플릿 저장하기
        </button>
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
        ))}
      </div>
    </div>
  );
}
