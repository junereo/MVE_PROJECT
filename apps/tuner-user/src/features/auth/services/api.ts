import axios from "@/lib/network/axios";
import { SignupFormData } from "../types";

// 회원가입
export const signup = async (data: SignupFormData) => {
  const response = await axios.post("/auth/signup", data);
  return response.data;
};

/*
  테스트용

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
