import WithdrawalCard from "./WithdrawalCard";
import { WithdrawalRequest } from "@/features/withdrawal/types/withdrawal";

type Props = {
  data: WithdrawalRequest[];
  page: number;
  perPage?: number;
};

export default function WithdrawalList({ data, page, perPage = 5 }: Props) {
  if (!data?.length)
    return <p className="text-sm text-gray-500">출금 요청 내역이 없습니다.</p>;

  const sorted = [...data].sort(
    (a, b) =>
      new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
  );

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const current = sorted.slice(start, end);

  return (
    <ul className="space-y-3">
      {current.map((item) => (
        <WithdrawalCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
