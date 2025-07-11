import axios from "@/lib/network/axios";

// 설문 참여 내역
export const getMySurveyAnswer = async () => {
  const response = await axios.get("/survey/s");
  return response;
};
