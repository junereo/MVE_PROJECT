import axios from "@/lib/network/axios";
import { SurveyPayload } from "../types/surveyPayload";

// 설문 생성
export const createSurvey = async (payload: SurveyPayload) => {
  const response = await axios.post("/survey/create", payload);
  return response;
};

// 설문 임시저장
export const saveSurvey = async (payload: SurveyPayload) => {
  const response = await axios.post("/survey/temp", payload);
  return response;
};

// 설문 목록
export const surveyList = async () => {
  const response = await axios.get("/survey/list");
  return response;
};
