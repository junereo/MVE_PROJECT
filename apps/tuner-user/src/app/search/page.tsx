import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export default function Search() {
  return (
    <Suspense fallback={<div>검색 중...</div>}>
      <SearchClient />
    </Suspense>
  );
}
