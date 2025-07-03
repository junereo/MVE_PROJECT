import { SurveyAnswers, FormattedAnswer } from "@/features/survey/types/answer";
import { Question } from "@/features/survey/types/question";

export const formatAnswers = (
  answers: SurveyAnswers,
  questionsByCategory: Record<string, Question[]>
): FormattedAnswer[] => {
  const result: FormattedAnswer[] = [];

  Object.entries(answers).forEach(([categoryKey, categoryAnswers]) => {
    const questions = questionsByCategory[categoryKey];

    Object.entries(categoryAnswers).forEach(([indexStr, answer]) => {
      const index = Number(indexStr);
      const question = questions?.[index];

      if (question?.id !== undefined) {
        result.push({
          question_id: question.id,
          answer,
        });
      }
    });
  });

  return result;
};
