import axios from "@/lib/network/axios";
import { SurveyPayload } from "../types/surveyPayload";
import { SurveyResponse } from "../types/surveyResponse";
import { SurveySubmitPayload } from "../types/answer";

// 설문 생성
export const createSurvey = async (payload: SurveyPayload) => {
  const response = await axios.post("/survey", payload);
  return response;
};

// 전체 설문 목록
export const getSurveyList = async (): Promise<{
  success: boolean;
  data: SurveyResponse[];
}> => {
  const response = await axios.get("/survey/s/0");
  return response.data;
};

// 단일 설문 목록
export const getSurveyById = async (
  surveyId: number
): Promise<SurveyResponse> => {
  const response = await axios.get(`/survey/s/${surveyId}`);
  const data = response.data.data;

  return {
    ...data,
    participantCount: data.participants?.length ?? 0,
    release_date: data.release_date ?? "미정",
  };
};

// 설문 질문 불러오기 / id=1 고정질문
export const fetchSurveyQuestions = async (questionsId: number) => {
  const response = await axios.get(`/survey/q/${questionsId}`);
  return response.data;
};

// 설믄 응답 제출
export const postSurveyAnswer = async (payload: SurveySubmitPayload) => {
  const res = await axios.post("/survey/p", payload);
  return res.data;
};

// 설문 결과 불러오기
export const getSurveyResult = async (questionsId: number) => {
  const response = await axios.get(`/survey/r/${questionsId}`);
  return response.data;
};
