import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex justify-between items-center bg-white text-black border border-green-700 px-4 py-2 z-50">
      <Link href="/">Home</Link>
      <Link href="/survey">Survey</Link>
      <Link href="/mypage">My Page</Link>
    </div>
  );
}
