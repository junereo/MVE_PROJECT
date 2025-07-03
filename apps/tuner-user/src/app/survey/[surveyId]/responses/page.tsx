"use client";

import SurveyResponsesClient from "./components/SurveyResponsesClient";

interface Props {
  params: { surveyId: string };
}

export default function SurveyCreatePage({ params }: Props) {
  const surveyId = Number(params.surveyId);

  return <SurveyResponsesClient surveyId={surveyId} />;
}
