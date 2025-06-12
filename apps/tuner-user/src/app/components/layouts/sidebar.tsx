import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link href="/">Home</Link>
      <Link href="/survey">Survey</Link>
      <Link href="/mypage">My Page</Link>
    </div>
  );
}
