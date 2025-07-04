"use client";

import SurveyResponsesClient from "./components/SurveyResponsesClient";
import { getSurveyById } from "@/features/survey/services/survey";

interface Props {
  params: { surveyId: string };
}

export default async function SurveyResponsePage({ params }: Props) {
  const surveyId = Number(params.surveyId);
  const survey = await getSurveyById(surveyId);

  return (
    <SurveyResponsesClient
      surveyId={surveyId}
      surveyTitle={survey.survey_title}
    />
  );
}
