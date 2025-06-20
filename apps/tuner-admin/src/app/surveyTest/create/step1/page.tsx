"use client";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ 추가
import { useEffect } from "react";
import { useSurveyStore } from "@/store/surceyStore"; // ✅ Zustand 스토어 import
import Dropdown from "../../../components/ui/DropDown";
import Link from "next/link";

const SurveyStep1 = () => {
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

  // ✅ 쿼리에서 유튜브 정보 가져오기
  const videoId = searchParams.get("videoId");
  const title = searchParams.get("title");
  const thumbnail = searchParams.get("thumbnail");
  const channelTitle = searchParams.get("channelTitle");
  // ✅ 페이지 들어오자마자 쿼리값이 있으면 Zustand에 저장
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
  }, [videoId, title, thumbnail, channelTitle]);

  const handleInputChange = (
    field: keyof typeof step1,
    value: string | boolean | number
  ) => {
    setStep1({ [field]: value });
  };
  return (
    <div className="w-[1200px] mx-auto bg-white p-6 shadow rounded">
      {/* ✅ 유튜브 영상 등록 */}
      <button
        onClick={() => {
          router.push("/surveyTest/search"); // ✅ 검색 페이지로 이동
        }}
        className="bg-blue-500 text-white p-2 rounded"
      >
        유튜브 영상 등록
      </button>

      {/* ✅ 영상 정보 표시 */}
      {step1.youtubeTitle && (
        <div className="mt-2">
          <div className="font-bold text-xl pb-2">곡 제목</div>
          <p>🎵{step1.youtubeTitle} </p>
          <div className="flex gap-4 items-end justify-between ">
            {" "}
            <img src={step1.youtubeThumbnail} className="w-48 mt-2 rounded" />
            <Link
              href={step1.url}
              className="bg-red-500 text-white p-2 rounded mt-2 inline-block"
            >
              유튜브에서 보기
            </Link>
          </div>
          {/* 아티스트명, 곡 제목 */}
          <div className="font-bold text-xl">아티스트 명(체널명)</div>
          <div>
            <input
              placeholder="아티스트명"
              value={step1.channelTitle}
              onChange={(e) => handleInputChange("artist", e.target.value)}
              className="border p-2 mt-4 w-full"
            />
          </div>
        </div>
      )}

      {/* 발매 여부 */}
      <div className="flex gap-4 mt-4">
        <label>
          <input
            type="radio"
            checked={step1.isReleased}
            onChange={() => handleInputChange("isReleased", true)}
          />
          발매
        </label>
        <label>
          <input
            type="radio"
            checked={!step1.isReleased}
            onChange={() => handleInputChange("isReleased", false)}
          />
          미발매
        </label>
        <input
          type="date"
          value={step1.releaseDate}
          onChange={(e) => handleInputChange("releaseDate", e.target.value)}
          className="border p-2"
        />
      </div>
      <div className="font-bold text-xl pb-2">장르 선택</div>
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

      {/* 설문 기간 */}
      <div className="font-bold text-xl pb-2">설문 기간</div>
      <div className="flex gap-4">
        <input
          type="date"
          value={step1.startDate}
          onChange={(e) => handleInputChange("startDate", e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          value={step1.endDate}
          onChange={(e) => handleInputChange("endDate", e.target.value)}
          className="border p-2"
        />
      </div>

      {/* 리워드 타입 & 총량 */}
      <div className="flex gap-4 mt-4 items-center">
        <label>
          <input
            type="radio"
            checked={step1.surveyType === "general"}
            onChange={() => handleInputChange("surveyType", "general")}
          />
          General
        </label>
        <label>
          <input
            type="radio"
            checked={step1.surveyType === "reward"}
            onChange={() => handleInputChange("surveyType", "reward")}
          />
          Reward
        </label>
        {step1.surveyType === "reward" && (
          <div className="flex gap-4 mt-4">
            <input
              type="number"
              placeholder="리워드 총량"
              value={step1.totalReward || ""}
              onChange={(e) =>
                handleInputChange("totalReward", parseInt(e.target.value))
              }
              className="border p-2 w-1/3"
            />
            <input
              type="number"
              placeholder="일반 유저 리워드"
              value={step1.normalReward || ""}
              onChange={(e) =>
                handleInputChange("normalReward", parseInt(e.target.value))
              }
              className="border p-2 w-1/3"
            />
            <input
              type="number"
              placeholder="Expert 유저 리워드"
              value={step1.expertReward || ""}
              onChange={(e) =>
                handleInputChange("expertReward", parseInt(e.target.value))
              }
              className="border p-2 w-1/3"
            />
          </div>
        )}
      </div>

      {/* NEXT 버튼 */}
      <button
        onClick={() => {
          // 다음 단계로 이동
        }}
        className="mt-6 bg-black text-white px-6 py-2 rounded"
      >
        NEXT
      </button>
    </div>
  );
};

export default SurveyStep1;
