"use client";

export default function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <li>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base text-gray-800 break-all">{value}</div>
    </li>
  );
}
