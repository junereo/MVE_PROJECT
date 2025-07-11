import { create } from "zustand";

interface SurveyAnswer {
  id: number;
  status: "complete" | "draft";
  survey: {
    id: number;
    survey_title: string;
    music_title: string;
    artist: string;
    thumbnail_uri: string;
    type: string;
    start_at: string;
    end_at: string;
    reward_amount: number;
    expert_reward: number;
    reward: number;
    creator: { id: number; nickname: string };
  };
  answers: Record<string, any>;
  survey_id: number;
  user_id: number;
}

interface SurveyAnswerState {
  answers: SurveyAnswer[];
  setAnswers: (data: SurveyAnswer[]) => void;
  clearAnswers: () => void;
}

export const useSurveyAnswerStore = create<SurveyAnswerState>((set) => ({
  answers: [],
  setAnswers: (data) => set({ answers: data }),
  clearAnswers: () => set({ answers: [] }),
}));
