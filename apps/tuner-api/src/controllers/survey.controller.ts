import { Request, Response } from "express";
import {
  createSurvey,
  getSurveyListService,
  updateSurveyService,
  setSurveyQuestion,
  getSurveyQuestions,
  createSurveyParticipant,
  getAllSurveyParticipants,
  getSurveyResult,
  createSurveyResult,
  getSurveyQuestion,
  updateSurveyResponse,
  terminateSurvey,
} from "../services/survey.service";
import { calculateSurveyResult } from "../services/survey.result.service";
import { PrismaClient, QuestionType, SurveyStatus } from "@prisma/client";
import { MetaTransctionService } from "../wallet/services/meta_transction.service";
const prisma = new PrismaClient();
const metaTransctionService = new MetaTransctionService();

// MetaTransctionService 초기화
(async () => {
  await metaTransctionService.init();
})();

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    nickname?: string;
  };
  admin?: {
    adminId: string;
    email?: string;
    name?: string;
  };
}

export const createSurveyHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    //const userId = parseInt(req.body.user_id);
    const user_Id = parseInt(userId);
    const data = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "로그인이 필요합니다." });
      return;
    }

    console.log("설문 생성 요청 데이터:", data);

    // reward_amount가 있는지 확인
    if(data.official){
      if (!data.reward_amount || data.reward_amount <= 0){
        res.status(400).json({ success: false, message: "reward_amount는 필수이며0커야 합니다." });
        return;
      }
    }

    const excute : boolean = process.env.SURVEY_CONNECT_BLOCKCHAIN === "true" ? true : false;
    if(excute){
      // 1. 사용자 지갑 생성
      const wallet = await metaTransctionService.createWallet(userId);
      const userAddress = wallet.address;

      // 2토큰 잔액 확인
      const currentBalance = await metaTransctionService.getKGTToken(userAddress);
      console.log(`현재 잔액: ${currentBalance}, 필요 금액: ${data.reward_amount}`);

      // 3. 잔액이 부족한 경우 에러 반환
      if (currentBalance < (data.reward_amount / 1000)) {
        res.status(400).json({
          success: false,
          message: `토큰 잔액이 부족합니다. 현재 잔액: ${currentBalance}, 필요 금액: ${(data.reward_amount / 1000)}`
        });
        return;
      }

      // 4 토큰 출금 (시스템 지갑으로 전송)
      const systemWallet = await metaTransctionService.createWallet("owner");
      const systemAddress = systemWallet.address;
      const txMessage = { sender: userAddress, data: systemAddress, value: (data.reward_amount / 1000).toString() };
      const sign = await metaTransctionService.createSign(
        wallet,
        JSON.stringify(txMessage)
      );

      console.log("txMessage", txMessage);

      const transferResult = await metaTransctionService.sendKGTToken(
        userAddress,
        systemAddress,
        (data.reward_amount / 1000),
        txMessage,
        sign
      );

      console.log("토큰 출금 완료:", transferResult);

      // 5. 출금 내역을 WithdrawalRequest에 기록
      const withdrawalRequest = await prisma.withdrawalRequest.create({
        data: {     user_id: user_Id,
          amount: data.reward_amount,
          txhash: transferResult?.hash || "unknown",
          message: JSON.stringify(txMessage),
          signature: sign,
          status: "completed"
        }
      });

      console.log("출금 내역 기록 완료:", withdrawalRequest.id);
    }

    // 6성
    const survey = await createSurvey({
      userId: user_Id,
      body: data,
    });


    res.status(201).json({ 
      success: true, 
      data: survey,
    });
  } catch (err: any) {
    console.error("설문 생성 실패:", err);
    res.status(500).json({
      success: false,
      message: "설문 생성 실패",
      error: err.message || err,
    });
  }
};

export const createSurveyQuestionHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      surveyQuestionId,
      question_type,
      question,
      question_order,
    }: {
      surveyQuestionId: number;
      question_type: QuestionType;
      question: object;
      question_order: number;
    } = req.body;

    const surveyQuestion = await setSurveyQuestion({
      surveyQuestionId: surveyQuestionId,
      questionType: question_type,
      question,
      order: question_order,
    });
    console.log("설문지 생성 완료 :", req.body);

    res.status(201).json(surveyQuestion);
  } catch (err) {
    console.error("설문지 생성 실패:", err);
    res.status(500).json({ message: "설문지 생성 실패", error: err });
  }
};

