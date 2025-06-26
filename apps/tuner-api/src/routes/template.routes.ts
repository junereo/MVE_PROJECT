import express from 'express';
import { createTemplateHandler } from "../controllers/template.controller"
const router = express.Router();

// 목록
// router.get('/');
// 상세
// router.get('/:templateId');
// 생성
router.post('/', createTemplateHandler);
// 수정
// router.put('/:templateId');
// 삭제
// router.delete('/:templateId');


export default router;