import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'
import { checkSurveyActive } from '../services/survey.service'
import { SurveyService } from '../wallet/services/survey.service'
import { MetaTransctionService } from '../wallet/services/meta_transction.service'
import Redis from 'ioredis'

// 1) Prisma 클라이언트 & 서비스 인스턴스
const prisma = new PrismaClient()
const metaService = new MetaTransctionService()
const surveyService = new SurveyService(metaService)

// 2) Redis 락용 클라이언트
const redis = new Redis()

// 3) cron 스케줄 (1분 간격 추천)
cron.schedule('*/1 * * * *', async () => {
  const lockKey = 'surveyStatusCron:lock'
  const lockTTL = 60 // 초

  // 4) 중복 실행 방지 락 체크
  const isLocked = await redis.get(lockKey)
  if (isLocked) {
    console.log('[CRON] 이미 실행 중 — 중복 실행 방지')
    return
  }
  await redis.set(lockKey, 'locked', 'EX', lockTTL)

  const kstNow = DateTime.now().setZone('Asia/Seoul')
  console.log(`[CRON] 실행 시간: ${kstNow.toISO()}`)

  try {
    const surveys = await prisma.survey.findMany({
      where: {
        is_active: { in: ['upcoming', 'ongoing'] },
      },
    })

    // 병렬로 처리: 설문별
    await Promise.all(
      surveys.map(async (survey) => {
        const newState = checkSurveyActive(survey.start_at, survey.end_at)

        if (survey.is_active !== newState) {
          await prisma.survey.update({
            where: { id: survey.id },
            data: { is_active: newState },
          })
          console.log(`[CRON] 설문 ID ${survey.id} 상태 ${survey.is_active} → ${newState}`)
        }

        if (survey.is_active === 'ongoing' && newState === 'closed') {
          console.log(`[CRON] 설문 종료됨 → ID ${survey.id}, 제목: ${survey.survey_title}`)

          const participants = await prisma.survey_Participants.findMany({
            where: { survey_id: survey.id },
            select: {
              id: true,
              user_id: true,
              rewarded: true,
              user: {
                select: {
                  id: true,
                  role: true,
                },
              },
            },
          })

          // 참여자 병렬 처리
          await Promise.all(
            participants.map(async (participant) => {
              if (!participant.user_id || !participant.user) return

              const rewardAmount = participant.rewarded ?? 0
              if (rewardAmount <= 0) return

              await prisma.transaction.create({
                data: {
                  user_id: participant.user_id,
                  type: 'DEPOSIT',
                  amount: rewardAmount,
                  memo: `설문 참여 리워드 (설문 ID: ${survey.id})`,
                },
              })

              await prisma.user.update({
                where: { id: participant.user_id },
                data: {
                  balance: { increment: rewardAmount },
                },
              })

              await prisma.survey_Participants.update({
                where: { id: participant.id },
                data: { rewarded: 0 },
              })

              let metadata_ipfs = 'failed'
              try {
                const ipfsResult = await surveyService.submitSurveyAndMint(
                  String(participant.user_id),
                  String(survey.id),
                  JSON.stringify(survey)
                )
                if (ipfsResult?.metadataUri) {
                  metadata_ipfs = ipfsResult.metadataUri
                }
              } catch (e) {
                console.error('[CRON] IPFS 업로드 실패:', e)
              }

              await prisma.survey_Result.updateMany({
                where: { survey_id: survey.id },
                data: { metadata_ipfs },
              })

              console.log(
                `[CRON] 지급 완료: user_id=${participant.user_id}, amount=${rewardAmount}, metadata_ipfs=${metadata_ipfs}`
              )
            })
          )
        }
      })
    )

    console.log('[CRON] 상태 동기화 완료')
  } catch (err) {
    console.error('[CRON] 설문 상태 업데이트 오류:', err)
  } finally {
    await redis.del(lockKey)
  }
})
