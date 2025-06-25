interface SurveyNavigationProps {
  tabIndex: number;
  totalTabs: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function SurveyNavigation({
  tabIndex,
  totalTabs,
  onPrev,
  onNext,
}: SurveyNavigationProps) {
  return (
    <div className="flex justify-between mt-12">
      <button
        onClick={onPrev}
        disabled={tabIndex === 0}
        className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base rounded"
      >
        이전
      </button>
      <button
        onClick={onNext}
        disabled={tabIndex >= totalTabs - 1}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
}
