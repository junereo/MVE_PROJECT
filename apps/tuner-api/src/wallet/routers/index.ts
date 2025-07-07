// src/wallet/routers/index.ts
import express, { Router } from "express";
import walletRoutes from "./wallet.routes";
import txpoolRoutes from "./txpool.routes";
import surveyRoutes from "./survey.routes";
import contractRoutes from "./contract.info.routes";
import { verifyToken } from "../middlewares/auth.middleware";
import { Prisma } from '@prisma/client';

const router: Router = express.Router();

// ✅ 공통 인증 미들웨어 적용
router.use('/wallet',  walletRoutes);
router.use('/tx',  txpoolRoutes);
router.use('/survey',  surveyRoutes);
router.use('/ca',  contractRoutes);

export default router;

export type TunerContract = {
  id: number;
  ca_token?: string | null;
  ca_badge?: string | null;
  ca_survey?: string | null;
  ca_transac?: string | null;
  abi_survey?: Prisma.JsonValue | null;
  abi_transac?: Prisma.JsonValue | null;
  created_at: Date;
  updated_at: Date;
};
