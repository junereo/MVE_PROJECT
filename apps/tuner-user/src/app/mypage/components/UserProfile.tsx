import { UserIcon } from "lucide-react";
import { useUser } from "@/features/auth/hooks/useUser";

export default function UserProfile() {
  const { data } = useUser();

  if (!data) return <p>로딩 중...</p>;
  const user = data.data.user;

  return (
    <div className="bg-white p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <UserIcon className="text-gray-400 w-8 h-8" />
      </div>
      <div className="flex-1">
        <p className="text-m text-gray-500">{user.nickname} 님</p>
        <p className="text-sm text-gray-500">일반 회원</p>
      </div>
      <div className="flex flex-col gap-2">
        <button className="px-4 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition">
          프로필 관리
        </button>
      </div>
    </div>
  );
}
