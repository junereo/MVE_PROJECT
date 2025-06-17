import express, { Router }  from "express";
import { getTxPool,
        sign,
        metaTransction
 } from "../controllers/txpool.controller";

const router: Router = express.Router();

router.post('/metaTransction', metaTransction ); // 유저 지갑 생성

router.post('/sign', sign ); // 토큰 생성

router.get('/getTxPool', getTxPool ); // 토큰 조회

export default router; 