export const getSurveyList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const surveys = await getSurveyListService();
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: "설문 목록 조회 실패", error: err });
  }
};

export const getSurvey = async (req: Request, res: Response): Promise<void> => {
  const surveyId = Number(req.params.surveyId);

  if (isNaN(surveyId)) {
    res.status(400).json({ message: "유효하지 않은 surveyId입니다." });
    return;
  }

  try {
    if (surveyId === 0) {
      const allSurveys = await prisma.survey.findMany({
        orderBy: { created_at: "desc" },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                  role: true,
                },
              },
            },
          },
          result: true,
          creator: { select: { id: true, nickname: true, role: true } },
        },
      });

      // 각 survey별로 rest_amount 계산
      const surveysWithRestAmount = allSurveys.map((survey) => {
        // 참여자별 리워드 합산
        let totalReward = 0;
        survey.participants.forEach((participant) => {
          if (participant.user?.role === "ordinary") {
            totalReward += survey.reward ?? 0;
          } else if (participant.user?.role === "expert") {
            totalReward += survey.expert_reward ?? 0;
          }
        });
        // 남은 리워드 계산
        const rest_amount = (survey.reward_amount ?? 0) - totalReward;
        return {
          ...survey,
          rest_amount,
        };
      });

      res.status(200).json({ success: true, data: surveysWithRestAmount });
      return;
    }

    // 특정 설문 상세 조회 rest_amount 계산
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                role: true,
              },
            },
          },
        },
        creator: { select: { id: true, nickname: true, role: true } },
        result: true,
      },
    });

    if (!survey) {
      res.status(404).json({ message: "설문을 찾을 수 없습니다." });
      return;
    }

    // rest_amount 계산
    let totalReward = 0;
    survey.participants.forEach((participant: any) => {
      if (participant.user?.role === "ordinary") {
        totalReward += survey.reward ?? 0;
      } else if (participant.user?.role === "expert") {
        totalReward += survey.expert_reward ?? 0;
      }
    });
    const rest_amount = (survey.reward_amount ?? 0) - totalReward;

    res.status(200).json({ success: true, data: { ...survey, rest_amount } });
    return;
  } catch (err: any) {
    console.error("설문 조회 실패:", err);
    res
      .status(500)
      .json({ message: "설문 조회 중 오류 발생", error: err.message });
  }
};

export const getSurveyQuestionList = async (
  req: Request,
  res: Response
): Promise<void> => {
  const questionnaireId = Number(req.params.questionnaireId);

  if (isNaN(questionnaireId)) {
    res.status(400).json({ message: "유효하지 않은 설문 ID입니다." });
    return;
  }

  try {
    const questions = await getSurveyQuestions(questionnaireId);
    res.status(200).json({ success: true, data: questions });
  } catch (err: any) {
    console.error("질문 목록 조회 실패:", err);
    res.status(500).json({
      success: false,
      message: "질문 목록 조회 실패",
      error: err.message,
    });
  }
};

// POST /survey-participants
export const createSurveyParticipantHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { survey_id, answers, status, user_info } = req.body;
    const user_id = req.user?.userId;

    if (!user_id || !survey_id || !answers) {
      res
        .status(400)
        .json({ message: "user_id, survey_id, answers는 필수입니다." });
      return;
    }

    const newParticipant = await createSurveyParticipant({
      user_id: parseInt(user_id),
      survey_id: parseInt(survey_id),
      answers,
      status,
      user_info,
    });

    res.status(201).json({ success: true, data: newParticipant });
  } catch (err: any) {
    console.error("설문 응답 생성 오류:", err);
    res
      .status(500)
      .json({ success: false, message: "응답 생성 실패", error: err.message });
  }
};

// GET /survey-participants
export const getAllSurveyParticipantsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const allParticipants = await getAllSurveyParticipants();
    res.status(200).json({ success: true, data: allParticipants });
  } catch (err: any) {
    console.error("설문 응답 조회 오류:", err);
    res
      .status(500)
      .json({ success: false, message: "응답 조회 실패", error: err.message });
  }
};

