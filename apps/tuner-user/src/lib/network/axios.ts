// Axios 인스턴스 설정
// 참고 => https://axios-http.com/kr/docs/instance

import axios from "axios";

console.log(process.env.NEXT_PUBLIC_API_URL);

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 백엔드에서 쿠키 기반 인증 사용 시 필요
});


instance.get("/")
export default instance;
