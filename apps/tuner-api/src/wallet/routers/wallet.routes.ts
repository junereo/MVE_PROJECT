//src/wallet/routers/wallet.routes.ts
import express, { Router }  from "express";
import { createWallet, 
        createToken, 
        getAddressToken,
        getAddressBadge,
        sendToken, 
        burnToken,
        approveTunerToken,
        revokeTunerToken,
        getAllowance } from "../controllers/metaTransaction.controller";

const router: Router = express.Router();

router.post('/', createWallet ); // 유저 지갑 생성

router.post('/token', createToken ); // 토큰 생성

router.get('/token/:uid', getAddressToken ); // 토큰 조회

router.get('/badge/:uid', getAddressBadge ); // 뱃지 조회

router.put('/token', sendToken); // 토큰 전송

router.delete('/token', burnToken); // 토큰 사용

router.post('/approve', approveTunerToken); // 토큰 approve
router.post('/revoke', revokeTunerToken); // 토큰 approve 해제
router.post('/allowance', getAllowance); // allowance 조회

export default router; 