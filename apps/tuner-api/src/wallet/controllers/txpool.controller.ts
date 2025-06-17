import express, { Request, Response, Router } from 'express';
import { TxPoolService } from '../services/txpool.service.js';

const router: Router = express.Router();

export class TxPoolController {
  private txPoolService: TxPoolService;

  constructor(txPoolService: TxPoolService) {
    this.txPoolService = txPoolService;
    this.routes();
  }

  public routes(): void {
    router.get('/', this.getTxPool.bind(this));
    router.post('/sign', this.signTx.bind(this));
    router.post('/process', this.processTx.bind(this));
  }

  private getTxPool(req: Request, res: Response): void {
    const pool = this.txPoolService.getPool();
    res.json(pool);
  }

  private signTx(req: Request, res: Response): void {
    const { message, signature } = req.body;
    const isValid = this.txPoolService.verifyAndAdd(message, signature);
    if (isValid) {
      res.json({ status: 'tx added' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  }

  private async processTx(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.txPoolService.processPool();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public getRouter(): Router {
    return router;
  }
}
