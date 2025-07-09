// src/services/survey/calculateSurveyResult.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const calculateSurveyResult = async (surveyId: number) => {
    try {
        // 참여자 답변 불러오기
        const participants = await prisma.survey_Participants.findMany({
            where: { survey_id: surveyId, status: 'complete' },
            select: { answers: true }
        })

        if (participants.length === 0) {
            console.log(`[SURVEY_RESULT] 참여자 없음: survey_id=${surveyId}`)
            return
        }

        // 집계용 
        const totalScores: Record<string, number> = {}
        const countScores: Record<string, number> = {}
        const choiceCounts: Record<string, number> = {}
        const freeAnswers: Record<string, string[]> = {}

        // 참여자별로 반복
        participants.forEach(({ answers }) => {
            if (!answers || typeof answers !== 'object') return

            for (const [questionId, answer] of Object.entries(answers)) {
                if (typeof answer === 'number') {
                    totalScores[questionId] = (totalScores[questionId] || 0) + answer
                    countScores[questionId] = (countScores[questionId] || 0) + 1
                } else if (Array.isArray(answer)) {
                    answer.forEach(option => {
                        choiceCounts[`${questionId}-${option}`] = (choiceCounts[`${questionId}-${option}`] || 0) + 1
                    })
                } else if (typeof answer === 'string') {
                    // 주관식 답변은 리스트로 모음
                    if (!freeAnswers[questionId]) freeAnswers[questionId] = []
                    freeAnswers[questionId].push(answer)
                }
            }
        })

        //  평균 계산
        const averages: Record<string, number> = {}
        Object.keys(totalScores).forEach(questionId => {
            averages[questionId] = totalScores[questionId] / countScores[questionId]
        })


        await prisma.survey_Result.upsert({
            where: { survey_id: surveyId },
            update: {
                survey_statistics: {
                    averages,
                    choiceCounts,
                    freeAnswers
                },
                respondents: participants.length,
            },
            create: {
                survey_id: surveyId,
                survey_statistics: {
                    averages,
                    choiceCounts,
                    freeAnswers
                },
                respondents: participants.length,
                reward_claimed_amount: 0,
                reward_claimed: 0,
                created_at: new Date()
            }
        })


        console.log(`[SURVEY_RESULT] 계산 완료: survey_id=${surveyId}`)
    } catch (err) {
        console.error(`[SURVEY_RESULT] 오류:`, err)
    }
}
