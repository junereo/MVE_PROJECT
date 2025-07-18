import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ParticipantsSurvey from "./ParticipantsSurvey";
import { getMySurveyAnswerForSSR } from "@/features/users/services/getMySurveyAnswerForSSR";

export default async function ParticipantsSurveyPage() {
  const accessToken = cookies().get("token")?.value;

  if (!accessToken) {
    redirect("/auth"); // 로그인 안 됐으면 바로 로그인 페이지로
  }

  const res = await getMySurveyAnswerForSSR();
  const answers = res.data;

  return <ParticipantsSurvey answers={answers} />;
}
