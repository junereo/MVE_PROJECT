import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WithdrawalRequest } from "../types/withdrawal";

interface WithdrawalStore {
  withdrawals: WithdrawalRequest[];
  setWithdrawals: (data: WithdrawalRequest[]) => void;
  clearWithdrawals: () => void;
}

export const useWithdrawalStore = create<WithdrawalStore>()(
  persist(
    (set) => ({
      withdrawals: [],
      setWithdrawals: (data) => set({ withdrawals: data }),
      clearWithdrawals: () => set({ withdrawals: [] }),
    }),
    {
      name: "withdrawal-storage",
    }
  )
);
