import { Request, Response } from 'express';
import { createWithdraw, findWithdrawByUserId } from '../services/withdraw.service';
import { TxPoolService } from '../services/txpool.service';
import { MetaTransctionService } from '../services/meta_transction.service';

const metaTransctionService = new MetaTransctionService();
const txPoolService = new TxPoolService(metaTransctionService);

(async () => { await txPoolService.init(); })();

export const postWithdraw = async (req: Request, res: Response) => {
  try {
    const { user_id, amount, txhash } = req.body;
    if (!user_id || !amount || !txhash) {
      res.status(400).json({ message: 'user_id, amount, txhash are required' });
      return;
    }
    const result = await createWithdraw(user_id, amount, txhash);
    // 출금 요청 후 txpool에 추가
    await txPoolService.verifyAndAdd(String(amount), String(user_id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
};

export const getWithdrawByUserId = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.params.user_id);
    if (!user_id) {
       res.status(400).json({ message: 'user_id is required' });
       return;
    }
    const result = await findWithdrawByUserId(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
}; 