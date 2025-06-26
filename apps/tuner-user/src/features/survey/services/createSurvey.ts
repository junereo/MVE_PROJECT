import axios from "@/lib/network/axios";
import { SurveyPayload } from "../types/surveyPayload";

export const createSurvey = async (payload: SurveyPayload) => {
  const response = await axios.post("/surveys", payload);
  return response;
};
