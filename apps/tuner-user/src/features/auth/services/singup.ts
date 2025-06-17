import axios from "@/lib/network/axios";
import { SignupFormData } from "../types";

// 회원가입
export const signup = async (data: SignupFormData) => {
  try {
    const response = await axios.post("/auth/signup", data);
    return response;
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 400) {
      throw new Error("입력한 정보를 다시 확인해주세요.");
    }
    throw new Error("회원가입 중 알 수 없는 오류가 발생했습니다.");
  }
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
