// Axios 인스턴스 설정
// 참고 => https://axios-http.com/kr/docs/instance

import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default instance;
