export type AnswerItem = {
  id: number;
  type: "multiple" | "checkbox" | "subjective";
  answer: string | string[] | number;
};

export interface updateResponsePayload {
  surveyId: number;
  answers: AnswerItem[];
  status?: "draft" | "complete";
}
