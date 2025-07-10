import type {
  UserInfo,
  UserUpdatePayload,
} from "@/features/users/types/userInfo";

const ageGroupMap: Record<UserInfo["age"], UserUpdatePayload["age"]> = {
  "10대": "teen",
  "20대": "twenties",
  "30대": "thirties",
  "40대": "forties",
  "50대": "fifties",
  "60대 이상": "sixties",
  "": "twenties",
};

const genreMap: Record<string, string> = {
  힙합: "hiphop",
  발라드: "ballad",
  댄스: "dance",
  "R&B": "rnb",
  락: "rock",
  트로트: "trot",
  팝: "pop",
  국악: "gukak",
  CCM: "ccm",
  EDM: "edm",
  클래식: "classical",
  재즈: "jazz",
};

export const userUpdatePayload = (info: UserInfo): UserUpdatePayload => ({
  gender: info.gender === "여성",
  age: ageGroupMap[info.age],
  genre: genreMap[info.genres[0]] || "pop",
  job_domain: info.jobDomain,
});
