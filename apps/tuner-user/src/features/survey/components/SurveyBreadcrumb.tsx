import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function SurveyBreadcrumb() {
  return (
    <nav className="flex items-center text-sm text-gray-400 mb-2 space-x-1">
      <Link href="/" className="hover:text-gray-600 transition">
        <Home className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-300" />
      <span className="text-gray-500">설문</span>
      <ChevronRight className="w-4 h-4 text-gray-300" />
      <span className="text-gray-900 font-semibold">설문 목록</span>
    </nav>
  );
}
