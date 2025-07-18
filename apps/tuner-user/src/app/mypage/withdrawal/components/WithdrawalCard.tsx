import StatusBadge from "./StatusBadge";
import { WithdrawalRequest } from "@/features/withdrawal/types/withdrawal";

type Props = { item: WithdrawalRequest };

export default function WithdrawalCard({ item }: Props) {
  return (
    <li className="border rounded-md p-4 shadow-sm text-sm space-y-1">
      <div className="flex justify-between">
        <span>금액</span>
        <span>{item.amount} TUNER</span>
      </div>
      <div className="flex justify-between">
        <span>상태</span>
        <StatusBadge status={item.status} />
      </div>
      <div className="flex justify-between text-gray-500 text-xs">
        <span>요청 시간</span>
        <span>{new Date(item.requested_at).toLocaleString()}</span>
      </div>
    </li>
  );
}
