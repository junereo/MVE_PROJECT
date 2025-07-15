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


// export const calculateSurveyResult = async (surveyId: Number): Promise<AggregatedResult> => {
//   const resultMap: AggregatedResult = {};

//     const participants = await prisma.survey_Participants.findMany({
//     where: { survey_id: Number(surveyId)},
//         select: {
//             answers: true,
//             user: {
//                 select: {
//                     gender: true,
//                     age: true,
//                     genre: true,
//                     job_domain: true,
//                 },
//             },
//         },
//     });

//   for (const participant of participants) {
//     const answers = Array.isArray(participant.answers)
//       ? participant.answers
//       : (participant.answers && typeof participant.answers === "object" && "answers" in participant.answers && Array.isArray((participant.answers as any).answers))
//         ? (participant.answers as any).answers
//         : [];

//     for (const answerObj of answers) {
//       const { id, type, answer, options, question_text } = answerObj;
//       if (type === 'subjective') continue;

//       if (!resultMap[id]) {
//         resultMap[id] = {
//           id,
//           type,
//           options,
//           question_text,
//           average: new Array(options.length).fill(0),
//         };
//       }

//       const indexIncrement = (ans: string) => {
//         const index = options.indexOf(ans);
//         if (index !== -1) resultMap[id].average[index] += 1;
//       };

//       if (type === 'multiple' && typeof answer === 'string') {
//         indexIncrement(answer);
//       } else if (type === 'checkbox' && Array.isArray(answer)) {
//         for (const ans of answer) {
//           indexIncrement(ans);
//         }
//       }
//     }
//   }

//   // 평균 계산
//   const totalParticipants = participants.length;
//   for (const qid in resultMap) {
//     resultMap[qid].average = resultMap[qid].average.map(
//       (count) => parseFloat((count / totalParticipants).toFixed(2))
//     );
//   }

//   return resultMap;
// }


// export const calculateSurveyResult = async (surveyId: number) => {
//     try {
//         const participants = await prisma.survey_Participants.findMany({
//             where: { survey_id: surveyId, status: "complete" },
//             select: {
//                 answers: true,
//                 user: {
//                     select: {
//                         gender: true,
//                         age: true,
//                         genre: true,
//                         job_domain: true,
//                     },
//                 },
//             },
//         });

//         if (participants.length === 0) {
//             console.log(`[SURVEY_RESULT] 참여자 없음: surveyId=${surveyId}`);
//             return null;
//         }

//         const statsByGroup: Record<string, any> = {};

//         // GLOBAL 버킷 초기화
//         statsByGroup['GLOBAL'] = {
//             totalScores: {},
//             countScores: {},
//             choiceCounts: {},
//             freeAnswers: {},
//             count: 0,
//         };

//         participants.forEach(({ answers, user }) => {
//             let parsedAnswers: AnswerItem[] = [];

//             if (Array.isArray(answers)) {
//                 parsedAnswers = answers as AnswerItem[];
//             } else if (answers && Array.isArray((answers as any).answers)) {
//                 parsedAnswers = (answers as any).answers as AnswerItem[];
//             } else {
//                 console.warn("유효한 answers 구조 아님:", answers);
//                 return;
//             }

//             const groupKey = `gender_${user?.gender ?? "unknown"}_age_${user?.age ?? "unknown"}_job_${user?.job_domain ?? "unknown"}`;

//             if (!statsByGroup[groupKey]) {
//                 statsByGroup[groupKey] = {
//                     totalScores: {},
//                     countScores: {},
//                     choiceCounts: {},
//                     freeAnswers: {},
//                     count: 0,
//                 };
//             }

//             const group = statsByGroup[groupKey];
//             const global = statsByGroup['GLOBAL'];

//             [group, global].forEach(bucket => {
//                 bucket.count += 1;

