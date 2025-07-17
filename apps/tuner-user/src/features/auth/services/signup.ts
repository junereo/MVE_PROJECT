import axios from "@/lib/network/axios";
import { SignupFormData } from "../types";
import { errorHandler } from "@/lib/network/errorHandler";

// 회원가입
export const signup = async (data: SignupFormData) => {
  return await axios.post("/auth/signup", data).catch(errorHandler);
};
