"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useState } from "react";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import { SurveyTypeEnum } from "@/features/survey/types/enums";

interface Step3Props {
  onPrev: () => void;
  onNext: () => void;
}

export default function Step3Type({ onPrev, onNext }: Step3Props) {
  const { step3, setStep3 } = useSurveyStore();

  const [surveyType, setSurveyType] = useState<SurveyTypeEnum>(
    step3.surveyType ?? SurveyTypeEnum.OFFICIAL
  );
  const [rewardAmount, setRewardAmount] = useState(step3.reward_amount);
  const [reward, setReward] = useState(step3.reward);
  const [expertReward, setExpertReward] = useState(step3.expert_reward);

  const handleNext = () => {
    setStep3({
      surveyType,
      reward_amount: rewardAmount,
      reward,
      expert_reward: expertReward,
    });
    onNext();
  };

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex  bg-white text-black border border-red-500 z-30 items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="space-y-4 min-h-screen">
        <h2 className="text-xl font-bold">Step 3: 설문 유형</h2>
        <div className="flex gap-2">
          <Button
            color={surveyType === SurveyTypeEnum.OFFICIAL ? "blue" : "white"}
            onClick={() => setSurveyType(SurveyTypeEnum.OFFICIAL)}
          >
            공식
          </Button>
          <Button
            color={surveyType === SurveyTypeEnum.GENERAL ? "blue" : "white"}
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
            <Input
              label="리워드 총량"
              type="number"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(Number(e.target.value))}
              placeholder="리워드 총량을 입력해주세요."
            />
            <Input
              label="일반 회원 리워드"
              type="number"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
              placeholder="일반 회원에게 지급할 리워드를 입력해주세요."
            />
            <Input
              label="Expert 회원 리워드"
              type="number"
              value={expertReward}
              onChange={(e) => setExpertReward(Number(e.target.value))}
              placeholder="Expert 회원에게 지급할 리워드를 입력해주세요."
            />
          </>
        )}
        {surveyType === SurveyTypeEnum.GENERAL && (
          <Input
            label="일반 리워드"
            type="number"
            placeholder="기본으로 지급되는 리워드입니다."
          />
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] p-3 flex items-center bg-white text-black border border-green-700 z-30 justify-end gap-3">
        <div className="flex-[1.5]">
          <Button onClick={onPrev} color="white">
            이전
          </Button>
        </div>
        <div className="flex-[2]">
          <Button onClick={handleNext} color="blue">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
