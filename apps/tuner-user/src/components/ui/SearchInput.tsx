"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    console.log("검색 이동:", `/search?keyword=${trimmedValue}`);
    router.push(`/search?keyword=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-[260px] sm:max-w-[320px]"
    >
      <input
        type="text"
        placeholder="검색어 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-5 pr-4 py-2 text-sm bg-gray-50 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57CC7E]"
      />
      <Search
        onClick={() => handleSubmit()}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-[#57CC7E]"
        strokeWidth={2}
      />
    </form>
  );
};

export default SearchInput;
