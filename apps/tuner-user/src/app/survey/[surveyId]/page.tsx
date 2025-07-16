"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/layouts/Header";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getSurveyById } from "@/features/survey/services/survey";
import { useEffect, useState } from "react";
import { SurveyResponse } from "@/features/survey/types/surveyResponse";
import SurveyResult from "./components/SurveyResult";
import { SurveyTypeEnum } from "@/features/survey/types/enums";
import { UserUpdatePayload } from "@/features/users/types/userInfo";
import Link from "next/link";
import YoutubeThumbnailPlayer from "./components/YoutubeThumbnailPlayer";

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
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!params?.surveyId) return;
    const fetch = async () => {
      try {
        const response = await getSurveyById(Number(params.surveyId));
        console.log("설문 상세", response);
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
    music_uri,
    thumbnail_uri,
    survey_title,
    music_title,
    artist,
    type,
    start_at,
    end_at,
    participants,
    reward_amount,
    status,
    is_active,
    released_date,
  } = survey;

  const myParticipation = participants?.find(
    (p) => String(p.user.id) === String(user?.id)
  );

  return (
    <>
      <Header />

      <div>
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: `${survey_title}` },
          ]}
        />
        <YoutubeThumbnailPlayer
          thumbnail={thumbnail_uri}
          youtubeUrl={music_uri}
          title={music_title}
          badgeText={type === "official" ? "공식 설문" : "일반 설문"}
        />

        <div className="flex justify-between items-center mb-4 px-1">
          <h1 className="text-[20px] sm:text-[22px] font-bold text-gray-900 leading-snug break-keep">
            {survey_title}
          </h1>
          <div className="text-sm text-gray-500">
            설문 생성자 :{" "}
            <span className="font-medium text-gray-700">
              {survey.creator.nickname}
            </span>
          </div>
        </div>

        <div className="mb-6 border-t border-gray-100 pt-4 px-1 space-y-1 sm:space-y-2">
          <div className="flex sm:flex-row justify-between items-end gap-y-1">
            <p className="text-sm text-gray-400">ARTIST</p>
            <p className="text-sm text-gray-500">
              {released_date.slice(0, 10)} 발매
            </p>
          </div>
          <p className="text-lg sm:text-xl font-medium text-gray-800">
            {artist}
          </p>
          <p className="text-base sm:text-lg text-gray-600">{music_title}</p>
        </div>
        <section className="rounded-2xl border mb-6 border-gray-100 bg-gray-50 px-4 py-5 shadow-sm space-y-4">
          <InfoRow
            label="설문 기간"
            value={`${start_at.slice(0, 10)} ~ ${end_at.slice(0, 10)}`}
          />

          <InfoRow
            label="참여자 수"
            value={`${participants?.length?.toLocaleString() ?? "0"}명`}
          />
          {type === SurveyTypeEnum.OFFICIAL && (
            <InfoRow
              label="리워드"
              value={`🎁 ${reward_amount / 1000} MVE`}
              valueClass="text-orange-500"
            />
          )}
          <InfoRow
            label="상태"
            value={statusTextMap[is_active as SurveyStatus]}
            valueClass={
              is_active === "ongoing"
                ? "text-green-600"
                : is_active === "upcoming"
                ? "text-blue-500"
                : "text-gray-400"
            }
          />
        </section>
        {is_active === "closed" && (
          <section className="space-y-6 pt-6 border-t border-gray-100">
            <h1 className="text-xl font-bold text-gray-800 ">설문 결과</h1>
            <p className="text-sm text-gray-500">
              총{" "}
              <span className="text-gray-800 font-semibold">
                {`${participants?.length?.toLocaleString() ?? 0}명`}
              </span>
              이 참여했어요.
            </p>

            <SurveyResult surveyId={id} />
          </section>
        )}

        {is_active === "ongoing" && user && (
          <>
            {myParticipation ? (
              myParticipation.status === "complete" ? (
                // 참여 완료
                <div className="fixed bottom-[65px] left-0 right-0 z-20 px-4 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto">
                  <Button color="white">이미 참여한 설문입니다.</Button>
                </div>
              ) : (
                // 응답 임시 저장 (draft)
                <div className="fixed bottom-[65px] left-0 right-0 z-20 px-4 w-full  max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto">
                  <Button
                    color="yellow"
                    onClick={() => {
                      sessionStorage.setItem(
                        "editResponseData",
                        JSON.stringify({
                          surveyId: id,
                          answers: myParticipation.answers,
                          surveyTitle: survey.survey_title,
                        })
                      );
                      router.push(`/survey/${id}/editResponse`);
                    }}
                  >
                    설문 응답 수정
                  </Button>
                </div>
              )
            ) : (
              // 참여 전
              <div className="fixed bottom-[65px] left-0 right-0 z-20 px-4 w-full  max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto">
                <Button
                  color="blue"
                  onClick={() => router.push(`/survey/${id}/responses`)}
                >
                  설문 참여하기
                </Button>
              </div>
            )}
          </>
        )}

        {(is_active === "upcoming" || status === "draft") &&
          user &&
          user &&
          String(user.id) === String(survey.user_id) && (
            <div className="fixed bottom-[65px] left-0 right-0 z-20 px-4 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto">
              <Button
                color="yellow"
                onClick={() => router.push(`/survey/${id}/edit`)}
              >
                설문 수정하기
              </Button>
            </div>
          )}
      </div>
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
    <div className="flex justify-between items-center text-sm sm:text-base text-gray-600">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
