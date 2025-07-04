import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav className="flex flex-wrap items-center text-sm text-gray-400 pb-6 gap-x-1 gap-y-1 bg-white max-w-full break-words">
      <Link href="/" className="hover:text-gray-600 transition">
        <Home className="w-4 h-4" />
      </Link>
      {crumbs.map((crumb, idx) => (
        <div key={idx} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-gray-300" />
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-gray-600 transition">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
