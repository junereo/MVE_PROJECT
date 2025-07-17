// 요청용
export interface WithdrawalRequestPayload {
  user_id: number;
  amount: number;
  txhash: string;
  status: "pending" | "completed" | "failed";
  message?: string;
  signature?: string;
}

// 전체 응답
export interface WithdrawalRequest {
  id: number;
  user_id: number;
  amount: number;
  txhash: string;
  message: string;
  requested_at: string;
  signature: string;
  status: "pending" | "completed" | "failed";
}

export interface Withdrawal {
  id: number;
  user_id: number;
  amount: number;
  txhash: string;
  status: string;
  created_at: string;
}
