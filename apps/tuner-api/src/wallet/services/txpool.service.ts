// src/wallet/service/txpool.services.ts
import { 
    ethers,
    hexlify ,
    getBytes,
    JsonRpcProvider, 
    Contract, 
    Wallet,
} from 'ethers';
import { MetaTransctionService } from './meta_transction.service';
import { TunerContractService } from './tunerContract.service';
import dotenv from 'dotenv';
import { PrismaClient, WithdrawalStatus } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config();

interface TxMessage {
  sender: string;
  value: string;
}

export class TxPoolService {
    private provider!: JsonRpcProvider;
    private wallet!: Wallet;
    private msgSigner!: Contract;
    private metaService: MetaTransctionService;
    private tunerContractService = new TunerContractService();

    constructor(metaService: MetaTransctionService) {
        this.metaService = metaService;
    }

    async init(): Promise<void> {
        this.provider = new JsonRpcProvider(process.env.KAIROS_RPC_URL!);
        this.wallet = new Wallet(process.env.WALLET_PRIVATE_KEY!, this.provider);
        // DB에서 ABI 동적 로드
        const latest = await this.tunerContractService.getLatestContract();
        let contractABI: any[] = [];
        let contractAddress = '';
        if (latest?.abi_transac) {
          if (typeof latest.abi_transac === 'string') {
            contractABI = JSON.parse(latest.abi_transac);
          } else {
            contractABI = latest.abi_transac as any[];
          }
        }
        if (latest?.ca_transac) {
          contractAddress = latest.ca_transac;
        } else {
          console.error('No contract address (ca_transac) found in TunerContract table');
          return; // 또는 적절한 fallback 처리
        }
        this.msgSigner = new Contract(contractAddress, contractABI, this.provider).connect(this.wallet) as Contract;
    }

  async getPool(): Promise<any[]> {
    return prisma.withdrawalRequest.findMany({
      where: { status: 'pending' },
    });
  }

  async verifyAndAdd(message: string, uid: string): Promise<any> {
    const singer_wallet = await this.metaService.createWallet(uid);
    const txMessage: TxMessage = { sender: singer_wallet.address, value: message };
    const messageString = JSON.stringify(txMessage);
    const signature = await this.metaService.createSign(singer_wallet, messageString);

    // 차감할 금액
    const amount = Number(message);

    const user = await prisma.user.findUnique({ where: { id: Number(uid) } });
    if (!user || user.balance < amount) {
      throw new Error('잔액이 부족합니다.');
    }

    // 트랜잭션으로 withdrawalRequest 생성 + balance 차감
    const [withdrawal] = await prisma.$transaction([
      prisma.withdrawalRequest.create({
        data: {
          user_id: Number(uid),
          amount: amount,
          status: 'pending',
          txhash: '',
          message: messageString,
          signature: signature,
        },
      }),
      prisma.user.update({
        where: { id: Number(uid) },
        data: {
          balance: {
            decrement: amount * 1000, // balance에서 amount만큼 차감
          },
        },
      }),
    ]);

    // 필요하다면 withdrawal 정보 반환
    return withdrawal;
  }

  async getPoolByStatus(status?: string): Promise<any[]> {
    const where = status && status !== 'all'
      ? { status: status as WithdrawalStatus }
      : {};
    return prisma.withdrawalRequest.findMany({
      where,
      orderBy: { requested_at: 'desc' },
    });
  }

  async processPool(): Promise<any> {
    // pending만 불러오기
    const pendingWithdrawals = await prisma.withdrawalRequest.findMany({
      where: { status: 'pending' },
    });

    if (pendingWithdrawals.length === 0) return { status: 'empty' };

    // WithdrawalRequest에 필요한 정보(message, signature 등)가 저장되어 있다고 가정
    // 만약 없다면 별도 테이블/컬럼 추가 필요

    // 예시: message, signature 컬럼이 WithdrawalRequest에 있다고 가정
    const batched = pendingWithdrawals.reduce(
      (acc, w) => {
        // message, signature 컬럼이 WithdrawalRequest에 있어야 함
        const txMessage: TxMessage = JSON.parse(w.message);
        acc.address.push(txMessage.sender);
        acc.value.push(ethers.parseUnits(txMessage.value, 18));
        acc.msg.push(w.message);
        acc.sign.push(getBytes(w.signature));
        return acc;
      },
      { address: [], value: [], msg: [], sign: [] } as {
        address: string[];
        value: bigint[];
        msg: string[];
        sign: Uint8Array[];
      }
    );

    try {
      const tx = await this.msgSigner.mint(
        batched.address,
        batched.value,
        batched.msg,
        batched.sign
      );
      // 성공 시 업데이트
      for (const w of pendingWithdrawals) {
        await prisma.withdrawalRequest.update({
          where: { id: w.id },
          data: { status: 'completed', txhash: tx.hash },
        });
      }
      return tx;
    } catch (err) {
      // 실패 시 업데이트
      for (const w of pendingWithdrawals) {
        await prisma.withdrawalRequest.update({
          where: { id: w.id },
          data: { status: 'failed', txhash: (err as any).hash || '' },
        });
      }
      throw err;
    }
  }
}
