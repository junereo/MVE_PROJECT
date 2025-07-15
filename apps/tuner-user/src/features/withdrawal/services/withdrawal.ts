import axios from "@/lib/network/axios";
import { WithdrawalRequest } from "../types/withdrawal";

// 출금 요청
export const requestWithdrawal = async (payload: WithdrawalRequest) => {
  const res = await axios.post("/withdraw", payload);
  return res.data;
};

// 출금 내역
export const getUserWithdrawals = async (userId: number) => {
  const res = await axios.get(`/withdraw/${userId}`);
  return res.data;
};
