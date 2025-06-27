"use client";
import { useSurveyStore } from "@/store/useSurveyCreateStore";
import templates from "@/app/template/components/Templates";
import { surveyCreate } from "@/lib/network/api";
export default function SurveyComplete() {
  const { step1, step2 } = useSurveyStore();

  //  템플릿 키로 해당 세트에서 문항 불러오기
  const templateData = templates[step1.templateSetKey] || {};
  // 해시태그 키 추출
  const tagKeys = Object.keys(step2.tags);

  //  템플릿 문항들을 categoryQuestions 형태로 구성
  const templateQuestions = Object.entries(templateData).flatMap(
    ([categoryKey, questions]) =>
      Array.isArray(questions)
        ? questions.map((q) => ({
            category: categoryKey,
            text: q.question,
            type: "multiple",
            options: q.options,
          }))
        : []
  );
  console.log(templateQuestions);

  // 기본 템플릿 문항 + 커스텀 문항 포함
  const combinedQuestions = [
    ...step2.customQuestions.map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.question_type === "subjective" ? [] : q.options,
    })),
  ];
  console.log(combinedQuestions);

  // 최종 제출 데이터
  const dataToSubmit = {
    // 음원 정보
    survey_title: step1.survey_title, //설문 제목
    title: step1.title,
    artist: step1.artist, //곡제목
    release_date: step1.releaseDate,
    is_released: step1.isReleased,
    thumbnail_url: step1.youtubeThumbnail,
    sample_url: step1.url,
    channelTitle: step1.channelTitle,
    genre: step1.genre,
    // 설문 정보
    start_at: step1.start_at,
    end_at: step1.end_at,
    type: step1.surveyType,
    reward_amount: step1.reward_amount ?? 0,
    reward: step1.reward ?? 0,
    expert_reward: step1.expertReward ?? 0,
    templateSetKey: step1.templateSetKey, // 템플릿 내용
    evaluationScores: step2.answers,
    tags: step2.tags,
    //템플릿 정보
    template_id: step2.template_id,
    // 문자열로 변환하지 않은 상태 (출력용 및 화면용)
    allQuestions: combinedQuestions,
  };

  const handleSubmit = async () => {
    // 서버 전송을 위한 JSON 변환 (allQuestions만 문자열로)
    const serverPayload = {
      ...dataToSubmit,
      allQuestions: JSON.stringify(combinedQuestions),
    };

    try {
      const res = await surveyCreate(serverPayload);
      console.log(res);
    } catch (error) {
      console.log("서버 전송 중 오류 발생:", error);
    }
    console.log("서버 전송용 JSON:", serverPayload);
    alert("데이터가 콘솔에 출력되었습니다. (API 연동 예정)");
  };
  // max-w-4xl
  return (
    <div>
      <div className="w-full font-bold text-black text-2xl py-3 ">
        Survey create Complete
      </div>
      <div className="p-6 ">
        <div className="p-6 w-[50%]  rounded-xl bg-white max-w-4xl sm:p-6 md:p-8 shadow  space-y-8">
          <h1 className="text-2xl font-bold mb-4">✅ 설문지 생성 완료</h1>

          {/* 유튜브 정보 */}
          <div className="mb-6">
            <p className="font-semibold ">🎵 {step1.survey_title}</p>
            <img
              src={step1.youtubeThumbnail}
              alt="썸네일"
              className="w-60 mt-2 rounded"
            />
            <p className="text-sm text-gray-600">
              채널명: {step1.channelTitle}
            </p>
          </div>

          {/*평가 점수 */}
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
              {tagKeys.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  #{step2.tags[tag]}
                </span>
              ))}
            </div>
          </div>

          {/* 문항 전체 출력 */}
          <div className="mb-6">
            <p className="font-semibold">📋 전체 문항 미리보기</p>
            {combinedQuestions.map((q, i) => (
              <div key={i} className="border p-3 rounded mt-3">
                <p className="font-medium mb-2">
                  [{q.question_type}] {q.question_text}
                </p>
                {q.question_type !== "subjective" && (
                  <ul className="list-disc pl-5 text-sm">
                    {q.options.map((opt: string, j: number) => (
                      <li key={j}>{opt}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* JSON 출력 */}
          <div className="bg-gray-100 p-4 rounded mb-6 text-sm max-h-[300px] overflow-auto">
            <p className="font-semibold mb-2">📦 제출 데이터(JSON)</p>
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(
                {
                  ...dataToSubmit,
                },
                null,
                2
              )}
            </pre>
          </div>

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
