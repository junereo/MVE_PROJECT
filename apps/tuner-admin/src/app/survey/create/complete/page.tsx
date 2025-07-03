"use client";

import { useSurveyStore } from "@/store/useSurveyCreateStore";
import { surveyCreate } from "@/lib/network/api";
import {
  QuestionTypeEnum,
  SurveyTypeEnum,
} from "@/app/survey/create/complete/type";
import { Question_type, SurveyStatus } from "@/types";

const mapToQuestionTypeEnum = (type: string): QuestionTypeEnum => {
  switch (type?.toLowerCase()) {
    case "multiple":
      return QuestionTypeEnum.MULTIPLE;
    case "checkbox":
      return QuestionTypeEnum.CHECKBOX;
    case "subjective":
      return QuestionTypeEnum.SUBJECTIVE;
    default:
      return QuestionTypeEnum.MULTIPLE;
  }
};

export default function SurveyComplete() {
  const { step1, step2 } = useSurveyStore();

  // 템플릿 세트 문자열 → 객체로 변환
  const templateSetKeyString = step1.templateSetKey;
  let parsedTemplateSet = {};
  try {
    parsedTemplateSet = JSON.parse(templateSetKeyString);
  } catch (e) {
    console.error("templateSetKey 파싱 오류:", e);
  }

  // 템플릿 질문 변환
  const templateQuestions = Object.entries(parsedTemplateSet).flatMap(
    ([categoryKey, questionArray]) =>
      Array.isArray(questionArray)
        ? questionArray.map((q) => {
            return {
              category: categoryKey,
              question_text: q.question_text || categoryKey,
              question_type: mapToQuestionTypeEnum(q.question_type || q.type),
              options: Array.isArray(q.options)
                ? q.options
                : typeof q.options === "string"
                ? JSON.parse(q.options)
                : [],
            };
          })
        : []
  );

  // 커스텀 질문 변환
  const customQuestions = step2.customQuestions.map((q) => ({
    question_text: q.question_text,
    question_type: mapToQuestionTypeEnum(q.question_type),
    options:
      mapToQuestionTypeEnum(q.question_type) === QuestionTypeEnum.SUBJECTIVE
        ? []
        : q.options,
  }));

  // 템플릿 + 커스텀 문항 통합
  const allQuestionsRaw = [...templateQuestions, ...customQuestions];

  // 최종 전송 payload
  const serverPayload = {
    survey_title: step1.survey_title, // 설문 제목
    title: step1.title,
    music_uri: step1.url, // 유튜브 URL
    thumbnail_uri: step1.youtubeThumbnail,
    artist: step1.artist,
    release_date: step1.releaseDate, // 발매일 (YYYY-MM-DD 형식)
    thumbnail_url: step1.youtubeThumbnail,
    music_title: step1.title, //음악 제목
    genre: step1.genre,
    start_at: step1.start_at,
    end_at: step1.end_at,
    type: step1.surveyType as SurveyTypeEnum,
    reward_amount: step1.reward_amount ?? 0,
    reward: step1.reward ?? 0,
    expert_reward: step1.expertReward ?? 0,
    // templateSetKey: templateSetKeyString, //템플릿 문항
    questions: step2.template_id!,
    question_type: "fixed" as Question_type, // 기본값 설정
    status: SurveyStatus.complete, // 설문 상태 (임시저장 | 생성 완료)
    is_released: step1.isReleased, //발매여부
    // evaluationScores: step2.answers, // 평가 점수
    // tags: step2.tags, // 해시태그

    // 커스텀 질문
    // allQuestions: JSON.stringify(
    //   allQuestionsRaw.map((q) => ({
    //     ...q,
    //     question_type: mapToQuestionTypeEnum(q.question_type),
    //   }))
    // ),
  };
  //서버로 전송할 데이터 구조
  const handleSubmit = async () => {
    try {
      console.log(" 전송 데이터:", serverPayload);
      const res = await surveyCreate(serverPayload);
      console.log("서버 응답:", res);
    } catch (error) {
      console.error("서버 전송 중 오류 발생:", error);
    }
    alert("서버로 보낼 JSON을 콘솔과 화면에 출력했습니다.");
  };

  return (
    <div>
      <div className="w-full font-bold text-black text-2xl py-3">
        Survey create Complete
      </div>
      <div className="p-6">
        <div className="p-6 w-[50%] rounded-xl bg-white max-w-4xl sm:p-6 md:p-8 shadow space-y-8">
          <h1 className="text-2xl font-bold mb-4"> 설문지 생성 완료</h1>

          {/* 유튜브 정보 */}
          <div className="mb-6">
            <p className="font-semibold">🎵 {step1.survey_title}</p>
            <img
              src={step1.youtubeThumbnail}
              alt="썸네일"
              className="w-60 mt-2 rounded"
            />
            <p className="text-sm text-gray-600">
              채널명: {step1.channelTitle}
            </p>
          </div>

          {/* 평가 점수 */}
          <div className="mb-6">
            <p className="font-semibold">📊 기본 평가 점수</p>
            <ul className="list-disc pl-6">
              {Object.entries(step2.answers).map(([key, value]) => (
                <li key={key}>
                  {key} → {value}점
                </li>
              ))}
            </ul>
          </div>

          {/* 해시태그 */}
          <div className="mb-6">
            <p className="font-semibold">🏷️ 태그</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(step2.tags).map(([key, value]) => (
                <span
                  key={key}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  #{value}
                </span>
              ))}
            </div>
          </div>

          {/* 전체 문항 미리보기 */}
          <div className="mb-6">
            <p className="font-semibold">📋 전체 문항 미리보기</p>
            {allQuestionsRaw.map((q, i) => (
              <div key={i} className="border p-3 rounded mt-3">
                <p className="font-medium mb-2">
                  [{mapToQuestionTypeEnum(q.question_type)}]{" "}
                  {q.question_text || ""}
                </p>
                {mapToQuestionTypeEnum(q.question_type) !==
                  QuestionTypeEnum.SUBJECTIVE && (
                  <ul className="list-disc pl-5 text-sm">
                    {q.options.map((opt: string, j: number) => (
                      <li key={j}>{opt}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* 실제 전송 JSON */}
          <div className="bg-gray-100 p-4 rounded mb-6 text-sm max-h-[400px] overflow-auto">
            <p className="font-semibold mb-2">📦 제출 데이터 (serverPayload)</p>
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(serverPayload, null, 2)}
            </pre>
          </div>

          {/* 제출 버튼 */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded text-lg"
            >
              서버에 제출하기 (Console 출력)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
