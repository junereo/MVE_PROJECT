interface SurveyQuestionBaseProps {
  label: string;
  showCustomButton: boolean;
  onCustomClick: () => void;
}

export default function SurveyQuestionBase({
  label,
  showCustomButton,
  onCustomClick,
}: SurveyQuestionBaseProps) {
  return (
    <div className="mb-10">
      <p className="font-semibold mb-2">
        {label} 항목은 점수 입력만 가능합니다.
      </p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className="px-2 py-1 text-sm border rounded bg-gray-200 text-gray-500 cursor-not-allowed"
            disabled
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className="min-w-[40px] px-2 py-1 text-sm border rounded bg-gray-200 text-gray-500 cursor-not-allowed"
            disabled
          >
            {num}
          </button>
        ))}
      </div>
      {showCustomButton && (
        <div className="text-right">
          <button
            onClick={onCustomClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + 커스텀 설문 추가하기
          </button>
        </div>
      )}
    </div>
  );
}
