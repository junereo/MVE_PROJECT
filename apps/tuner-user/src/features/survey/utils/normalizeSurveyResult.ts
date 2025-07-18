import {
  SurveyResultData,
  QuestionStat,
  DemographicData,
} from "@/features/survey/types/surveyResultPayload";

export type NormalizedSurveyResult = {
  survey_statistics: QuestionStat[];
  demographics: DemographicData;
  respondents: number;
};

const defaultDemographics: DemographicData = {
  age: {
    teen: 0,
    twenties: 0,
    thirties: 0,
    forties: 0,
    fifties: 0,
    sixties: 0,
  },
  gender: { male: 0, female: 0 },
  genre: {
    ballad: 0,
    hiphop: 0,
    rnb: 0,
    rock: 0,
    dance: 0,
    jazz: 0,
    classical: 0,
    edm: 0,
    gukak: 0,
    ccm: 0,
    pop: 0,
    trot: 0,
  },
  job_domain: { yes: 0, no: 0 },
};

export function normalizeSurveyResult(
  raw: SurveyResultData
): NormalizedSurveyResult {
  const stats: QuestionStat[] = [];
  let demographics: DemographicData | null = null;

  for (const [value] of Object.entries(raw.survey_statistics)) {
    if (typeof value === "object" && "id" in value && "average" in value) {
      stats.push(value as QuestionStat);
    } else if (
      typeof value === "object" &&
      "gender" in value &&
      "age" in value &&
      "job_domain" in value &&
      "genre" in value
    ) {
      demographics = value as DemographicData;
    }
  }

  return {
    survey_statistics: stats,
    demographics: demographics ?? defaultDemographics,
    respondents: raw.respondents,
  };
}
