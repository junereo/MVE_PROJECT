import { Router } from 'express';
import { createTransaction, getUserTransactions } from '../controllers/transaction.controller';

const router = Router();

router.post('/', createTransaction); // Create a new transaction
router.get('/:userId', getUserTransactions); // Get transactions for a specific user

export default router;
