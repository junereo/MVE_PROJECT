import { useEffect, useRef } from "react";
import Dropdown from "@/app/components/ui/DropDown";

interface CustomQuestion {
  id: number;
  text: string;
  type: string;
  options: string[];
}

interface SurveyCustomFormProps {
  questions: CustomQuestion[];
  typeOptions: { label: string; value: string }[];
  onAdd: () => void;
  onChangeText: (index: number, value: string) => void;
  onChangeType: (index: number, type: string) => void;
  onChangeOption: (qIndex: number, oIndex: number, value: string) => void;
}

export default function SurveyCustomForm({
  questions,
  typeOptions,
  onAdd,
  onChangeText,
  onChangeType,
  onChangeOption,
}: SurveyCustomFormProps) {
  const lastQuestionRef = useRef<HTMLDivElement>(null);

  // 질문이 추가될 때마다 스크롤 이동
  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [questions.length]);

  return (
    <div className="mb-12">
      <p className="text-lg font-semibold mb-4">커스텀 설문</p>
      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          ref={qIndex === questions.length - 1 ? lastQuestionRef : null}
          className="mb-6 border p-4 rounded"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">질문 {qIndex + 1}</div>
            <Dropdown
              options={typeOptions.map((o) => o.label)}
              selected={
                typeOptions.find((o) => o.value === q.type)?.label ??
                "유형 선택"
              }
              onSelect={(label: string) => {
                const found = typeOptions.find((o) => o.label === label);
                if (found) onChangeType(qIndex, found.value);
              }}
            />
          </div>
          <input
            type="text"
            placeholder="질문을 입력해주세요"
            className="w-full mb-3 p-2 border rounded"
            value={q.text}
            onChange={(e) => onChangeText(qIndex, e.target.value)}
          />
          {q.type === "multiple" || q.type === "checkbox" ? (
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`선택지 ${optIndex + 1}`}
                  className="w-full p-2 border rounded"
                  value={opt}
                  onChange={(e) =>
                    onChangeOption(qIndex, optIndex, e.target.value)
                  }
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

      <div className="text-right">
        <button
          onClick={onAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + 설문 추가하기
        </button>
      </div>
    </div>
  );
}
