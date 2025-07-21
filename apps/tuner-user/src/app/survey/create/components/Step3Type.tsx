"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useEffect, useState } from "react";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import { SurveyTypeEnum } from "@/features/survey/types/enums";
import { getAddressToken } from "@/features/withdrawal/services/contract";
import { useUserStore } from "@/features/users/store/useUserStore";

interface Step3Props {
  onPrev: () => void;
  onNext: () => void;
}

export default function Step3Type({ onPrev, onNext }: Step3Props) {
  const { step3, setStep3 } = useSurveyStore();
  const { userInfo } = useUserStore();
  const [tunerBalance, setTunerBalance] = useState(0);

  const [surveyType, setSurveyType] = useState<SurveyTypeEnum>(
    step3.surveyType ?? SurveyTypeEnum.OFFICIAL
  );
  const [rewardAmount, setRewardAmount] = useState("");
  const [reward, setReward] = useState("");
  const [expertReward, setExpertReward] = useState("");

  useEffect(() => {
    const fetchTuner = async () => {
      if (!userInfo?.id) return;
      try {
        const res = await getAddressToken(userInfo.id);
        const parsed = Number(res.token);
        setTunerBalance(isNaN(parsed) ? 0 : parsed);
      } catch (err) {
        console.error("TUNER 잔액 조회 실패:", err);
        setTunerBalance(0);
      }
    };
    fetchTuner();
  }, [userInfo]);

  useEffect(() => {
    if (step3.reward_amount) {
      setRewardAmount(String(step3.reward_amount / 1000));
    }
    if (step3.reward) {
      setReward(String(step3.reward / 1000));
    }
    if (step3.expert_reward) {
      setExpertReward(String(step3.expert_reward / 1000));
    }
  }, [step3.reward_amount, step3.reward, step3.expert_reward]);

  useEffect(() => {
    if (surveyType === SurveyTypeEnum.GENERAL) {
      setRewardAmount("");
      setExpertReward("");
    }
  }, [surveyType]);

  const handleNext = () => {
    if (surveyType === SurveyTypeEnum.GENERAL) {
      setStep3({
        surveyType,
        reward: 1000, // 1 * 1000
      });
    } else {
      setStep3({
        surveyType,
        reward_amount: Math.round(Number(rewardAmount) * 1000),
        reward: Math.round(Number(reward) * 1000),
        expert_reward: Math.round(Number(expertReward) * 1000),
      });
    }

    onNext();
  };

  const total = Number(rewardAmount);
  const general = Number(reward);
  const expert = Number(expertReward);
  const remainingBalance = tunerBalance - total;

  const isValid =
    surveyType === SurveyTypeEnum.GENERAL ||
    (rewardAmount.trim() !== "" &&
      reward.trim() !== "" &&
      expertReward.trim() !== "" &&
      !isNaN(total) &&
      !isNaN(general) &&
      !isNaN(expert) &&
      total > 0 &&
      general > 0 &&
      expert > 0 &&
      remainingBalance >= 0);

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev} className="text-lg font-medium text-gray-700">
          ←
        </button>
        <h1 className="flex-1 text-center text-base sm:text-lg font-bold text-gray-900">
          설문 생성
        </h1>
      </header>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-10">
          Step 3: 설문 유형
        </h2>
        <div className="flex gap-2">
          <Button
            color={surveyType === SurveyTypeEnum.OFFICIAL ? "green" : "white"}
            onClick={() => setSurveyType(SurveyTypeEnum.OFFICIAL)}
          >
            공식
          </Button>
          <Button
            color={surveyType === SurveyTypeEnum.GENERAL ? "green" : "white"}
            onClick={() => setSurveyType(SurveyTypeEnum.GENERAL)}
          >
            일반
          </Button>
        </div>

        {surveyType === SurveyTypeEnum.OFFICIAL && (
          <>
            <p className="text-sm text-gray-600 bg-gray-50 border rounded-md p-3">
              공식 서베이는 리워드를 가지고 있어야 합니다.
              <br />
              또한 일반 회원과 Expert 회원의 지급량은 다릅니다.
              <br />
              참여자 수, 점수, 결과 등이 외부로 공개됩니다.
            </p>
            {surveyType === SurveyTypeEnum.OFFICIAL && (
              <div className="text-right text-sm text-gray-600 pt-1">
                보유 TUNER:{" "}
                <span className="font-semibold text-black">
                  {tunerBalance.toFixed(1)} TUNER
                </span>
                <br />
                차감 후 잔액:{" "}
                <span
                  className={`font-semibold ${
                    remainingBalance < 0 ? "text-red-500" : "text-black"
                  }`}
                >
                  {remainingBalance.toFixed(1)} TUNER
                </span>
              </div>
            )}
            <Input
              label="리워드 총량"
              type="number"
              value={rewardAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setRewardAmount(value);
                }
              }}
              placeholder="리워드 총량을 입력해주세요."
            />
            <Input
              label="일반 회원 리워드"
              type="number"
              min="0.001"
              inputMode="decimal"
              value={reward}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setReward(value);
                }
              }}
              placeholder="각 일반 회원에게 지급할 리워드를 입력해주세요."
            />
            <Input
              label="Expert 회원 리워드"
              type="number"
              min="0.001"
              inputMode="decimal"
              value={expertReward}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setExpertReward(value);
                }
              }}
              placeholder="각 Expert 회원에게 지급할 리워드를 입력해주세요."
            />
          </>
        )}
        {surveyType === SurveyTypeEnum.GENERAL && (
          <p className="text-sm text-gray-600 bg-gray-50 border rounded-md p-3">
            일반 서베이는 기본 리워드 1이 자동 설정됩니다.
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="w-[180px] sm:w-[400px]">
          <Button onClick={handleNext} disabled={!isValid} color="black">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
