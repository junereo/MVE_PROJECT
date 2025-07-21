// Axios 인스턴스 설정
// 참고 => https://axios-http.com/kr/docs/instance
import Cookies from "js-cookie";

import axios from "axios";
import { setupInterceptors } from "./setupInterceptors";

const getTokenFromCookiesSomehow = () => Cookies.get("token");

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true, // 백엔드에서 쿠키 기반 인증 사용 시 필요
  headers: {
    "Content-Type": "application/json",
  },
});

setupInterceptors(instance); // 인터셉터 연결

// 헤더 자동으로 헤더에 Authorization: Bearer 을 붙여서 전송
instance.interceptors.request.use((config) => {
  const token = getTokenFromCookiesSomehow();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
