"use client";

import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SearchBreadcrumb = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  return (
    <Breadcrumb
      crumbs={[
        {
          label: keyword ? `"${keyword}" 검색 결과` : "검색 목록",
        },
      ]}
    />
  );
};

export default SearchBreadcrumb;
