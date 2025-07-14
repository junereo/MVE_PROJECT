export interface WithdrawalRequest {
  user_id: number;
  amount: number;
  txhash: string;
  status: "pending" | "completed"; // enum 타입처럼 구체화해도 좋음
}

export interface Withdrawal {
  id: number;
  user_id: number;
  amount: number;
  txhash: string;
  status: string;
  created_at: string;
}
