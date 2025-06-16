import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 캐시 유지 시간 5분
      retry: 1, // 재시도 1번
      refetchOnWindowFocus: false, // 창 다시 열었을 시 자동 요청 방지
    },
  },
});
