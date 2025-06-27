// src/lib/axiosClient.ts
import axios from "axios";
import Cookies from "js-cookie";
import { setupInterceptors } from "./ingerceptors";

const getTokenFromCookiesSomehow = () => Cookies.get("access_token");

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_API_URL || "http://localhost:4000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// 인터셉터 연결
setupInterceptors(axiosClient);

// 헤더 자동으로 헤더에 Authorization: Bearer 을 붙여서 전송
axiosClient.interceptors.request.use((config) => {
  const token = getTokenFromCookiesSomehow();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
