export default function QuestionBasedResponses({
  questions,
}: {
  questions: {
    question: string;
    options: { label: string; percentage: number }[];
  }[];
}) {
  return (
    <div className="space-y-10">
      {questions.map((q, i) => (
        <div key={i} className="space-y-4">
          <h2 className="font-bold text-base sm:text-lg text-gray-800 border-l-4 border-[#57CC7E] pl-3">
            {q.question}
          </h2>
          <div className="space-y-2">
            {q.options.map((opt, j) => (
              <div key={j}>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{opt.label}</span>
                  <span>{opt.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#57CC7E] rounded-full"
                    style={{ width: `${opt.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
