import { SurveyPayload } from "../types/surveyPayload";
import axios from "@/lib/network/axios";

export const createSurvey = async (payload: SurveyPayload) => {
  const response = await axios.post("/surveys", payload);
  return response;
};
