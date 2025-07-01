"use client";

import Image from "next/image";
import Header from "@/components/layouts/Header";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import Wrapper from "@/components/layouts/Wrapper";
import Button from "@/components/ui/Button";

const dummySurvey = {
  id: 1,
  thumbnail_url: `https://i.ytimg.com/vi/LBHVOiw274A/hqdefault.jpg`,
  survey_title: "빈지노 Fashion Hoarder 설문",
  title: "Fashion Hoarder (Feat. ZENE THE ZILLA)",
  artist: "Beenzino",
  type: "official",
  startAt: "2025-07-01",
  endAt: "2025-07-07",
  totalParticipants: 1234,
  rewardAmount: 100,
  releaseDate: "2025-06-30",
  status: "ongoing" as SurveyStatus,
};

type SurveyStatus = "upcoming" | "ongoing" | "closed";

const statusTextMap: Record<SurveyStatus, string> = {
  upcoming: "예정",
  ongoing: "진행중",
  closed: "종료",
};

export default function SurveyDetail() {
  const {
    thumbnail_url,
    survey_title,
    title,
    artist,
    type,
    startAt,
    endAt,
    totalParticipants,
    rewardAmount,
    releaseDate,
    status,
  } = dummySurvey;

  return (
    <>
      <Header />
      <Wrapper>
        <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-5 shadow-md">
          <Image
            src={thumbnail_url}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/80 text-xs font-medium rounded-full backdrop-blur-sm text-blue-600">
            {type === "official" ? "공식 설문" : "일반 설문"}
          </div>
        </div>

        <div className="mb-4 px-1">
          <h1 className="text-[22px] font-bold text-gray-900 leading-snug">
            {survey_title}
          </h1>
        </div>

        <div className="mb-6 border-t border-gray-100 pt-4 px-1">
          <div className="flex justify-between">
            <p className="text-sm text-gray-400 mb-1">ARTIST</p>
            <p className="text-sm text-gray-500 mt-1">{releaseDate} 발매</p>
          </div>

          <p className="text-lg font-medium text-gray-800">{artist}</p>
          <p className="text-base text-gray-600 mt-1">{title}</p>
        </div>

        <section className="rounded-2xl mb-10 border border-gray-100 bg-gray-50 px-4 py-5 shadow-sm space-y-4">
          <InfoRow label="설문 기간" value={`${startAt} ~ ${endAt}`} />
          <InfoRow
            label="참여자 수"
            value={`${totalParticipants.toLocaleString()}명`}
          />
          <InfoRow
            label="리워드"
            value={`🎁 ${rewardAmount} STK`}
            valueClass="text-orange-500"
          />
          <InfoRow
            label="상태"
            value={statusTextMap[status]}
            valueClass={
              status === "ongoing"
                ? "text-green-600"
                : status === "upcoming"
                ? "text-blue-500"
                : "text-gray-400"
            }
          />
        </section>

        <div className="fixed bottom-[65px] left-0 right-0 z-20 px-4 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto">
          <Button color="blue">설문 참여하기</Button>
        </div>
      </Wrapper>
      <BottomNavbar />
    </>
  );
}

// 🔹 정보 표시용 컴포넌트
function InfoRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-600">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
