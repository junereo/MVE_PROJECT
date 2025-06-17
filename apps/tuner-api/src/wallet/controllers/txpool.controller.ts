//txpool.controllers.ts
import express, { Request, Response, Router } from 'express';
import { MetaTransctionService } from '../services/meta_transction.service.js';
const { ethers, Wallet } = require("ethers");

const router: Router = express.Router();

// 임시 풀 만듬
let txpool : any = [];

// txpool 조회 (지금 쌓여있는 트랜잭션 작업들이 뭐가있지?)
export const getTxPool = (req : Request, res: Response) => {
  res.json(txpool);
};

// txpool에 트랜잭션 객체를 추가
export const sign = (req : Request, res: Response) => {
  // 요청 메시지의 내용과 그사람이 이 메시지를 보낸게 맞는지? 메세지와 개인키로 만든 서명도 받자.
  const { message, signature } = req.body;
  // 검증 이사람이 요청을 보낸게 맞는지 서명 검증.
  const senderSigner = ethers.verifyMessage(JSON.stringify(message), signature);
  // r s v
  console.log(senderSigner);
  // 서명 검증 해서 pool
  if (message.sender === senderSigner) {
    txpool.push({ message, signature });
    res.json("txpool push");
  } else {
    res.json("error");
  }
};

// txpool에 있는 트랜잭션 작업 목록 처리
export const metaTransction = async (req : Request, res: Response) => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(myPrikey, provider);
  const contractAddress = "0x98391c501f1F3Ce8906a3bcaFB5EC3B49E85A5B3";
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  // web3 from과 서명 추가 했는데
  const msgSigner = contract.connect(wallet);

  // 리듀서로 편하게 작업해보자.
  // reduce 무척 잘쓰면 편하다.
  // callback의 인자값 첫번째 유지될값 반환된 값
  // 두번째 현재 순회하는 인자값 배열의 값이 순서대로 들어온다.
  // 세번째는 인덱스
  // reduce 두번째로 전달하는 매개변수는 초기값
  const txPoolArr = txpool.reduce(
    (acc, e) => {
      acc.address.push(e.message.sender);
      acc.data.push(e.message.data);
      acc.msg.push(JSON.stringify(e.message));
      acc.sign.push(e.signature);
      return acc;
    },
    { address: [], data: [], msg: [], sign: [] }
  );

  const _tx = await msgSigner.mint(txPoolArr.address, txPoolArr.data, txPoolArr.msg, txPoolArr.sign);
  txpool = [];
  res.send(_tx);
};