"use client";

import { useSearchSurveyStore } from "@/features/survey/store/useSearchSurveyStore";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SearchBreadcrumb = () => {
  const { keyword } = useSearchSurveyStore();

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
