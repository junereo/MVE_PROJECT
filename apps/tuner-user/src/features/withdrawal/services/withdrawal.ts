import axios from "@/lib/network/axios";

// 출금 내역
export const getUserWithdrawals = async (userId: number) => {
  const res = await axios.get(`/withdraw/${userId}`);
  return res.data;
};
