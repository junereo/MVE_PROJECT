import express from 'express';
import { postWithdraw, getWithdrawByUserId } from '../controllers/withdraw.controller';

const router = express.Router();

router.post('/', postWithdraw);
router.get('/:user_id', getWithdrawByUserId);

export default router; 