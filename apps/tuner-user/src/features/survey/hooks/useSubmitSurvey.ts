import { useSurveyStore } from "../store/useSurveyStore";
import { createSurvey } from "../services/createSurvey";
import { SurveyPayload } from "../types/surveyTypes";

export const useSubmitSurvey = () => {
  const { step1, step2, step3, step4, step5 } = useSurveyStore();

  const submit = async () => {
    if (!step1.video) {
      throw new Error("youtube 영상을 먼저 선택해주세요.");
    }

    const payload: SurveyPayload = {
      step1: {
        video: {
          videoId: step1.video.videoId,
          title: step1.video.title,
          thumbnail: step1.video.thumbnail,
          channelTitle: step1.video.channelTitle,
        },
        startDate: step1.startDate,
        endDate: step1.endDate,
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
