// store/surveyResponseStore.ts
import { create } from 'zustand';

interface SurveyResponseState {
    // 설문 응답 상태 정의
    scores: Record<string, number>;
    // 카테고리별 점수
    templateAnswers: Record<string, string>;
    // 템플릿 답변
    customAnswers: Record<number, string | string[]>;
    // 커스텀 답변 (객관식/체크박스/서술형)
    selectedTags: string[];

    setScore: (cat: string, score: number) => void;
    setTemplateAnswer: (cat: string, answer: string) => void;
    setCustomAnswer: (id: number, answer: string | string[]) => void;
    setTags: (tags: string[]) => void;
    reset: () => void;
}

export const useSurveyResponseStore = create<SurveyResponseState>((set) => ({
    scores: {},
    templateAnswers: {},
    customAnswers: {},
    selectedTags: [],

    setScore: (cat, score) =>
        set((state) => ({ scores: { ...state.scores, [cat]: score } })),
    setTemplateAnswer: (cat, answer) =>
        set((state) => ({
            templateAnswers: { ...state.templateAnswers, [cat]: answer },
        })),
    setCustomAnswer: (id, answer) =>
        set((state) => ({
            customAnswers: { ...state.customAnswers, [id]: answer },
        })),
    setTags: (tags) => set({ selectedTags: tags }),
    reset: () =>
        set({
            scores: {},
            templateAnswers: {},
            customAnswers: {},
            selectedTags: [],
        }),
}));
