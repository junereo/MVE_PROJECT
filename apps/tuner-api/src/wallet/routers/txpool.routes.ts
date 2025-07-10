//src/wallet/routers/txpool.routes.ts
import express, { Router }  from "express";
import { getTxPool,
        txSign,
        submit,
 } from "../controllers/txpool.controller";

const router: Router = express.Router();

router.post('/submit', submit ); // tx 처리

router.post('/sign', txSign ); // 클레임

router.get('/pool', getTxPool);

export default router; 