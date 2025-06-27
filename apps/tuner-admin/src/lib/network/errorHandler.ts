// 전역 에러 처리기

import { AxiosError } from "axios";

export const errorHandler = (error: AxiosError) => {
  const status = error.response?.status;
  const message = error.response?.data || "알 수 없는 오류가 발생했습니다.";

  // 상황별 처리
  switch (status) {
    case 400:
      console.warn("잘못된 요청입니다.");
      break;
    case 401:
      console.warn("인증이 필요합니다.");
      break;
    case 403:
      console.warn("권한이 없습니다.");
      break;
    case 500:
      console.error("서버 에러: ", message);
      break;
    default:
      console.error("에러: ", message);
  }

  return Promise.reject(error); // 에러 넘김, 호출부에서 try-catch 처리 가능
};
