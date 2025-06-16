import express, { Request, Response, Router } from 'express';
import { MetaTransctionService } from '../services/meta_transction.service.js';

const router: Router = express.Router();
const metaTransctionService = new MetaTransctionService();

await metaTransctionService.init(); // provider, signer 초기화

// 유저 지갑 생성
export const createWallet =  async (req: Request, res: Response) => {
  const { uid } = req.body as { uid: string };
  console.log(uid);
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    res.json({ address: wallet.address });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
 
// 토큰 생성
export const createToken = async (req: Request, res: Response) => {
  const { uid, value } = req.body as { uid: string; value: string };
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    const address = wallet.address;
    const txMessage = { sender: address, value };

    const sign = await metaTransctionService.createSign(wallet, JSON.stringify(txMessage));
    console.log("sign", sign);
    const result = await metaTransctionService.createKGTToken(address, value, txMessage, sign);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 토큰 조회
export const getAddressToken =  async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    const address = wallet.address;
    const token = (await metaTransctionService.getKGTToken(address)).toString();

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 뱃지 조회
export const getAddressBadge =  async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    const address = wallet.address;
    const token = (await metaTransctionService.getKGTBadge(address)).toString();

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 토큰 전송
export const sendToken = async (req: Request, res: Response) => {
  const { uid, to, value } = req.body as { uid: string; to: string; value: number };
  console.log(uid, to , value);
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    const sender = wallet.address;

    const balance = await metaTransctionService.getKGTToken(sender);
    if (balance <= 0 || balance < value) {
      res.status(400).json({
        error: `Check your balance. Your balance: ${balance}, transfer amount: ${value}`,
      });
      return;
    }

    const recipient = (await metaTransctionService.createWallet(to)).address;
    const txMessage = { sender, data: recipient, value: value.toString() };
    const sign = await metaTransctionService.createSign(wallet, JSON.stringify(txMessage));

    const result = await metaTransctionService.sendKGTToken(sender, recipient, value, txMessage, sign);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 토큰 사용
export const burnToken = async (req: Request, res: Response) => {
  const { uid, value } = req.body as { uid: string; value: number };
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    const sender = wallet.address;

    const balance = await metaTransctionService.getKGTToken(sender);
    if (balance <= 0 || balance < value) {
       res.status(400).json({
        error: `Check your balance. Your balance: ${balance}, use amount: ${value}`,
        
      });
      return;
    }

    const data = JSON.stringify({ sender, value });
    const txMessage = { sender, data, value: value.toString() };
    const sign = await metaTransctionService.createSign(wallet, JSON.stringify(txMessage));

    const result = await metaTransctionService.useKGTToken(sender, value, txMessage, sign);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default router;
