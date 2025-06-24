// ✅ SurveyStep1.tsx - 모바일 반응형 + 주석 추가
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSurveyStore } from "@/store/surveyStore";
import Dropdown from "../../../components/ui/DropDown";
import Link from "next/link";
import HashTag from "./components/hash";
// import Image from "next/image";
const SurveyStep1 = () => {
  // 장르 목록
  const genreOptions = [
    "발라드",
    "힙합",
    "R&B",
    "록",
    "인디",
    "팝",
    "트로트",
    "재즈",
    "클래식",
    "EDM",
    "포크",
    "OST",
  ];

  const { step1, setStep1 } = useSurveyStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 쿼리스트링에서 유튜브 관련 데이터 가져오기
  const videoId = searchParams.get("videoId");
  const title = searchParams.get("title");
  const thumbnail = searchParams.get("thumbnail");
  const channelTitle = searchParams.get("channelTitle");

  // 처음 로딩 시 step1에 유튜브 정보 저장
  useEffect(() => {
    if (videoId && title && thumbnail) {
      setStep1({
        youtubeVideoId: videoId,
        youtubeTitle: title,
        youtubeThumbnail: thumbnail,
        channelTitle: channelTitle ?? undefined,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  }, [videoId, title, thumbnail, channelTitle, setStep1]);

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof typeof step1,
    value: string | boolean | number
  ) => {
    setStep1({ [field]: value });
  };

  return (
    <div className="w-full max-w-[485px] md:max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 shadow rounded">
      {/* 유튜브 영상 등록 버튼 */}
      <button
        onClick={() => router.push("/surveyTest/search")}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        유튜브 영상 등록
      </button>

      {/* 유튜브 정보 표시 */}
      {step1.youtubeTitle && (
        <div className="mt-4">
          <div className="font-bold text-lg sm:text-xl pb-2">곡 제목</div>
          <p>🎵{step1.youtubeTitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between mt-2">
            <img
              alt="유튜브 썸네일"
              src={step1.youtubeThumbnail}
              className="w-full sm:w-48 rounded"
            />
            <Link
              href={step1.url}
              className="bg-red-500 text-white p-2 rounded mt-2 text-center"
            >
              유튜브에서 보기
            </Link>
          </div>

          {/* 아티스트명 입력 */}
          <div className="font-bold text-lg sm:text-xl mt-4">
            아티스트 명(체널명)
          </div>
          <input
            placeholder={step1.channelTitle}
            value={step1.artist || ""}
            onChange={(e) => handleInputChange("artist", e.target.value)}
            className="border p-2 mt-2 w-full"
          />
        </div>
      )}

      {/* 발매 여부 및 날짜 */}
      <div className="flex flex-wrap gap-4 mt-6">
        <label>
          <input
            type="radio"
            checked={step1.isReleased}
            onChange={() => handleInputChange("isReleased", true)}
          />{" "}
          발매
        </label>
        <label>
          <input
            type="radio"
            checked={!step1.isReleased}
            onChange={() => handleInputChange("isReleased", false)}
          />{" "}
          미발매
        </label>
        <input
          type="date"
          value={step1.releaseDate}
          onChange={(e) => handleInputChange("releaseDate", e.target.value)}
          className="border p-2"
        />
      </div>

      {/* 장르 선택 드롭다운 */}
      <div className="font-bold text-lg sm:text-xl pb-2 mt-6">장르 선택</div>
      <Dropdown
        options={genreOptions}
        selected={step1.genre || "장르 선택"}
        onSelect={(selectedOption) => {
          const mapToValue: Record<(typeof genreOptions)[number], string> = {
            발라드: "ballad",
            힙합: "hiphop",
            "R&B": "rnb",
            록: "rock",
            인디: "indie",
            팝: "pop",
            트로트: "trot",
            재즈: "jazz",
            클래식: "classical",
            EDM: "edm",
            포크: "folk",
            OST: "ost",
          };
          handleInputChange("genre", mapToValue[selectedOption]);
        }}
      />

      {/* 설문 기간 입력 */}
      <div className="font-bold text-lg sm:text-xl pb-2 mt-6">설문 기간</div>
      <div className="flex flex-col sm:flex-row gap-4">
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

      {/* 해시태그 입력 */}
      <HashTag />

      {/* 설문 유형 선택 */}
      <div className="flex gap-2 mt-4">
        <label className="cursor-pointer">
          <input
            type="radio"
            name="surveyType"
            value="general"
            checked={step1.surveyType === "general"}
            onChange={() => handleInputChange("surveyType", "general")}
            className="peer hidden"
          />
          <div className="px-4 py-2 rounded border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white transition">
            General
          </div>
        </label>

        <label className="cursor-pointer">
          <input
            type="radio"
            name="surveyType"
            value="reward"
            checked={step1.surveyType === "reward"}
            onChange={() => handleInputChange("surveyType", "reward")}
            className="peer hidden"
          />
          <div className="px-4 py-2 rounded border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white transition">
            Reward
          </div>
        </label>
      </div>

      {/*  리워드 입력 (선택 시) */}
      {step1.surveyType === "reward" && (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="number"
            placeholder="리워드 총량"
            value={step1.reward_amount || ""}
            onChange={(e) =>
              handleInputChange("reward_amount", parseInt(e.target.value))
            }
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="일반 유저 리워드"
            value={step1.reward || ""}
            onChange={(e) =>
              handleInputChange("reward", parseInt(e.target.value))
            }
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Expert 유저 리워드"
            value={step1.expertReward || ""}
            onChange={(e) =>
              handleInputChange("expertReward", parseInt(e.target.value))
            }
            className="border p-2 w-full"
          />
        </div>
      )}

      {/* 다음 단계로 이동 */}
      <button
        onClick={() => router.push("/surveyTest/create/step2")}
        className="mt-6 bg-black text-white px-6 py-2 rounded w-full"
      >
        NEXT
      </button>
    </div>
  );
};

export default SurveyStep1;
