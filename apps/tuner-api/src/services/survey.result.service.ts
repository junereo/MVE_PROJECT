import { PrismaClient } from "@prisma/client";
import { AnswerItem } from "../types/survey.types";

const prisma = new PrismaClient();

// enum 정의
type AgeGroup = 'teen' | 'twenties' | 'thirties' | 'forties' | 'fifties' | 'sixties';
type Genre =
  | 'hiphop' | 'ballad' | 'dance' | 'rnb' | 'rock' | 'trot'
  | 'pop' | 'gukak' | 'ccm' | 'edm' | 'classical' | 'jazz';

const ageGroups: AgeGroup[] = ['teen', 'twenties', 'thirties', 'forties', 'fifties', 'sixties'];
const genres: Genre[] = ['hiphop', 'ballad', 'dance', 'rnb', 'rock', 'trot', 'pop', 'gukak', 'ccm', 'edm', 'classical', 'jazz'];

type FinalSurveyResult = {
  demographics: {
    gender: { male: number; female: number };
    age: Record<AgeGroup, number>;
    genre: Record<Genre, number>;
    job_domain: { yes: number; no: number };
  };
} & {
  [questionId: number]: {
    id: number;
    average: number[];
  };
};

export const calculateSurveyResult = async (surveyId: number): Promise<FinalSurveyResult> => {
  const resultMap: Record<number, { id: number; average: number[] }> = {};

  const demographics: FinalSurveyResult['demographics'] = {
    gender: { male: 0, female: 0 },
    age: Object.fromEntries(ageGroups.map(a => [a, 0])) as Record<AgeGroup, number>,
    genre: Object.fromEntries(genres.map(g => [g, 0])) as Record<Genre, number>,
    job_domain: { yes: 0, no: 0 },
  };

  const participants = await prisma.survey_Participants.findMany({
    where: { survey_id: surveyId },
    select: {
      answers: true,
      user: {
        select: {
          gender: true,
          age: true,
          genre: true,
          job_domain: true,
        },
      },
    },
  });

  for (const participant of participants) {
    const user = participant.user;

    // demographics 누적
    if (user) {
      if (user.gender !== null) demographics.gender[user.gender ? 'male' : 'female']++;
      if (user.age && ageGroups.includes(user.age)) demographics.age[user.age]++;
      if (user.genre && genres.includes(user.genre)) demographics.genre[user.genre]++;
      if (user.job_domain !== null) demographics.job_domain[user.job_domain ? 'yes' : 'no']++;
    }

    const answers = Array.isArray(participant.answers)
      ? participant.answers
      : (participant.answers && typeof participant.answers === "object" && "answers" in participant.answers && Array.isArray((participant.answers as any).answers))
        ? (participant.answers as any).answers
        : [];

    for (const answerObj of answers) {
      const { id, type, answer, options } = answerObj;
      if (type === 'subjective') continue;

      if (!resultMap[id]) {
        resultMap[id] = {
          id,
          average: new Array(options.length).fill(0),
        };
      }

      const indexIncrement = (ans: string) => {
        const index = options.indexOf(ans);
        if (index !== -1) resultMap[id].average[index]++;
      };

      if (type === 'multiple' && typeof answer === 'string') {
        indexIncrement(answer);
      } else if (type === 'checkbox' && Array.isArray(answer)) {
        for (const ans of answer) {
          indexIncrement(ans);
        }
      }
    }
  }

  const finalResult: FinalSurveyResult = {
    demographics,
    ...resultMap,
  };

  const result = await prisma.survey_Result.upsert({
    where: { survey_id: surveyId },
    update: {
      survey_statistics: finalResult,
      respondents: participants.length,
    },
    create: {
      survey_id: surveyId,
      survey_statistics: finalResult,
      respondents: participants.length,
      reward_claimed_amount: 0,
      reward_claimed: 0,
      created_at: new Date(),
    },
  });

  console.log(result);
  return finalResult;
};
