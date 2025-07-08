import { Request, Response, Router } from 'express';
import { TunerContractService } from '../services/tunerContract.service';

const service = new TunerContractService();
const router = Router();

// POST /api/contract - 컨트랙트 정보 저장
export const createContract = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const data = req.body;
    const result = await service.createContract(data);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: '컨트랙트 저장 실패', details: err.message });
  }
};

// GET /api/contract - 최신 컨트랙트 정보 조회
export const getLatestContract = async (_req: Request, res: Response) => {
  console.log("contract1");
  try {
    const result = await service.getLatestContract();
    if (!result) {
      res.status(404).json({ error: '컨트랙트 정보 없음' });
      return;
    }
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: '컨트랙트 조회 실패', details: err.message });
  }
};

export default router; 