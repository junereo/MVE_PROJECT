import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import Image from "next/image";
import Link from "next/link";

interface Step6Props {
  onPrev: () => void;
}

export default function Step6Result({ onPrev }: Step6Props) {
  const { surveySubmitStatus } = useSurveyStore();

  const isSuccess = surveySubmitStatus === "success";

  return (
    <>
      <div className="min-h-screen flex justify-center px-4">
        <div className="bg-white w-full max-w-[485px] py-10 text-center flex flex-col justify-center items-center gap-10">
          <Image
            src={isSuccess ? "/images/check.png" : "/images/x.png"}
            alt={isSuccess ? "성공" : "실패"}
            width={64}
            height={64}
            className="object-contain"
          />

          <div className="text-xl font-bold text-gray-800">
            {isSuccess ? (
              <>
                <p>설문 생성 완료</p>
                <p className="text-base text-gray-600 mt-2">
                  설문이 성공적으로 생성되었습니다.
                </p>
              </>
            ) : (
              <>
                <p>설문 생성 실패</p>
                <p className="text-base text-gray-600 mt-2">
                  다시 시도해 주세요.
                </p>
              </>
            )}
          </div>

          <Link
            href="/survey"
            className={`w-full py-3 ${
              isSuccess
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white text-center font-bold rounded-lg transition duration-200`}
          >
            확인
          </Link>
        </div>
      </div>
    </>
  );
}
