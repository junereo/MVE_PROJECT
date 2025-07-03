import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';

export const createTransaction = async (req: Request, res: Response) => {
  const { user_id, type, amount, memo } = req.body;
  try {
    const result = await transactionService.createTransaction({ user_id, type, amount, memo });
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserTransactions = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const transactions = await transactionService.getTransactionsByUserId(userId);
    res.status(200).json({ success: true, data: transactions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
