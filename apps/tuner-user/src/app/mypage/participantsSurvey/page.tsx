// app/mypage/participantsSurvey/page.tsx
"use client";

import { useEffect, useState } from "react";
import ParticipantsSurvey from "./ParticipantsSurvey";
import { getMySurveyAnswer } from "@/features/users/services/survey";

export default function ParticipantsSurveyPage() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySurveyAnswer()
      .then((res) => {
        setAnswers(res.data);
      })
      .catch((err) => {
        console.error("에러:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  return <ParticipantsSurvey answers={answers} />;
}
