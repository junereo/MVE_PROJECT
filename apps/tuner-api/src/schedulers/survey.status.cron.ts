// src/schedulers/surveyStatusCron.ts
import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { SurveyService } from '../wallet/services/survey.service';
import { MetaTransctionService } from '../wallet/services/meta_transction.service';

const prisma = new PrismaClient()

const metaService = new MetaTransctionService();
const surveyService = new SurveyService(metaService);

// 매 분마다 실행
cron.schedule('*/10 * * * * *', async () => {
  const now = new Date()
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  //const kstNow = new Date(kstNow1.getTime() + 24 * 60 * 60 * 1000 * 7);

  console.log(`[CRON] 실행 시간: ${kstNow.toISOString()}`)

  try {
    // upcoming → ongoing
    const toOngoing = await prisma.survey.updateMany({
      where: {
        is_active: 'upcoming',
        start_at: { lte: kstNow },
        end_at: { gte: kstNow },
      },
      data: { is_active: 'ongoing' },
    })

    // ongoing → closed
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

      console.log(`알림: 설문 종료됨 → ID ${survey.id}, 제목: ${survey.survey_title}`)

      // 설문 참여자 조회 
      const participants = await prisma.survey_Participants.findMany({
        where: { survey_id: survey.id},
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
        if (!participant.user || participant.user_id == null) continue;
        const rewardAmount = participant.rewarded ?? 0;

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

          // 참여자 리워드 상태 변경
          await prisma.survey_Participants.update({
            where: { id: participant.id },
            data: { rewarded: 0 },
          })

          // IPFS 업로드 및 Survey_Result metadata_ipfs 업데이트
          let metadata_ipfs = 'failed';
          try {
            // surveyService가 초기화되어 있고 contract, wallet, provider가 모두 준비된 경우만 실행
            if (
              surveyService &&
              surveyService['contract'] &&
              surveyService['wallet'] &&
              surveyService['provider']
            ) {
              // 설문 응답 데이터 준비 (예시: participant.answers)
              const ipfsResult = await surveyService.submitSurveyAndMint(
                String(participant.user_id),
                String(survey.id),
                JSON.stringify(survey)
              );
              if (ipfsResult && ipfsResult.metadataUri) {
                metadata_ipfs = ipfsResult.metadataUri;
              }
            }
          } catch (e) {
            console.error('IPFS 업로드 실패:', e);
            metadata_ipfs = 'failed';
          }
          // Survey_Result 테이블 업데이트
          await prisma.survey_Result.updateMany({
            where: { survey_id: survey.id },
            data: { metadata_ipfs },
          });

          console.log(
            `리워드 지급 완료: user_id=${participant.user_id}, role=${participant.user ? participant.user.role : 'unknown'}, amount=${rewardAmount}`
          )
        }
      }

      
    }

    if (toOngoing.count > 0 || closedSurveys.length > 0) {
      console.log(
        `[CRON] ${kstNow.toISOString()} | 상태 변경: upcoming→ongoing ${toOngoing.count}건, ongoing→closed ${closedSurveys.length}건`
      )
    }
  } catch (err) {
    console.error('[CRON] 설문 상태 업데이트 오류:', err)
  }
})
