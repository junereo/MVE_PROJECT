type Props = { status: "pending" | "completed" | "failed" };

export default function StatusBadge({ status }: Props) {
  const labelMap = {
    pending: "처리중",
    completed: "완료됨",
    failed: "실패",
  };

  const colorMap = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}
