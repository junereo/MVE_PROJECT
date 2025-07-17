// src/controllers/txpool.controller.ts
import express, { Request, Response, Router } from 'express';
import { TxPoolService } from '../services/txpool.service.js';
import { MetaTransctionService } from '../services/meta_transction.service.js';
import { updateWithdrawStatus } from '../services/withdraw.service';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: {
    userId: number;
    nickname?: string;
  };
}

const metaTransctionService = new MetaTransctionService();
const txPoolService = new TxPoolService(metaTransctionService);

await txPoolService.init(); // provider, wallet, contract 초기화

// 1. txpool 조회
// apps/tuner-api/src/wallet/controllers/txpool.controller.ts

export const getTxPool = async (req: Request, res: Response) => {

  try {
    const { status } = req.query;
    console.log("status", status)
    const pool = await txPoolService.getPoolByStatus(status as string);
    res.status(200).json(pool);
  } catch (err) {
    res.status(500).json({ error: 'TxPool 조회 실패', details: (err as any).message });
  }
};
// 2. message 를 트랜잭션으로 변환 및 pool에 저장
export const txSign = async(req: Request, res: Response):Promise<void> => {
  const { message, uid } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Missing message' });
    return;
  }

  const divMessage = (Number(message) / 1000).toString();
  
  const isValid = await txPoolService.verifyAndAdd(divMessage, String(uid));
  console.log(isValid)


  if (!isValid) {
    res.status(401).json({ error: 'failed to txpool' });
    return;
  } else {
    res.status(200).json({ status: 'Added to txpool.' });
    return;
  }
};

// 3. txpool 처리 (트랜잭션 실행)
export const submit = async (req: Request, res: Response) => {
  try {
    // 트랜잭션 처리
    const result = await txPoolService.processPool();
    // 트랜잭션 결과에서 user_id, txhash 추출 (예시)
    // 실제 result 구조에 따라 아래를 수정해야 함
    // 예: result = { user_id, hash }
    if (result && result.hash && result.user_id) {
      await updateWithdrawStatus(Number(result.user_id), 'completed', result.hash);
    }
    res.status(200).json(result);
  } catch (err:any) {
    // 실패 시 user_id, txhash가 있다면 failed로 업데이트
    if (err && err.user_id && err.hash) {
      await updateWithdrawStatus(Number(err.user_id), 'failed', err.hash);
    }
    console.error('TxPool processing error:', err);
    res.status(500).json({ error: 'Failed to process txpool', details: err.message });
  }
};
