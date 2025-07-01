import { useSurveyStore } from "../store/useSurveyStore";
import { SurveyPayload } from "../types/surveyPayload";

export function formatSurveyPayload(): SurveyPayload {
  const { selectedVideo, step1, step2, step3, step5 } =
    useSurveyStore.getState();

  return {
    artist: selectedVideo?.artist || "",
    title: selectedVideo?.title || "",
    thumbnail_url: selectedVideo?.thumbnail_url || "",
    sample_url: selectedVideo?.sample_url || "",
    start_at: step1.start_at,
    end_at: step1.end_at,

    survey_title: step2.survey_title,
    release_date: step2.release_date,
    is_released: step2.is_released,
    genre: step2.genre,

    type: step3.surveyType,
    reward_amount: step3.reward_amount,
    reward: step3.reward,
    expert_reward: step3.expert_reward,

    template_id: 1, // 수정해야함, 기본 템플릿도 JSON.stringify 해서 보낼 것

    // 커스텀 설문
    allQuestions: JSON.stringify(
      step5.customQuestions.map((q) => ({
        question_type: q.question_type,
        question_text: q.question_text,
        options: q.options,
      }))
    ),
  };
}
