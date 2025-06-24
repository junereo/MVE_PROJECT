import { Wallet, ArrowDown } from "lucide-react";
import Link from "next/link";

export default function WalletInfo() {
  return (
    <div className="bg-white p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-semibold text-gray-700">지갑 정보</h3>
      </div>
      <p className="text-sm text-gray-600">
        주소: <span className="font-mono text-gray-800">0x123...abcd</span>
      </p>
      <p className="text-sm text-gray-600">
        잔액: <span className="text-gray-800 font-medium">3.21 ETH</span>
      </p>
      <div className="flex justify-end">
        <button className="px-4 py-1 text-sm flex items-center gap-1 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition">
          <ArrowDown className="w-4 h-4" />
          <Link href="/mypage/reward">출금하기</Link>
        </button>
      </div>
    </div>
  );
}
