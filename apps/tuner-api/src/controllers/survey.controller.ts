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
} from "../services/survey.service";
import { PrismaClient, QuestionType } from "@prisma/client";
const prisma = new PrismaClient();

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
    const userId = req.user?.userId as string; // 사용자 ID를 가져옵니다.
    //const userId = parseInt(req.body.user_id);
    const user_Id = parseInt(userId);
    const data = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "로그인이 필요합니다." });
      return;
    }

    console.log("설문 생성 요청 데이터:", data);

    const survey = await createSurvey({
      userId: user_Id,
      body: data,
    });

    res.status(201).json({ success: true, data: survey });
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
      res.status(200).json({ success: true, data: allSurveys });
      return;
    }

    // 특정 설문 상세 조회
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

    res.status(200).json({ success: true, data: survey });
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
): Promise<void> => {
  try {
    const { survey_id, answers, isSubmit, user_info } = req.body;
    const user_id = req.user?.userId;

    if (!user_id || !survey_id || !answers) {
      res.status(400).json({ message: "user_id, survey_id, answers는 필수입니다." });
      return;
    }

    // ✅ 최초 참여라면 user_info 필수로 받음
    const newParticipant = await createSurveyParticipant({
      user_id: parseInt(user_id),
      survey_id: parseInt(survey_id),
      answers,
      isSubmit,
<<<<<<< HEAD
      user_info, // 🟢 무조건 서비스에 넘긴다!
=======
      user_info
>>>>>>> main
    });

    res.status(201).json({ success: true, data: newParticipant });
  } catch (err: any) {
    console.error("설문 응답 생성 오류:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "응답 생성 실패" });
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

export const getSurveyResultHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const surveyId = Number(req.params.surveyId);
  if (isNaN(surveyId)) {
    res.status(400).json({ message: "잘못된 surveyId" });
    return;
  }

  try {
    const result = await getSurveyResult(surveyId);

    if (!result) {
      res
        .status(404)
        .json({ message: "해당 설문의 결과가 존재하지 않습니다." });
      return;
    }

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    console.error("Survey Result 조회 실패:", err);
    res.status(500).json({ message: "결과 조회 실패", error: err.message });
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