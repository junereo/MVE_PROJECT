import axios from "@/lib/network/axios";

// TUNER 잔액
export const getAddressToken = async (userId: number) => {
  const res = await axios.get(`/contract/wallet/token/${userId}`);
  return res.data;
};
