import { useMemo } from "react";
import SummaryCard from "./SummaryCard";
import { GroupResult } from "@/features/survey/types/surveyResultPayload";
import { SummaryStats } from "@/features/survey/types/surveyResultPayload";
import TrendHighlight from "./TrendHighlight";
import ParticipantStats from "./ParticipantStats";
import GroupedResponses from "./GroupedResponses";

const mockSummary: SummaryStats = {
  "작품성 평균": 4.6,
  "대중성 평균": 3.9,
  "참여자 수": 88,
};

const mockGroupStats: GroupResult[] = [
  {
    user_group: "20대 여성",
    question: "이 음원에 대한 첫인상은 어땠나요?",
    options: [
      { label: "매우 좋다", percentage: 62 },
      { label: "보통이다", percentage: 25 },
      { label: "잘 모르겠다", percentage: 13 },
    ],
  },
  {
    user_group: "음악 업계 종사자",
    question: "이 음원의 장르를 선택해주세요.",
    options: [
      { label: "클래식", percentage: 60 },
      { label: "R&B", percentage: 30 },
      { label: "발라드", percentage: 10 },
    ],
  },
];

export default function SurveyResult() {
  const summary = mockSummary;
  const groupStats = mockGroupStats;

  const groupedByUser = useMemo(() => {
    return groupStats.reduce<Record<string, GroupResult[]>>((acc, item) => {
      if (!acc[item.user_group]) acc[item.user_group] = [];
      acc[item.user_group].push(item);
      return acc;
    }, {});
  }, [groupStats]);

  return (
    <div className="flex flex-col gap-6">
      <ParticipantStats />
      <SummaryCard summary={summary} />
      <TrendHighlight />
      <GroupedResponses grouped={groupedByUser} />
    </div>
  );
}
