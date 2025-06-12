import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div>
        <Link href="/" className="logo">
          LOGO
        </Link>
      </div>
      <div className="header-right">
        <Link href="/search">Search</Link>
        <Link href="/login">Login</Link>
        <div>햄버거</div>
      </div>
    </header>
  );
}
