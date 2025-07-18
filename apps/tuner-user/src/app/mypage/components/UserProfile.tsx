import { UserIcon } from "lucide-react";
import { UserProfileProps } from "@/features/users/types/userInfo";
import Link from "next/link";

const roleMap = {
  ordinary: "일반 회원",
  expert: "EXPERT 회원",
} as const;

export default function UserProfile({ nickname, role }: UserProfileProps) {
  return (
    <div className="bg-white p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <UserIcon className="text-gray-400 w-8 h-8" />
      </div>
      <div className="flex-1">
        <p className="text-m text-gray-500">{nickname} 님</p>
        <p className="text-sm text-gray-500">{roleMap[role]}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/mypage/profile">
          <button className="px-4 py-1 text-sm flex items-center gap-1 border border-[#57CC7E] text-[#57CC7E] font-semibold rounded-md hover:bg-[#E8FDF0] transition">
            프로필 관리
          </button>
        </Link>
      </div>
    </div>
  );
}
