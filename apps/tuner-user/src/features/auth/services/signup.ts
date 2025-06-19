import axios from "@/lib/network/axios";
import { SignupFormData } from "../types";
import { errorHandler } from "@/lib/network/errorHandler";

// 회원가입
export const signup = async (data: SignupFormData) => {
  return await axios.post("/auth/signup", data).catch(errorHandler);
};

/*
테스트  

  // 회원가입
  export const mockSignup = async (data: {
    email: string;
    password: string;
    nickname: string;
    phoneNumber: string;
  }) => {
    console.log("mockSignup called with data: ", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { status: 201, data: { message: "회원가입 성공" } };
  };
*/
