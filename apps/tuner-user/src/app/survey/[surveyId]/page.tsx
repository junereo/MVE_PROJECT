"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/layouts/Header";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import SurveyWrapper from "../create/components/layouts/SurveyWrapper";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useParams } from "next/navigation";
import { getSurveyById } from "@/features/survey/services/survey";
import { useEffect, useState } from "react";
import { SurveyResponse } from "@/features/survey/types/surveyResponse";

type SurveyStatus = "upcoming" | "ongoing" | "closed";

const statusTextMap: Record<SurveyStatus, string> = {
  upcoming: "예정",
  ongoing: "진행중",
  closed: "종료",
};

export default function SurveyDetail() {
  const router = useRouter();
  const params = useParams();
  const [survey, setSurvey] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    if (!params?.surveyId) return;
    const fetch = async () => {
      try {
        const response = await getSurveyById(Number(params.surveyId));
        setSurvey(response);
      } catch (err) {
        console.error("설문 상세 불러오기 실패", err);
      }
    };
    fetch();
  }, [params.surveyId]);

  if (!survey) return null;

  const {
    id,
    thumbnail_uri,
    survey_title,
    music_title,
    artist,
    type,
    start_at,
    end_at,
    participantCount,
    reward_amount,
    is_active,
    release_date,
  } = survey;

  return (
    <>
      <Header />

      <SurveyWrapper>
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: `${survey_title}` },
          ]}
        />
        <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-5 shadow-md">
          <Image
            src={thumbnail_uri}
            alt={music_title}
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
            <p className="text-sm text-gray-500 mt-1">{release_date} 발매</p>
          </div>

          <p className="text-lg font-medium text-gray-800">{artist}</p>
          <p className="text-base text-gray-600 mt-1">{music_title}</p>
        </div>

        <section className="rounded-2xl mb-10 border border-gray-100 bg-gray-50 px-4 py-5 shadow-sm space-y-4">
          <InfoRow label="설문 기간" value={`${start_at} ~ ${end_at}`} />
          <InfoRow
            label="참여자 수"
            value={`${(participantCount ?? 0).toLocaleString()}명`}
          />
          <InfoRow
            label="리워드"
            value={`🎁 ${reward_amount} STK`}
            valueClass="text-orange-500"
          />
          <InfoRow
            label="상태"
            value={statusTextMap[is_active]}
            valueClass={
              is_active === "ongoing"
                ? "text-green-600"
                : is_active === "upcoming"
                ? "text-blue-500"
                : "text-gray-400"
            }
          />
        </section>

        <div className="fixed bottom-[65px] left-0 right-0 z-20 px-4 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto">
          <Button
            color="blue"
            onClick={() => router.push(`/survey/${id}/responses`)}
          >
            설문 참여하기
          </Button>
        </div>
      </SurveyWrapper>
      <BottomNavbar />
    </>
  );
}

// 정보 표시용 컴포넌트
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
