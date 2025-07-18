import Link from "next/link";
import { withdrawalProps } from "@/features/users/types/userInfo";
import { Wallet, ArrowDown } from "lucide-react";

export default function WalletInfo({ balance, tuner }: withdrawalProps) {
  const point = Math.floor(balance / 1000);
  console.log(tuner);

  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-500" />
      </div>
      <div className="grid grid-flow-col grid-row-2 gap-4 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-600">포인트</p>
          <p className="text-gray-800 font-medium">{point || 0} p</p>
        </div>
        <div className="flex flex-col gap-3 border-l border-l-gray-200">
          <p className="text-sm text-gray-600">TUNER</p>
          <p className="font-medium text-gray-800">{tuner || 0} t</p>
        </div>
      </div>
      <div className="flex justify-end pt-3">
        <button className="px-4 py-1 text-sm flex items-center gap-1 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition">
          <ArrowDown className="w-4 h-4" />
          <Link href="/mypage/withdrawal">출금하기</Link>
        </button>
      </div>
    </div>
  );
}
