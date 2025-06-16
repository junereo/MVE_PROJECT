import axios from "@/lib/network/axios";
import { SignupFormData } from "../types";
import { LoginFormData } from "../types";

// 회원가입
export const signup = async (data: SignupFormData) => {
  console.log("fasdf");
  console.dir(axios);

  const response = await axios.post("/auth/signup", data);
  console.log(data);

  return response.data;
};

// 로그인
export const login = async (data: LoginFormData) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};

// 카카오 로그인
export const socialLogin = async (provider: "kakao", code: string) => {
  const response = await axios.post(`/auth/${provider}/login`, { code });
  return response.data; // { token, user }
};

// 사용자 정보 가져옴
export const getMe = async (token: string) => {
  const response = await axios.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`, // JWT 방식
    },
  });
  return response.data.user; // 사용자 정보 / nickname, email 등
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
