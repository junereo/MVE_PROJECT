import axios from "@/lib/network/axios";
import { updateResponsePayload } from "../types/updateSurveyResponse";

// 설문 참여 내역
export const getMySurveyAnswer = async () => {
  const response = await axios.get("/survey/s");
  return response.data;
};

// 설문 응답 수정
export const updateSurveyResponse = async (params: updateResponsePayload) => {
  const { data } = await axios.patch("/survey/r", params);
  return data;
};
