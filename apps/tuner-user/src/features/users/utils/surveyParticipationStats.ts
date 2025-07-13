export function surveyParticipationStats(responses: any[]) {
  if (!Array.isArray(responses)) {
    console.warn(
      "surveyParticipationStats: responses가 배열이 아닙니다.",
      responses
    );
    return [
      { label: "전체", count: 0 },
      { label: "임시저장", count: 0 },
      { label: "답변 완료", count: 0 },
    ];
  }

  const total = responses.length;
  const draft = responses.filter((s) => s.status === "draft").length;
  const complete = responses.filter((s) => s.status === "complete").length;

  return [
    { label: "전체", count: total },
    { label: "임시저장", count: draft },
    { label: "답변 완료", count: complete },
  ];
}
