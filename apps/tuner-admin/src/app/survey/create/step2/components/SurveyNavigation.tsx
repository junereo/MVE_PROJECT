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
            {/* 이전 버튼은 항상 보여줌, 비활성화만 */}
            <button
                onClick={onPrev}
                disabled={tabIndex === 0}
                className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base rounded"
            >
                이전
            </button>

            {/* 다음 버튼은 조건부로 렌더링 */}
            {tabIndex < totalTabs - 1 && (
                <button
                    onClick={onNext}
                    className="px-4 py-2 bg-black text-white rounded"
                >
                    다음
                </button>
            )}
        </div>
    );
}
