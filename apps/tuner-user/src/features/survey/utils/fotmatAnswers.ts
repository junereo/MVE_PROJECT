import type { SurveyAnswers } from "@/features/survey/store/useAnswerStore";
import type { Questions } from "@/features/survey/store/useSurveyStore";

export const formatDefaultAnswers = (
  answers: SurveyAnswers,
  questions: Questions[]
) => {
  return questions.map((q) => {
    // category 기반으로 상태에서 answer 추출
    const step = q.category;
    const answer = answers[step]?.[q.id] ?? null;

    return {
      id: q.id,
      question_text: q.question_text,
      type: q.type,
      options: q.options ?? [],
      max_num: q.max_num ?? 1, // max_num 없으면 기본값 1
      answer: answer ?? null, // 응답 안 한 경우 null 처리
    };
  });
};
