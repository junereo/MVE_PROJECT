// src/controllers/survey.routes.ts
import express from 'express';
import { createContract, getLatestContract } from '../controllers/tunerContract.controller';

const router = express.Router();

router.post('/', createContract);
router.get('/', getLatestContract);

export default router;
