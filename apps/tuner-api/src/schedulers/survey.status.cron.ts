// src/schedulers/surveyStatusCron.ts
import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'
import { checkSurveyActive } from '../services/survey.service'
import { SurveyService } from '../wallet/services/survey.service'
import { MetaTransctionService } from '../wallet/services/meta_transction.service'

const prisma = new PrismaClient()

const metaService = new MetaTransctionService()
const surveyService = new SurveyService(metaService)

cron.schedule('*/10 * * * * *', async () => {
  const kstNow = DateTime.now().setZone('Asia/Seoul')
  console.log(`[CRON] 실행 시간: ${kstNow.toISO()}`)

  try {
    // 상태 변경 대상 찾기
    const surveys = await prisma.survey.findMany({
      where: {
        is_active: { in: ['upcoming', 'ongoing'] },
      },
    })

    for (const survey of surveys) {
      const newState = checkSurveyActive(survey.start_at, survey.end_at)

      if (survey.is_active !== newState) {
        await prisma.survey.update({
          where: { id: survey.id },
          data: { is_active: newState },
        })
        console.log(`[CRON] 설문 ID ${survey.id} 상태 ${survey.is_active} → ${newState}`)
      }

      // ongoing → closed 된 설문만 리워드 지급 처리
      if (survey.is_active === 'ongoing' && newState === 'closed') {
        console.log(`알림: 설문 종료됨 → ID ${survey.id}, 제목: ${survey.survey_title}`)

        const participants = await prisma.survey_Participants.findMany({
          where: { survey_id: survey.id },
          select: {
            id: true,
            user_id: true,
            rewarded: true,
            answers: true,
            user: {
              select: {
                id: true,
                role: true,
                badge_issued_at: true,
              },
            },
          },
        })

        for (const participant of participants) {
          if (!participant.user || participant.user_id == null) continue

          const rewardAmount = participant.rewarded ?? 0

          if (rewardAmount > 0) {
            // 트랜잭션 기록
            await prisma.transaction.create({
              data: {
                user_id: participant.user_id!,
                type: 'DEPOSIT',
                amount: rewardAmount,
                memo: `설문 참여 리워드 (설문 ID: ${survey.id})`,
              },
            })

            // 유저 잔액 업데이트
            await prisma.user.update({
              where: { id: participant.user_id! },
              data: {
                balance: { increment: rewardAmount },
              },
            })

            // 참여자 리워드 상태 초기화
            await prisma.survey_Participants.update({
              where: { id: participant.id },
              data: { rewarded: 0 },
            })

            // IPFS 업로드
            let metadata_ipfs = 'failed'
            try {
              if (
                surveyService &&
                surveyService['contract'] &&
                surveyService['wallet'] &&
                surveyService['provider']
              ) {
                const ipfsResult = await surveyService.submitSurveyAndMint(
                  String(participant.user_id),
                  String(survey.id),
                  JSON.stringify(survey)
                )
                if (ipfsResult && ipfsResult.metadataUri) {
                  metadata_ipfs = ipfsResult.metadataUri
                }
              }
            } catch (e) {
              console.error('IPFS 업로드 실패:', e)
              metadata_ipfs = 'failed'
            }

            // Survey_Result 업데이트
            await prisma.survey_Result.updateMany({
              where: { survey_id: survey.id },
              data: { metadata_ipfs },
            })

            console.log(
              `리워드 지급 완료: user_id=${participant.user_id}, role=${participant.user.role}, amount=${rewardAmount}`
            )
          }
        }
      }
    }

    console.log(`[CRON] 상태 동기화 완료`)
  } catch (err) {
    console.error('[CRON] 설문 상태 업데이트 오류:', err)
  }
})
