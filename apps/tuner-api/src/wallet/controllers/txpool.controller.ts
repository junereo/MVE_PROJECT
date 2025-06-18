// src/controllers/txpool.controller.ts
import express, { Request, Response, Router } from 'express';
import { TxPoolService } from '../services/txpool.service.js';

const router: Router = express.Router();
const txPoolService = new TxPoolService();

await txPoolService.init(); // provider, wallet, contract 초기화

// 1. txpool 조회
export const getTxPool = (req: Request, res: Response) => {
  const pool = txPoolService.getPool();
  res.status(200).json(pool);
};

// 2. txpool에 트랜잭션 객체 추가 (검증 포함)
export const txSign = (req: Request, res: Response) => {
  const { message, signature } = req.body;

  if (!message || !signature) {
    res.status(400).json({ error: 'Missing message or signature' });
    return;
  }

  const isValid = txPoolService.verifyAndAdd(message, signature);
  if (isValid) {
    res.status(200).json({ status: 'Signature verified. Added to txpool.' });
    return;
  } else {
    res.status(401).json({ error: 'Signature verification failed' });
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
