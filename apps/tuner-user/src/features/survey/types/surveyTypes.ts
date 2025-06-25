export type SurveyPayload = {
  step1: {
    video: {
      videoId: string;
      title: string;
      thumbnail: string;
      channelTitle: string;
    };
    startDate: string;
    endDate: string;
  };
  step2: {
    title: string;
    isReleased: boolean;
    releaseDate: string;
    genre: string;
  };
  step3: {
    surveyType: "common" | "official";
    reward_amount: number;
    reward: number;
    expertReward: number;
  };
  step4: {
    answers: Record<string, number>;
    tags: Record<string, string>;
    selectedTags: string[];
  };
  step5: {
    customQuestions: {
      id: number;
      text: string;
      type: "multiple" | "checkbox" | "subjective";
      options: string[];
    }[];
  };
};
