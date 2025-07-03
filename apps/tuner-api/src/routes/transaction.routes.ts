import { Router } from 'express';
import { createTransaction, getUserTransactions } from '../controllers/transaction.controller';

const router = Router();

router.post('/', createTransaction);
router.get('/:userId', getUserTransactions);

export default router;
