// src/controllers/txpool.controller.ts
import express, { Request, Response, Router } from 'express';
import { TxPoolService } from '../services/txpool.service.js';
import { MetaTransctionService } from '../services/meta_transction.service.js';

const router: Router = express.Router();

const metaTransctionService = new MetaTransctionService();
const txPoolService = new TxPoolService(metaTransctionService);

await txPoolService.init(); // provider, wallet, contract 초기화

// 1. txpool 조회
export const getTxPool = (req: Request, res: Response) => {
  const pool = txPoolService.getPool();
  res.status(200).json(pool);
};

// 2. message 를 트랜잭션으로 변환 및 pool에 저장
export const txSign = (req: Request, res: Response) => {
  const { message } = req.body;
  const { userId } = req.body.user;
  
  if (!message) {
    res.status(400).json({ error: 'Missing message' });
    return;
  }

  const isValid = txPoolService.verifyAndAdd(message, userId);

  if (!isValid) {
    res.status(401).json({ error: 'Signature verification failed' });
    return;
  } else {
    res.status(200).json({ status: 'Signature verified. Added to txpool.' });
    return;
  }
};

// 3. txpool 처리 (트랜잭션 실행)
export const submit =  async (req: Request, res: Response) => {
  try {
    const result = await txPoolService.processPool();
    res.status(200).json(result);
  } catch (err:any) {
    console.error('TxPool processing error:', err);
    res.status(500).json({ error: 'Failed to process txpool', details: err.message });
  }
};

// 4. txpool 수동 초기화
export const txClear =  (req: Request, res: Response) => {
  txPoolService.clear();
  res.status(200).json({ status: 'TxPool cleared' });
};
