import { SurveyAnswers } from "@/features/survey/store/useAnswerStore";
import { Questions } from "@/features/survey/store/useSurveyStore";

type FormattedAnswer = {
  question_id: number;
  answer: string | string[];
};

export const formatDefaultAnswers = (
  answers: SurveyAnswers,
  defaultQuestions: Questions[]
): FormattedAnswer[] => {
  const result: FormattedAnswer[] = [];

  const filteredCategories = Object.keys(answers).filter(
    (categoryKey) => categoryKey !== "custom"
  );

  for (const categoryKey of filteredCategories) {
    const categoryAnswers = answers[categoryKey];
    const categoryQuestions = defaultQuestions.filter(
      (q) => q.category === categoryKey
    );

    Object.entries(categoryAnswers).forEach(([indexStr, value]) => {
      const index = Number(indexStr);
      const question = categoryQuestions[index];

      if (question?.id !== undefined) {
        result.push({
          question_id: question.id,
          answer: value,
        });
      }
    });
  }

  return result;
};
