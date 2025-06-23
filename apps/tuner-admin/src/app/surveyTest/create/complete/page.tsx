"use client";
import { useSurveyStore } from "@/store/surceyStore";

export default function SurveyComplete() {
  const { step1, step2 } = useSurveyStore();

  const dataToSubmit = {
    youtubeInfo: {
      title: step1.youtubeTitle,
      url: step1.url,
      thumbnail: step1.youtubeThumbnail,
      channelTitle: step1.channelTitle,
    },
    artist: step1.artist,
    isReleased: step1.isReleased,
    releaseDate: step1.releaseDate,
    genre: step1.genre,
    surveyPeriod: {
      start: step1.startDate,
      end: step1.endDate,
    },
    surveyType: step1.surveyType,
    reward: {
      total: step1.totalReward,
      normal: step1.normalReward,
      expert: step1.expertReward,
    },
    evaluationScores: step2.answers,
    hashtags: step2.hashtags,
    customQuestions: step2.customQuestions,
  };

  const handleSubmit = () => {
    console.log("제출할 데이터:", dataToSubmit);
    alert("데이터가 콘솔에 출력되었습니다. (API 연동 예정)");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✅ 설문지 생성 완료</h1>

      {/* 🎵 유튜브 정보 */}
      <div className="mb-6">
        <p className="font-semibold">🎵 {step1.youtubeTitle}</p>
        <img
          src={step1.youtubeThumbnail}
          alt="썸네일"
          className="w-60 mt-2 rounded"
        />
        <p className="text-sm text-gray-600">채널명: {step1.channelTitle}</p>
      </div>

      {/* 📊 평가 점수 */}
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

      {/* 🏷️ 해시태그 */}
      <div className="mb-6">
        <p className="font-semibold">🏷️ 해시태그</p>
        <div className="flex gap-2 flex-wrap">
          {step2.hashtags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 📋 커스텀 질문 */}
      {step2.customQuestions.length > 0 && (
        <div className="mb-6">
          <p className="font-semibold">📋 커스텀 객관식 설문</p>
          {step2.customQuestions.map((q) => (
            <div key={q.id} className="border p-3 rounded mt-3">
              <p className="font-medium mb-2">
                Q{q.id}. {q.text}
              </p>
              <ul className="list-disc pl-5 text-sm">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 📨 JSON 미리보기 */}
      <div className="bg-gray-100 p-4 rounded mb-6 text-sm max-h-[300px] overflow-auto">
        <p className="font-semibold mb-2">📦 제출 데이터(JSON)</p>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(dataToSubmit, null, 2)}
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
  );
}
