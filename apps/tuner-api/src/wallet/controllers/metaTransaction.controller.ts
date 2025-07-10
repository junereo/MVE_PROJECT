// src/controllers/metaTransaction.controller.ts
import express, { Request, Response, Router } from 'express';
import { MetaTransctionService } from '../services/meta_transction.service.js';
import { ethers } from "ethers";

const router: Router = express.Router();
const metaTransctionService = new MetaTransctionService();

await metaTransctionService.init(); // provider, signer 초기화

// 유저 지갑 생성
export const createWallet = async (req: Request, res: Response) => {
  const { uid } = req.body as { uid: string };
  console.log(uid);
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    console.log(wallet);
    res.json({ address: wallet.address });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
 
// 토큰 생성 관리자 -> 유저
export const createToken = async (req: Request, res: Response) => {
  const { uid, value } = req.body as { uid: string; value: string };

  try {
    const wallet = await metaTransctionService.createWallet(uid);
    const address = wallet.address;
    const txMessage = { sender: address, value };
    const messageString = JSON.stringify(txMessage); // 정확히 이 문자열로 서명해야 함

    const sign = await metaTransctionService.createSign(wallet, messageString);
    console.log("txMessage", txMessage); // 132여야 정상
    console.log("JSON.stringify(txMessage)", JSON.stringify(txMessage)); // 132여야 정상

    const result = await metaTransctionService.createKGTToken(address, value, messageString, sign);

    console.log("result", result );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 토큰 조회
export const getAddressToken = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const wallet = await metaTransctionService.createWallet(uid);
    const address = wallet.address;
    const token = (await metaTransctionService.getKGTToken(address)).toString();
    res.json({ token });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// 뱃지 조회
export const getAddressBadge = async (req: Request, res: Response) => {
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
  const { uid, to, value } = req.body as {
    uid: string;
    to: string;
    value: number;
  };
  console.log(uid, to, value);
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
    const sign = await metaTransctionService.createSign(
      wallet,
      JSON.stringify(txMessage)
    );

    const result = await metaTransctionService.sendKGTToken(
      sender,
      recipient,
      value,
      txMessage,
      sign
    );
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
    const sign = await metaTransctionService.createSign(
      wallet,
      JSON.stringify(txMessage)
    );

    const result = await metaTransctionService.useKGTToken(sender, value, txMessage, sign);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// TunerToken approve
export const approveTunerToken = async (req: Request, res: Response) => {
  const { spender, tokenAddress, amount } = req.body as { spender: string; tokenAddress: string; amount?: string };
  try {
    const result = await metaTransctionService.approveTunerToken(spender, tokenAddress, amount);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// TunerToken revoke approve
export const revokeTunerToken = async (req: Request, res: Response) => {
  const { spender, tokenAddress } = req.body as { spender: string; tokenAddress: string };
  try {
    const result = await metaTransctionService.revokeTunerToken(spender, tokenAddress);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// TunerToken allowance 조회
export const getAllowance = async (req: Request, res: Response) => {
  const { owner, spender, tokenAddress } = req.body as { owner: string; spender: string; tokenAddress: string };
  try {
    const allowance = await metaTransctionService.getAllowance(owner, spender, tokenAddress);
    res.json({ allowance });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default router;
