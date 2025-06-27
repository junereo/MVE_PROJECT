// src/schedulers/surveyStatusCron.ts
import cron from 'node-cron'
import { PrismaClient, SurveyActive } from '@prisma/client'

const prisma = new PrismaClient()

// 매 분마다 실행
cron.schedule('* * * * *', async () => {
  const now = new Date()
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)

  try {
    // upcoming -> ongoing
    const toOngoing = await prisma.survey.updateMany({
      where: {
        is_active: 'upcoming',
        start_at: { lte: kstNow },
        end_at: { gte: kstNow },
      },
      data: { is_active: 'ongoing' },
    })

    // ongoing -> closed
    const closedSurveys = await prisma.survey.findMany({
      where: {
        is_active: 'ongoing',
        end_at: { lt: kstNow },
      },
    })

    for (const survey of closedSurveys) {
      await prisma.survey.update({
        where: { id: survey.id },
        data: { is_active: 'closed' },
      })

      // 알림 예시: 콘솔 로그 (추후 push/email 연동 가능)
      console.log(`알림: 설문 종료됨 → ID ${survey.id}, 제목: ${survey.survey_title}`)

      // 리워드 지급 로직: 설문 응답자에게 지급
      const responses = await prisma.survey_Responses.findMany({
        where: { survey_id: survey.id, rewarded: false },
      })

      for (const response of responses) {
        const rewardAmount = survey.reward || 0
        const rewardType = 'normal'

        await prisma.rewards.create({
          data: {
            user_id: response.user_id,
            survey_id: survey.id,
            token_amount: rewardAmount,
            status: 'completed',
            reward_reason: '서베이 참여 보상',
            source_ref: `survey:${survey.id}`,
            reward_type: rewardType,
            rewarded_at: kstNow,
          },
        })

        await prisma.survey_Responses.update({
          where: { id: response.id },
          data: { rewarded: true },
        })

        console.log(`리워드 지급 완료: user=${response.user_id}, survey=${survey.id}, amount=${rewardAmount}`)
      }
    }

    if (toOngoing.count > 0 || closedSurveys.length > 0) {
      console.log(
        `[CRON] ${kstNow.toISOString()} | 상태 변경됨: upcoming→ongoing ${toOngoing.count}건, ongoing→closed ${closedSurveys.length}건`
      )
    }
  } catch (err) {
    console.error('[CRON] 설문 상태 업데이트 오류:', err)
  }
})
