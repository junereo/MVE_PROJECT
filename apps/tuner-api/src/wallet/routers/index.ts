// src/wallet/routers/index.ts
import express, { Router } from "express";
import walletRoutes from "./wallet.routes";
import txpoolRoutes from "./txpool.routes";
import surveyRoutes from "./survey.routes";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

// ✅ 공통 인증 미들웨어 적용
router.use('/wallet', verifyToken, walletRoutes);
router.use('/tx', verifyToken, txpoolRoutes);
router.use('/survey', verifyToken, surveyRoutes);

export default router;
