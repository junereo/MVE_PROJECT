import axios from "@/lib/network/axios";
import { SignupFormData } from "../types";
import { LoginFormData } from "../types";

// 회원가입
export const signup = async (data: SignupFormData) => {
  const response = await axios.post("/auth/signup", data);
  return response.data;
};

// 로그인
export const login = async (data: LoginFormData) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};

/*
  테스트용

  // 로그인
  export const mockLogin = async (data: { email: string; password: string }) => {
    console.log("mockLogin called with data: ", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { status: 201, data: { message: "로그인 성공" } };
  };

  
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
