//txpool.routes.ts
import express, { Router }  from "express";
import { getTxPool,
        txSign,
        submit,
        txClear
 } from "../controllers/txpool.controller";

const router: Router = express.Router();

router.post('/txpool/submit', submit ); // 유저 지갑 생성

router.post('/sign', txSign ); // 토큰 생성

router.get('/getTxPool', getTxPool ); // 토큰 조회

router.get('/clear', txClear ); // 토큰 조회

export default router; 