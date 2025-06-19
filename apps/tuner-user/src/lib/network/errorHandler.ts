// 전역 에러 처리기

import { isAxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

export const errorHandler = (error: unknown): Promise<never> => {
  if (!isAxiosError(error)) {
    return Promise.reject(
      new Error("네트워크 오류 또는 예기치 못한 에러가 발생했습니다.")
    );
  }

  // const axiosError = error as AxiosError;
  const status = error.response?.status;
  const rawMessage = error.response?.data as ErrorResponse | string | undefined;

  // 에러 메세지 추출
  let message =
    typeof rawMessage === "string"
      ? rawMessage
      : rawMessage?.message || "알 수 없는 에러가 발생했습니다.";

  // 상황별 처리
  if (status) {
    switch (status) {
      case 400:
        message = "입력한 정보를 다시 확인해주세요.";
        break;
      case 401:
        message = "로그인이 필요합니다.";
        break;
      case 403:
        message = "접근 권한이 없습니다.";
        break;
      case 409:
        message = "이미 존재하는 정보입니다.";
        break;
      case 500:
        message = "서버에서 오류가 발생했습니다.";
        break;
    }
  } else {
    console.error("에러 상태 없음: ", error);
  }

  // 에러 객체 생성
  const customError = new Error(message) as Error & {
    status?: number;
    raw?: unknown;
  };

  customError.status = status;
  customError.raw = rawMessage;

  return Promise.reject(customError); // 에러 넘김, 호출부에서 try-catch 처리 가능
};
