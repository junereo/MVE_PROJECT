"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QuestionTypeEnum } from "@/app/survey/create/complete/type"; // 질문 타입 enum
import TagSelector from "./components/TagSelectorParticipate"; // 태그 선택 컴포넌트

// 질문 타입 정의
interface Question {
  category?: string;
  question_text: string;
  question_type?: QuestionTypeEnum;
  options: string[];
}

export default function SurveyParticipatePage() {
  const searchParams = useSearchParams();
  const rawAllQuestions = searchParams.get("questions"); // 문자열 형태 JSON
  const [categoryQuestions, setCategoryQuestions] = useState<Question[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  const [scores, setScores] = useState<Record<string, number>>({});
  const [templateAnswers, setTemplateAnswers] = useState<
    Record<string, string>
  >({});
  const [customAnswers, setCustomAnswers] = useState<
    Record<number, string | string[]>
  >({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 초기 파싱
  useEffect(() => {
    if (!rawAllQuestions) return;
    const parsed: Question[] = JSON.parse(rawAllQuestions);
    const category = parsed.filter((q) => q.category);
    const custom = parsed.filter((q) => !q.category);
    setCategoryQuestions(category);
    setCustomQuestions(custom);
  }, [rawAllQuestions]);

  // 응답 핸들러
  const handleTemplateAnswer = (
    category: string,
    text: string,
    score: number
  ) => {
    setTemplateAnswers((prev) => ({ ...prev, [category]: text }));
    setScores((prev) => ({ ...prev, [category]: score }));
  };

  const handleCustomAnswer = (index: number, value: string | string[]) => {
    setCustomAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      scores,
      templateAnswers,
      customAnswers,
      tags: selectedTags,
    };
    console.log("제출할 데이터:", payload);
    alert("설문이 제출되었습니다.");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">설문 참여</h1>

      {/* 기본 평가 항목 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">기본 평가 항목</h2>
        <div className="space-y-6">
          {categoryQuestions.map((q, idx) => (
            <div key={idx}>
              <p className="font-medium">{q.category}</p>
              <div className="flex flex-col gap-2 mt-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name={`category-${q.category}`}
                      value={opt}
                      onChange={() =>
                        handleTemplateAnswer(q.category!, opt, 10 - i * 2)
                      }
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 커스텀 질문 항목 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">커스텀 질문</h2>
        <div className="space-y-6">
          {customQuestions.map((q, idx) => (
            <div key={idx}>
              <p className="font-medium">{q.question_text}</p>

              {q.question_type === QuestionTypeEnum.MULTIPLE && (
                <div className="flex flex-col gap-2 mt-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name={`custom-${idx}`}
                        value={opt}
                        onChange={() => handleCustomAnswer(idx, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.question_type === QuestionTypeEnum.CHECKBOX && (
                <div className="flex flex-col gap-2 mt-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCustomAnswers((prev) => {
                            const prevArr = (prev[idx] as string[]) || [];
                            return {
                              ...prev,
                              [idx]: checked
                                ? [...prevArr, opt]
                                : prevArr.filter((o) => o !== opt),
                            };
                          });
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.question_type === QuestionTypeEnum.SUBJECTIVE && (
                <textarea
                  placeholder="답변을 입력해주세요"
                  className="border p-2 mt-2 w-full"
                  onChange={(e) => handleCustomAnswer(idx, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 해시태그 */}
      <TagSelector
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      {/* 제출 */}
      <div className="text-center pt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          설문 제출하기
        </button>
      </div>
    </div>
  );
}
