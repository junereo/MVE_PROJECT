export interface Survey {
    id: number;
    title: string;
    description: string;
    questions: Question[];
    created_at: Date;
    updated_at: Date;
}

export interface Question {
    id: number;
    survey_id: number;
    question_text: string;
    question_type: string;
    options?: string[];
    required: boolean;
}

export type AnswerItem = {
    id: number;
    type: "multiple" | "checkbox" | "subjective";
    answer: string | string[] | number;
};