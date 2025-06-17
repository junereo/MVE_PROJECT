import axios from "@/lib/network/axios";
import { SignupFormData } from "../types";
import { LoginFormData } from "../types";

// 회원가입
export const signup = async (data: SignupFormData) => {
  const response = await axios.post("/auth/signup", data);
  return response;
};

// 로그인
export const loginRequest = async (data: LoginFormData) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};

// 카카오 로그인
export const socialLogin = async (provider: "kakao", code: string) => {
  const response = await axios.post(`/auth/${provider}/login`, { code });
  return response.data; // { token, user }
};

// 로그아웃
export const logoutRequest = async () => {
  await axios.post("/auth/logout"); // 쿠키 제거 요청
};

// 사용자 정보 가져옴
export const getMe = async () => {
  const response = await axios.get("/auth/me"); // 쿠키 기반
  return response.data.user; // {id, nickname}
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
