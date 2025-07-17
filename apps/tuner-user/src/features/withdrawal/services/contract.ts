import axios from "@/lib/network/axios";
import axiosClient from "@/lib/network/axios";

// TUNER 잔액
export const getAddressToken = async (userId: number) => {
  const res = await axios.get(`/contract/wallet/token/${userId}`);
  return res.data;
};

export const requestTxPoolWithdrawal = async ({
  uid,
  message,
}: {
  uid: number;
  message: string;
}) => {
  return (await axiosClient.post("/contract/tx/sign", { uid, message })).data;
};
