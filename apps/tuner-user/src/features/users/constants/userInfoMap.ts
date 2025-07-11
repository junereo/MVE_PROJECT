// 성별
export const genderMap = {
  true: "남성",
  false: "여성",
} as const;
export type GenderKey = keyof typeof genderMap;

// 나이
export const ageMap = {
  teen: "10대",
  twenties: "20대",
  thirties: "30대",
  forties: "40대",
  fifties: "50대",
  sixties: "60대 이상",
} as const;
export type AgeKey = keyof typeof ageMap;

// 회원등급
export const roleMap = {
  ordinary: "일반 회원",
  expert: "전문가 회원",
} as const;
export type RoleKey = keyof typeof roleMap;

// 장르
export const genreMap = {
  pop: "팝",
  rock: "록",
  jazz: "재즈",
  classical: "클래식",
  hiphop: "힙합",
  electronic: "일렉트로닉",
  country: "컨트리",
  reggae: "레게",
  blues: "블루스",
  folk: "포크",
} as const;
export type GenreKey = keyof typeof genreMap;
