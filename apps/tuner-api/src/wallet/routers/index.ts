// src/wallet/routers/index.ts
import express, { Router } from "express";
import walletRoutes from "./wallet.routes";
import txpoolRoutes from "./txpool.routes";
import surveyRoutes from "./survey.routes";
import contractRoutes from "./contract.info.routes";
import withdrawRoutes from "./withdraw.routes";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

// ✅ 공통 인증 미들웨어 적용
router.use('/wallet',  walletRoutes);
router.use('/tx',  txpoolRoutes);
router.use('/survey',  surveyRoutes);
router.use('/ca',  contractRoutes);
router.use('/withdraw',  withdrawRoutes);

export default router;