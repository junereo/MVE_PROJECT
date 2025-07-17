import { useEffect, useMemo, useState } from "react";
import { getSurveyResult } from "@/features/survey/services/survey";
import {
  NormalizedSurveyResult,
  normalizeSurveyResult,
} from "@/features/survey/utils/normalizeSurveyResult";
import { useQuestionResults } from "@/features/survey/hooks/useQuestionResults";

import SummaryCard from "./SummaryCard";
import TrendHighlight from "./TrendHighlight";
import ParticipantStats from "./ParticipantStats";
import QuestionBasedResponses from "./QuestionBasedResponses";

export default function SurveyResult({ surveyId }: { surveyId: number }) {
  const [data, setData] = useState<NormalizedSurveyResult | null>(null);
  const { questionResults, isLoading } = useQuestionResults(surveyId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSurveyResult(surveyId);
        const { survey_statistics, demographics } = normalizeSurveyResult(
          res.data
        );

        setData({
          survey_statistics,
          demographics,
          respondents: res.data.respondents,
        });
      } catch (err) {
        console.error("설문 결과 불러오기 실패", err);
      }
    };
    fetch();
  }, [surveyId]);

  const genderPercent = useMemo(() => {
    if (!data) return 0;
    return percent(data.demographics.gender.female, data.respondents);
  }, [data]);

  const jobPercent = useMemo(() => {
    if (!data) return 0;
    return percent(data.demographics.job_domain.yes, data.respondents);
  }, [data]);

  const agePercent = useMemo(() => {
    if (!data) return 0;
    return percent(data.demographics.age.twenties, data.respondents);
  }, [data]);

  const topGenre = useMemo(() => {
    if (!data) return null;
    const entries = Object.entries(data.demographics.genre);
    const [label] = entries.sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
    return label.toUpperCase(); // EDM
  }, [data]);

  return (
    <div className="flex flex-col gap-8">
      <ParticipantStats
        genderPercent={genderPercent}
        jobPercent={jobPercent}
        agePercent={agePercent}
      />
      {topGenre && <TrendHighlight genre={topGenre} />}
      {!isLoading && questionResults.length > 0 && (
        <QuestionBasedResponses questions={questionResults} />
      )}
    </div>
  );
}

function calcAverage(distribution: number[] = []) {
  const total = distribution.reduce((a, b) => a + b, 0);
  const sum = distribution.reduce(
    (acc, count, idx) => acc + count * (5 - idx),
    0
  );
  return total === 0 ? 0 : +(sum / total).toFixed(1);
}

function percent(count: number, total: number) {
  if (!total || total === 0) return 0;
  return total === 0 ? 0 : Math.round((count / total) * 100);
}
