import { useSurveyStore } from "../store/useSurveyStore";
import { createSurvey } from "../services/createSurvey";
import { SurveyPayload } from "../types/surveyPayload";

export const useSubmitSurvey = () => {
  const { step1, step2, step3, step4, step5 } = useSurveyStore();

  const submit = async () => {
    if (!step1.video) {
      throw new Error("youtube 영상을 먼저 선택해주세요.");
    }

    const payload: SurveyPayload = {
      step1: {
        video: {
          title: step1.video.title,
          artist: step1.video.artist,
          thumbnail_url: step1.video.thumbnail_url,
          sample_url: `https://www.youtube.com/watch?v=${step1.video.artist}`,
        },
        start_at: step1.start_at,
        end_at: step1.end_at,
      },
      step2,
      step3,
      step4,
      step5,
    };

    return await createSurvey(payload);
  };

  return { submit };
};
