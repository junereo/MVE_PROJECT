import { Router } from 'express';
import { requestWithdrawal, getUserWithdrawals } from '../controllers/withdrawal.controller';

const router = Router();

router.post('/', requestWithdrawal); // Request a withdrawal
router.get('/:userId', getUserWithdrawals); // Get withdrawals for a specific user

export default router;
