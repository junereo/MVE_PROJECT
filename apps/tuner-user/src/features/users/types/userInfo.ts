export interface UserInfo {
  gender: "남성" | "여성";
  age: "" | "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
  genres: string[];
  jobDomain: boolean;
}

// 백엔드 전송용
export interface UserUpdatePayload {
  gender: boolean;
  age: "teen" | "twenties" | "thirties" | "forties" | "fifties" | "sixties";
  genre: string;
  job_domain: boolean;
}
