export function surveyParticipationStats(responses: any[]) {
  const total = responses.length;
  const draft = responses.filter((s) => s.status === "draft").length;
  const complete = responses.filter((s) => s.status === "complete").length;

  return [
    { label: "전체", count: total },
    { label: "임시저장", count: draft },
    { label: "답변 완료", count: complete },
  ];
}
