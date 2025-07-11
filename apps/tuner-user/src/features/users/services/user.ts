import axios from "@/lib/network/axios";
import {
  UserProfileUpdatePayload,
  UserUpdatePayload,
  WalletUpdatePayload,
} from "../types/userInfo";

// 내 정보 요청
export const getUserInfo = async (userId: number) => {
  const response = await axios.get(`/user/${userId}`);
  return response; // nickname, email, simple_password, level, wallet_Address, balance
};

// // 내 정보 수정
export type CombinedUserUpdatePayload = Partial<
  UserUpdatePayload & UserProfileUpdatePayload & WalletUpdatePayload
>;

export const updateUserInfo = async (
  userId: number,
  payload: CombinedUserUpdatePayload
) => {
  const response = await axios.put(`/user/${userId}`, payload);
  return response; // nickname, phone_number, simple_passwoard
};

// // 리워드 내역
// export const getUserReward = async () => {
//   // const response = await axios.get("/users/me/rewards");
// };
