"use client";

import SearchList from "./components/SearchList";
import SearchInput from "@/components/ui/SearchInput";
import SearchBreadcrumb from "./components/SearchBreadcrumb";

export default function Search() {
  return (
    <>
      <SearchBreadcrumb />
      <section className="flex items-end justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">검색 목록</h1>
          <p className="text-sm text-gray-500">설문들을 검색해보세요.</p>
        </div>
        <SearchInput />
      </section>
      <SearchList />
    </>
  );
}
