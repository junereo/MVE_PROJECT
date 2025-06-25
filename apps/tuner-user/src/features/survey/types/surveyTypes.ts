export type SurveyPayload = {
  step1: {
    video: {
      artist: string;
      title: string;
      thumbnail_url: string;
      sample_url: string;
    };
    start_at: string;
    end_at: string;
  };
  step2: {
    title: string;
    is_released: boolean;
    release_date: string;
    genre: string;
  };
  step3: {
    surveyType: "general" | "official";
    reward_amount: number;
    reward: number;
    expert_reward: number;
  };
  step4: {
    tags: Record<string, string>;
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
