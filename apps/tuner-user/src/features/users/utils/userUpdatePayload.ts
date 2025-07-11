import type {
  UserSurveyInfo,
  UserUpdatePayload,
} from "@/features/users/types/userInfo";
import { GenreKey } from "../constants/userInfoMap";

const ageGroupMap: Record<UserSurveyInfo["age"], UserUpdatePayload["age"]> = {
  "10대": "teen",
  "20대": "twenties",
  "30대": "thirties",
  "40대": "forties",
  "50대": "fifties",
  "60대 이상": "sixties",
  "": "twenties",
};

export const userUpdatePayload = (info: UserSurveyInfo): UserUpdatePayload => ({
  gender: info.gender === "여성",
  age: ageGroupMap[info.age],
  genre: info.genre as GenreKey,
  job_domain: info.jobDomain!,
});
