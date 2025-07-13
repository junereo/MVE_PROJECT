import axios from "@/lib/network/axios";

// 설문 참여 내역
export const getMySurveyAnswer = async () => {
  const response = await axios.get("/survey/s");
  return response.data;
};

// 생성 설문 수정
export const updateSurvey = async (surveyId: number, updatedData: any) => {
  const response = await axios.patch(`/survey/${surveyId}`, updatedData);
  return response.data;
};

// 설문 응답 수정
