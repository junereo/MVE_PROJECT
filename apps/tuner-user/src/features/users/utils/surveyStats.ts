import { SurveyResponse } from "@/features/survey/types/surveyResponse";
import { Stat } from "../types/survey";

export function surveyStats(surveys: SurveyResponse[]): Stat[] {
  const draft = surveys.filter((s) => s.status === "draft");
  const complete = surveys.filter((s) => s.status === "complete");

  const total = draft.length + complete.length;

  const upcoming = complete.filter((s) => s.is_active === "upcoming").length;
  const ongoing = complete.filter((s) => s.is_active === "ongoing").length;
  const closed = complete.filter((s) => s.is_active === "closed").length;

  return [
    { label: "전체", count: total },
    {
      label: "임시저장",
      count: draft.length,
    },
    { label: "예정", count: upcoming },
    { label: "진행 중", count: ongoing },
    { label: "종료", count: closed },
  ];
}
