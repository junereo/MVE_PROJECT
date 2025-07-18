import { useSurveyStore } from "../store/useSurveyStore";
import { SurveyPayload } from "../types/surveyPayload";
import { SurveyStatusEnum } from "../types/enums";
import { QuestionTypeEnum } from "../types/enums";

export function formatSurveyPayload(status: SurveyStatusEnum): SurveyPayload {
  const { selectedVideo, step1, step2, step3, step4 } =
    useSurveyStore.getState();

  const allQuestions = [...step4.questions, ...step4.customQuestions];

  return {
    artist: selectedVideo?.artist || "",
    music_title: selectedVideo?.music_title || "",
    thumbnail_uri: step1.thumbnail_uri || "",
    music_uri: selectedVideo?.music_uri || "",

    start_at: step1.start_at ? new Date(step1.start_at).toISOString() : "",
    end_at: step1.end_at ? new Date(step1.end_at).toISOString() : "",

    survey_title: step2.survey_title,
    is_released: step2.is_released,
    release_date: step2.release_date,
    genre: step2.genre.toLowerCase(),

    type: step3.surveyType,
    reward_amount: step3.reward_amount,
    reward: step3.reward,
    expert_reward: step3.expert_reward,

    question_type: QuestionTypeEnum.FIXED,
    questions: 1,

    survey_question: allQuestions.map((q) => ({
      question_text: q.question_text,
      type: q.type,
      category: q.category,
      question_type: q.question_type,
      options: q.options ?? [],
      max_num: q.max_num ?? 1,
    })),

    status,
  };
}
