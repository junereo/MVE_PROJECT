import { Request, Response } from 'express';
import * as withdrawalService from '../services/withdrawal.service';

export const requestWithdrawal = async (req: Request, res: Response) => {
  const { user_id, amount, txhash, status } = req.body;
  try {
    const result = await withdrawalService.createWithdrawalRequest({ user_id, amount, txhash, status });
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserWithdrawals = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const withdrawals = await withdrawalService.getWithdrawalsByUserId(userId);
    res.status(200).json({ success: true, data: withdrawals });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
