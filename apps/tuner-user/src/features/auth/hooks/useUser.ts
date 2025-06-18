import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/login";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

//   로그인 상태 유지를 위해 서버로부터 데이터 받아와서 zustand에 저장
export const useUser = () => {
  const { setUser } = useAuthStore(); // Zustand 상태 설정

  const { data, error } = useQuery({
    queryKey: ["user"], // 쿼리 키
    queryFn: getMe, // 서버 호출 함수
    staleTime: 1000 * 60 * 5, // 5분 캐시
    retry: false, // 실패 시 자동 재요청 방지
  });

  useEffect(() => {
    if (data) {
      setUser(data.data.user); // 로그인 정보 Zustand에 저장
    }
  }, [data, setUser]);

  return { data, error };
};
