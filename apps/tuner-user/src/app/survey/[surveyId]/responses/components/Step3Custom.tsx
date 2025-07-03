"use client";

import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { postSurveyAnswer } from "@/features/survey/services/survey";
import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import { useSurveyInfo } from "@/features/users/store/useSurveyInfo";
import { useDefaultQuestionStore } from "@/features/survey/store/useDefaultQuestionStore";
import { formatDefaultAnswers } from "@/features/survey/utils/fotmatAnswers";

interface Step3Props {
  onPrev: () => void;
  onNext: () => void;
  surveyId: number;
}

export default function Step3Custom({ surveyId, onPrev, onNext }: Step3Props) {
  const survey_title = "설문 제목";
  const { setSubmitStatus } = useAnswerStore();

  if (!surveyId) {
    return <div className="p-4 text-center">Loading survey...</div>;
  }

  const handleSubmit = async () => {
    const { answers } = useAnswerStore.getState();
    const { gender, age, genres, isMusicRelated } = useSurveyInfo.getState();
    const { questions } = useDefaultQuestionStore.getState();
    console.log("🧪 현재 answers 상태", useAnswerStore.getState().answers);
    console.log(
      "🧪 현재 questions 상태",
      useDefaultQuestionStore.getState().questions
    );
    const formattedAnswers = formatDefaultAnswers(answers, questions);

    const payload = {
      user_id: "1", // 실제 사용자 ID로 대체
      survey_id: surveyId,
      user_info: {
        gender,
        age,
        genres,
        isMusicRelated,
      },
      answers: formattedAnswers,
    };
    console.log("📦 payload to submit", JSON.stringify(payload, null, 2));
    try {
      await postSurveyAnswer(payload);
      setSubmitStatus("success");
      onNext();
    } catch (err) {
      console.error("설문 생성 에러", err);
      setSubmitStatus("error");
      onNext();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: `${survey_title}`, href: `/survey/${surveyId}` },
            { label: "커스텀 설문" },
          ]}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="w-[180px] sm:w-[400px]">
          <Button onClick={handleSubmit} color="blue">
            제출
          </Button>
        </div>
      </div>
    </>
  );
}
