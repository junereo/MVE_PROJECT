import axios from "@/lib/network/axios";

// 아이디 찾기
export const findUserId = async (phoneNumber: string) => {
  const res = await axios.post("/auth/findid", {
    phone_number: phoneNumber,
  });
  return res;
};

// 비밀번호 재설정 링크 요청
export const requestPassword = async (email: string) => {
  const res = await axios.post("/auth/pwrequest", {
    email,
  });
  return res.data; // { success: true, message: string }
};

// 링크 받은 후 비밀번호 재설정
export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axios.post("/auth/resetpw", {
    token,
    newPassword,
  });
  return res.data; // { success: true, message: string }
};
