import { Stat } from "../types/survey";

export function surveyStats(surveys: any[]): Stat[] {
  const total = surveys.length;
  const upcoming = surveys.filter((s) => s.is_active === "upcoming").length;
  const ongoing = surveys.filter((s) => s.is_active === "ongoing").length;
  const closed = surveys.filter((s) => s.is_active === "closed").length;

  return [
    { label: "전체", count: total },
    { label: "예정", count: upcoming },
    { label: "진행 중", count: ongoing },
    { label: "종료", count: closed },
  ];
}
