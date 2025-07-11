import { getSurveyById } from "@/features/survey/services/survey";
import SurveyEditClient from "./components/SurveyEditClient";

interface Props {
  params: { surveyId: string };
}

export default async function SurveyEditPage({ params }: Props) {
  const surveyId = Number(params.surveyId);
  const survey = await getSurveyById(surveyId);

  return <SurveyEditClient initialSurvey={survey} />;
}
