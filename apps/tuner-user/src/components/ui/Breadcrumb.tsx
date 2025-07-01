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
    <nav className="flex items-center text-sm text-gray-400 mb-4 space-x-1 bg-white">
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
