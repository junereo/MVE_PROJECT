import { useEffect, useState } from "react";
import { getSurveyById } from "@/features/survey/services/survey";
import { getSurveyResult } from "@/features/survey/services/survey";

export function useQuestionResults(surveyId: number) {
  const [questionResults, setQuestionResults] = useState<
    { question: string; options: { label: string; percentage: number }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [surveyRes, resultRes] = await Promise.all([
          getSurveyById(surveyId),
          getSurveyResult(surveyId),
        ]);

        const questions = surveyRes.survey_question;

        const stats = Object.values(resultRes.data.survey_statistics) as {
          id: number;
          average: number[];
        }[];

        const results = questions
          .filter((q) => q.type !== "subjective") // 서술형 제외
          .map((q, i) => {
            const stat = stats[i];
            const total = stat?.average?.reduce((a, b) => a + b, 0) || 0;

            return {
              question: q.question_text,
              options: q.options.map((label, idx) => ({
                label,
                percentage:
                  total === 0
                    ? 0
                    : Math.round(((stat?.average?.[idx] ?? 0) / total) * 100),
              })),
            };
          });

        setQuestionResults(results);
      } catch (err) {
        console.error("질문 통계 데이터 가져오기 실패", err);
        setQuestionResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [surveyId]);

  return { questionResults, isLoading };
}
