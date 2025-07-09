import { GroupResult } from "@/features/survey/types/surveyResultPayload";

export default function GroupedResponses({
  grouped,
}: {
  grouped: Record<string, GroupResult[]>;
}) {
  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([group, questions], idx) => (
        <div key={idx} className="space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3 sm:pl-4">
            {group}
          </h2>
          {questions.map((q, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-gray-100 px-5 py-4 sm:px-6 sm:py-5 space-y-4"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-snug sm:leading-normal">
                {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((opt, j) => (
                  <div key={j} className="space-y-1">
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>{opt.label}</span>
                      <span className="text-gray-800 font-medium">
                        {opt.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${opt.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
