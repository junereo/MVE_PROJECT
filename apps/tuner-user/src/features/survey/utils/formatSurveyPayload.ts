import { useSurveyStore } from "../store/useSurveyStore";
import { SurveyPayload } from "../types/surveyPayload";
import { QuestionTypeEnum, SurveyStatusEnum } from "../types/enums";

export function formatSurveyPayload(status: SurveyStatusEnum): SurveyPayload {
  const { selectedVideo, step1, step2, step3, step5 } =
    useSurveyStore.getState();

  const hasCustomQuestions = step5.customQuestions.length > 0;

  return {
    artist: selectedVideo?.artist || "",
    music_title: selectedVideo?.music_title || "",
    thumbnail_uri: selectedVideo?.thumbnail_uri || "",
    music_uri: selectedVideo?.music_uri || "",

    start_at: step1.start_at, // ISO 8601 string
    end_at: step1.end_at,

    survey_title: step2.survey_title,
    is_released: step2.is_released,
    release_date: step2.release_date,
    genre: step2.genre.toLowerCase(),

    type: step3.surveyType,
    reward_amount: step3.reward_amount,
    reward: step3.reward,
    expert_reward: step3.expert_reward,

    question_type: QuestionTypeEnum.FIXED,
    questions: 1, // 고정 질문 id=1

    // 커스텀 질문이 있을 경우만 포함
    ...(hasCustomQuestions && {
      allQuestions: JSON.stringify(
        step5.customQuestions.map((q) => ({
          question_text: q.question_text,
          type: q.type,
          question_type: q.question_type,
          options: q.options,
        }))
      ),
    }),

    status,
  };
}
