import { Router } from 'express';
import { requestWithdrawal, getUserWithdrawals } from '../controllers/withdrawal.controller';

const router = Router();

router.post('/', requestWithdrawal);
router.get('/:userId', getUserWithdrawals);

export default router;