//                 parsedAnswers.forEach(({ id, type, answer }) => {
//                     switch (type) {
//                         case "multiple":
//                             if (typeof answer === "string") {
//                                 const key = `${id}-${answer}`;
//                                 bucket.choiceCounts[key] = (bucket.choiceCounts[key] || 0) + 1;
//                             }
//                             break;

//                         case "checkbox":
//                             if (Array.isArray(answer)) {
//                                 answer.forEach(option => {
//                                     const key = `${id}-${option}`;
//                                     bucket.choiceCounts[key] = (bucket.choiceCounts[key] || 0) + 1;
//                                 });
//                             }
//                             break;

//                         case "subjective":
//                             if (typeof answer === "string") {
//                                 if (!bucket.freeAnswers[id]) bucket.freeAnswers[id] = [];
//                                 bucket.freeAnswers[id].push(answer);
//                             }
//                             break;

//                         default:
//                             if (typeof answer === "number") {
//                                 bucket.totalScores[id] = (bucket.totalScores[id] || 0) + answer;
//                                 bucket.countScores[id] = (bucket.countScores[id] || 0) + 1;
//                             }
//                             break;
//                     }
//                 });
//             });
//         });

//         const survey_statistics: Record<string, any> = { groups: {} };

//         // 그룹별 평균 & 퍼센트
//         Object.entries(statsByGroup).forEach(([groupKey, bucket]) => {
//             if (groupKey === 'GLOBAL') return;

//             const averages: Record<string, number> = {};
//             Object.keys(bucket.totalScores).forEach(qid => {
//                 averages[qid] = bucket.totalScores[qid] / bucket.countScores[qid];
//             });

//             const choicePercentages: Record<string, number> = {};
//             Object.entries(bucket.choiceCounts as Record<string, number>).forEach(([key, count]) => {
//                 choicePercentages[key] = Math.round((count / bucket.count) * 1000) / 10;
//             });

//             survey_statistics.groups[groupKey] = {
//                 averages,
//                 choiceCounts: bucket.choiceCounts,
//                 choicePercentages,
//                 freeAnswers: bucket.freeAnswers,
//                 respondents: bucket.count,
//             };
//         });

//         //  GLOBAL
//         const global = statsByGroup['GLOBAL'];
//         const globalAverages: Record<string, number> = {};
//         Object.keys(global.totalScores).forEach(qid => {
//             globalAverages[qid] = global.totalScores[qid] / global.countScores[qid];
//         });

//         const globalChoicePercentages: Record<string, number> = {};
//         Object.entries(global.choiceCounts as Record<string, number>).forEach(([key, count]) => {
//             globalChoicePercentages[key] = Math.round((count / global.count) * 1000) / 10;
//         });

//         const topChoices = (Object.entries(global.choiceCounts) as [string, number][])
//             .sort((a, b) => b[1] - a[1])
//             .slice(0, 3)
//             .map(([key, count]) => ({
//                 key,
//                 count,
//                 percentage: Math.round((count / global.count) * 1000) / 10,
//             }));

//         survey_statistics.global = {
//             averages: globalAverages,
//             choiceCounts: global.choiceCounts,
//             choicePercentages: globalChoicePercentages,
//             topChoices,
//             freeAnswers: global.freeAnswers,
//             respondents: global.count,
//         };

//         const result = await prisma.survey_Result.upsert({
//             where: { survey_id: surveyId },
//             update: {
//                 survey_statistics,
//                 respondents: participants.length,
//             },
//             create: {
//                 survey_id: surveyId,
//                 survey_statistics,
//                 respondents: participants.length,
//                 reward_claimed_amount: 0,
//                 reward_claimed: 0,
//                 created_at: new Date(),
//             },
//         });

//         console.log(`[SURVEY_RESULT] 계산 완료: surveyId=${surveyId}`);
//         return result;

//     } catch (err) {
//         console.error(`[SURVEY_RESULT] 오류:`, err);
//         throw err;
//     }
// };