export const updateSurvey = async (
  req: Request,
  res: Response
): Promise<void> => {
  const surveyId = Number(req.params.surveyId);
  console.log("surveyId:", surveyId);
  console.log("req.body:", req.body);

  const body = req.body;
  if (!body || Object.keys(body).length === 0) {
    console.error("요청 본문이 비어 있습니다");
    res.status(400).json({ message: "요청 데이터가 없습니다." });
    return;
  }

  try {
    const updatedSurvey = await updateSurveyService(surveyId, body);
    res.status(200).json({ success: true, data: updatedSurvey });
  } catch (err: any) {
    console.error("설문 수정 실패:", err);
    res
      .status(500)
      .json({ success: false, message: "설문 수정 실패", error: err.message });
  }
};

export const createSurveyResultHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      survey_id,
      survey_statistics,
      is_public,
      version,
      metadata_ipfs,
      respondents,
      reward_claimed_amount,
      reward_claimed,
    } = req.body;

    const result = await createSurveyResult({
      survey_id,
      survey_statistics,
      is_public,
      version,
      metadata_ipfs,
      respondents,
      reward_claimed_amount,
      reward_claimed,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    console.error("Survey Result 생성 실패:", err);
    res.status(500).json({ message: "결과 생성 실패", error: err.message });
  }
};

export const getSurveyResultHandler = async (req: Request, res: Response) => {
  try {
    const surveyId = Number(req.params.surveyId);
    if (isNaN(surveyId)) {
      res.status(400).json({ success: false, message: "잘못된 surveyId" });
      return;
    }

    const result = await getSurveyResult(surveyId);

    if (!result) {
      res.status(404).json({ success: false, message: "통계 결과 없음" });
      return;
    }

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    console.error("[getSurveyResultHandler]", err);
    res
      .status(500)
      .json({ success: false, message: "결과 조회 실패", error: err.message });
  }
};

export const getSurveyQuestionController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const surveyId = Number(req.params.surveyId);
    const userId = Number(req.user?.userId);

    if (isNaN(surveyId) || isNaN(userId)) {
      res.status(400).json({ message: "잘못된 요청" });
      return;
    }

    const result = await getSurveyQuestion({ surveyId, userId });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "서버 오류" });
  }
};

// 사용자 1명의 설문 참여 내역 조회
export const getMySurvey = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.userId);

    if (isNaN(userId)) {
      res.status(401).json({ success: false, message: "로그인이 필요합니다." });
      return;
    }

    const participations = await prisma.survey_Participants.findMany({
      where: { user_id: userId },
      include: {
        survey: {
          include: {
            creator: { select: { id: true, nickname: true } },
            result: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json({ success: true, data: participations });
  } catch (err: any) {
    console.error("내 설문 참여 내역 조회 실패:", err);
    res.status(500).json({
      success: false,
      message: "내 설문 참여 내역 조회 실패",
      error: err.message,
    });
  }
};

export const calculateSurveyResultHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const surveyId = Number(req.params.surveyId);
    console.log("surveyId:", surveyId);
    if (isNaN(surveyId)) {
      res.status(400).json({ success: false, message: "잘못된 surveyId" });
      return;
    }

    const result = await calculateSurveyResult(surveyId);

    res
      .status(200)
      .json({
        success: true,
        message: `${req.params.surveyId} 통계 계산 완료`,
        data: result,
      });
  } catch (err: any) {
    console.error("[calculateSurveyResultHandler]", err);
    res
      .status(500)
      .json({
        success: false,
        message: `${req.params.surveyId} 통계 계산 실패`,
        error: err.message,
      });
  }
};

export const updateSurveyResponseHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { surveyId, answers, status } = req.body;

    if (!userId || !surveyId || !answers) {
      res.status(400).json({ success: false, message: "필수 파라미터 누락" });
      return;
    }

    const result = await updateSurveyResponse({
      userId: Number(userId),
      surveyId: Number(surveyId),
      answers,
      status: status || SurveyStatus.draft,
    });

    if (result.count === 0) {
      res.status(404).json({ success: false, message: "참여자 정보 없음" });
      return;
    }

    res.json({
      success: true,
      message: "설문 응답 수정 완료!",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "서버 오류", error });
    return;
  }
};

// PUT /terminationSurvey
export const terminateSurveyHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const surveyId = Number(req.params.surveyId);
    console.log("surveyId:", surveyId);
    await terminateSurvey(surveyId);
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("설문 종료 오류:", err);
    res
      .status(500)
      .json({ success: false, message: "설문 종료 실패", error: err.message });
  }
};