import { SummaryStats } from "@/features/survey/types/surveyResultPayload";

export default function SummaryCard({ summary }: { summary: SummaryStats }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 px-5 py-4 sm:px-6 sm:py-5 space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">
        📊 설문 요약
      </h2>

      <div className="grid grid-cols-2 text-sm sm:text-base text-gray-600">
        <span>⭐ 작품성 평균</span>
        <span className="text-right text-gray-900 font-medium">
          {summary["작품성 평균"]}
        </span>
      </div>

      <div className="grid grid-cols-2 text-sm sm:text-base text-gray-600">
        <span>📣 대중성 평균</span>
        <span className="text-right text-gray-900 font-medium">
          {summary["대중성 평균"]}
        </span>
      </div>

      <div className="grid grid-cols-2 text-sm sm:text-base text-gray-600">
        <span>👥 참여자 수</span>
        <span className="text-right text-gray-900 font-medium">
          {summary["참여자 수"]}명
        </span>
      </div>
    </div>
  );
}
