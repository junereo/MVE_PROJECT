"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSurveyStore } from "@/store/useSurveyCreateStore";
import Dropdown from "../../../components/ui/DropDown";
import Link from "next/link";

const SurveyStep1 = () => {
  const genreOptions = [
    "발라드",
    "힙합",
    "스윙",
    "댄스",
    "재즈",
    "클래식",
    "EDM",
    "국악",
    "스윙",
    "락",
  ];
  const { step1, setStep1 } = useSurveyStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const videoId = searchParams.get("videoId");
  const title = searchParams.get("title");
  const thumbnail = searchParams.get("thumbnail");
  const channelTitle = searchParams.get("channelTitle");

  useEffect(() => {
    if (videoId && title && thumbnail) {
      setStep1({
        youtubeVideoId: videoId,
        youtubeTitle: title,
        youtubeThumbnail: thumbnail,
        channelTitle: channelTitle ?? undefined,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: step1.title || title,
        artist: step1.artist || channelTitle || "",
      });
    }
  }, [videoId, title, thumbnail, channelTitle]);

  // useEffect(() => {
  //   if (videoId && title && thumbnail) {
  //     setStep1({
  //       youtubeVideoId: videoId,
  //       youtubeTitle: title,
  //       youtubeThumbnail: thumbnail,
  //       channelTitle: channelTitle ?? undefined,
  //       url: `https://www.youtube.com/watch?v=${videoId}`,
  //     });
  //   }
  // }, [videoId, title, thumbnail, channelTitle, setStep1]);
  const handleInputChange = (
    field: keyof typeof step1,
    value: string | boolean | number
  ) => {
    setStep1({ [field]: value });
  };
  return (
    <div>
      <div className="w-full font-bold text-black text-2xl py-3 ">
        Survey create Step1
      </div>
      <div className="p-6 ">
        <div className="p-6 w-[50%]  rounded-xl bg-white max-w-4xl sm:p-6 md:p-8 shadow  space-y-8">
          {/* 유튜브 등록 버튼 */}
          <div>
            <button
              onClick={() => router.push("/survey/search")}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              유튜브 영상 등록
            </button>
          </div>

          {/* 썸네일 + 입력 영역 - Flex 기반 */}
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            {/* 제목 + 아티스트 입력 */}
            <div className="flex-1">
              <div className="font-bold text-lg pb-2">설문 제목</div>
              <input
                value={step1.survey_title || ""}
                onChange={(e) =>
                  handleInputChange("survey_title", e.target.value)
                }
                placeholder={"설문 제목 을 입력해주세요"}
                className="border p-2 w-full"
              />
              <div className="font-bold text-lg pb-2">곡 제목</div>
              <input
                value={step1.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border p-2 w-full"
                disabled={!step1.youtubeVideoId}
              />

              <div className="font-bold text-lg pb-2 mt-4">아티스트</div>
              <input
                value={step1.artist || ""}
                onChange={(e) => handleInputChange("artist", e.target.value)}
                className="border p-2 w-full"
                disabled={!step1.youtubeVideoId}
              />
            </div>

            {/* 썸네일 or 플레이스홀더 */}
            <div className="flex-1 flex items-center justify-center">
              {step1.youtubeVideoId ? (
                <div className="flex flex-col items-center">
                  <img
                    alt="유튜브 썸네일"
                    src={step1.youtubeThumbnail}
                    className="w-full max-w-xs rounded"
                  />
                  <Link
                    href={step1.url}
                    className="bg-red-500 text-white text-sm text-center px-3 py-2 rounded mt-3 w-full max-w-xs"
                  >
                    유튜브에서 보기
                  </Link>
                </div>
              ) : (
                <div
                  onClick={() => router.push("/survey/search")}
                  className="w-full max-w-xs h-48 border-2 border-dashed border-gray-400 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h10a4 4 0 004-4m-4-4l-4-4m0 0L7 11m5-4v12"
                    />
                  </svg>
                  <span className="text-gray-500 font-medium">
                    썸네일이 여기에 표시됩니다
                  </span>
                  <span className="text-blue-500 underline mt-1">
                    등록하러 가기
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 발매 여부 + 날짜 */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={step1.isReleased}
                  onChange={() => handleInputChange("isReleased", true)}
                />
                발매
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={!step1.isReleased}
                  onChange={() => handleInputChange("isReleased", false)}
                />
                미발매
              </label>
            </div>
            <input
              type="date"
              value={step1.releaseDate}
              onChange={(e) => handleInputChange("releaseDate", e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          {/* 장르 드롭다운 */}
          <div>
            <div className="font-bold text-lg pb-2">장르 선택</div>
            <Dropdown
              options={genreOptions}
              selected={step1.genre || "장르 선택"}
              onSelect={(selectedOption) => {
                const mapToValue: Record<
                  (typeof genreOptions)[number],
                  string
                > = {
                  발라드: "ballad",
                  팝: "pop",
                  트로트: "trot",
                  국악: "gukak",
                  댄스: "dance",
                  CCM: "CCM",
                  힙합: "hiphop",
                  재즈: "jazz",
                  클래식: "classical",
                  스윙: "rnb",
                  락: "rock",
                  EDM: "edm",
                };
                handleInputChange("genre", mapToValue[selectedOption]);
              }}
            />
          </div>

          {/* 설문 기간 */}
          <div>
            <div className="font-bold text-lg pb-2">설문 기간</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="date"
                value={step1.start_at}
                onChange={(e) => handleInputChange("start_at", e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="date"
                value={step1.end_at}
                onChange={(e) => handleInputChange("end_at", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          </div>

          {/* 설문 유형 + 리워드 입력 */}
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div>
              <div className="font-bold text-lg pb-2">설문 유형</div>
              <div className="flex gap-4">
                {["general", "official"].map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      name="surveyType"
                      value={type}
                      checked={step1.surveyType === type}
                      onChange={() => handleInputChange("surveyType", type)}
                      className="peer hidden"
                    />
                    <div className="px-4 py-2 rounded border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white transition">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {step1.surveyType === "official" && (
              <div className="flex flex-wrap gap-4 flex-1">
                <input
                  type="number"
                  placeholder="리워드 총량"
                  value={step1.reward_amount || ""}
                  onChange={(e) =>
                    handleInputChange("reward_amount", parseInt(e.target.value))
                  }
                  className="border p-2 w-full md:w-[150px]"
                />
                <input
                  type="number"
                  placeholder="일반 유저 리워드"
                  value={step1.reward || ""}
                  onChange={(e) =>
                    handleInputChange("reward", parseInt(e.target.value))
                  }
                  className="border p-2 w-full md:w-[150px]"
                />
                <input
                  type="number"
                  placeholder="Expert 유저 리워드"
                  value={step1.expertReward || ""}
                  onChange={(e) =>
                    handleInputChange("expertReward", parseInt(e.target.value))
                  }
                  className="border p-2 w-full md:w-[150px]"
                />
              </div>
            )}
          </div>

          {/* 다음 버튼 */}
          <div className="pt-4">
            <button
              onClick={() => {
                if (!step1.survey_title?.trim())
                  return alert("설문 제목을 입력해주세요.");
                if (!step1.youtubeVideoId)
                  return alert("유튜브 영상을 등록해주세요.");
                if (!step1.title?.trim())
                  return alert("곡 제목을 입력해주세요.");
                if (!step1.start_at || !step1.end_at)
                  return alert("설문 기간을 입력해주세요.");
                // if (step1.start_at > step1.end_at)
                //   return alert("시작일은 종료일보다 이전이어야 합니다.");
                if (!step1.genre) return alert("장르를 선택해주세요.");
                if (
                  step1.surveyType === "official" &&
                  [step1.reward_amount, step1.reward, step1.expertReward].some(
                    (v) => v === undefined
                  )
                )
                  return alert("리워드 항목을 모두 입력해주세요.");

                router.push("/survey/create/step2");
              }}
              className="mt-6 bg-black text-white px-6 py-2 rounded w-full"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyStep1;
