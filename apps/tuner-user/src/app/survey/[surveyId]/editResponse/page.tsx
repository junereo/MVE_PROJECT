"use client";

import { useEffect, useState } from "react";
import EditResponseClient from "./components/EditResponseClient";
import { AnswerItem } from "@/features/users/types/updateSurveyResponse";
import { UserUpdatePayload } from "@/features/users/types/userInfo";

interface Props {
  params: { surveyId: string };
}

export default function EditResponse({ params }: Props) {
  const surveyId = Number(params.surveyId);
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [answers, setAnswers] = useState<AnswerItem[] | null>(null);
  const [, setUserInfo] = useState<UserUpdatePayload | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("editResponseData");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.surveyId === surveyId) {
        setAnswers(parsed.answers);
        setSurveyTitle(parsed.surveyTitle);
        setUserInfo(parsed.userInfo);
      } else {
        console.warn("surveyId mismatch, editResponseData 무시됨");
      }
    } else {
      console.warn("editResponseData not found in sessionStorage");
    }
  }, [surveyId]);

  if (!answers) return null;

  return (
    <EditResponseClient
      surveyId={surveyId}
      surveyTitle={surveyTitle}
      submitAnswers={answers}
    />
  );
}
