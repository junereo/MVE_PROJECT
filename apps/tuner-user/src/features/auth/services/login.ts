import axios from "@/lib/network/axios";
import { AxiosError } from "axios";
import { LoginFormData } from "../types";

// 로그인
export const loginRequest = async (data: LoginFormData) => {
  try {
    const response = await axios.post("/auth/login", data);
    return response;
  } catch (error) {
    const err = error as AxiosError;
    const status = err.response?.status as number;

    if (status === 401) {
      throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    throw new Error("로그인 중 오류가 발생했습니다.");
  }
};

// 구글 로그인
export const googleLogin = async (provider: "google", code: string) => {
  const response = await axios.post(`/api/auth/${provider}`, { code });
  return response; // { token, user }
};

// 카카오 로그인
export const socialLogin = async (provider: "kakao", code: string) => {
  const response = await axios.post(`/auth/${provider}/login`, { code });
  return response; // { token, user }
};

// 로그아웃
export const logoutRequest = async () => {
  const responsse = await axios.post("/auth/logout"); // 쿠키 제거 요청
  return responsse;
};

// 사용자 로그인 확인용
export const getMe = async () => {
  const response = await axios.post("/auth/me"); // 쿠키 기반
  return response; // {id, nickname}
};

/*
  테스트용

  // 로그인
  export const mockLogin = async (data: { email: string; password: string }) => {
    console.log("mockLogin called with data: ", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { status: 201, data: { message: "로그인 성공" } };
  };
*/
