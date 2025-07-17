import { WithdrawalRequest } from "@/features/withdrawal/types/withdrawal";

export const getTunerBalance = (withdrawals: WithdrawalRequest[]): number => {
  return withdrawals
    .filter((w) => w.status === "completed")
    .reduce((acc, cur) => acc + cur.amount, 0);
};
