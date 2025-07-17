import { WithdrawalRequest } from "@/features/withdrawal/types/withdrawal";
import StatusBadge from "./StatusBadge";

type Props = { data: WithdrawalRequest };

export default function LatestRequestCard({ data }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-4 space-y-2">
      <h3 className="text-sm text-gray-700 font-semibold">최근 출금 요청</h3>

      <div className="flex justify-between text-sm text-gray-700">
        <span>요청 금액</span>
        <span>{data.amount} TUNER</span>
      </div>

      <div className="flex justify-between text-sm text-gray-700">
        <span>상태</span>
        <StatusBadge status={data.status} />
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>요청 시간</span>
        <span>{new Date(data.requested_at).toLocaleString()}</span>
      </div>
    </div>
  );
}
