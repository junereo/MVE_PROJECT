// src/wallet/service/txpool.services.ts
import { 
    JsonRpcProvider, 
    Contract, 
    Wallet,
} from 'ethers';
import { MetaTransctionService } from './meta_transction.service';
import { TunerContractService } from './tunerContract.service';
import dotenv from 'dotenv';
dotenv.config();

interface TxMessage {
  sender: string;
  value: string;
}

interface TxPoolItem {
  user_id: string;
  message: TxMessage;
  signature: string;
}

export class TxPoolService {
    private txpool: TxPoolItem[] = [];
    private provider!: JsonRpcProvider;
    private wallet!: Wallet;
    private msgSigner!: Contract;
    private metaService: MetaTransctionService;
    private tunerContractService = new TunerContractService();

    constructor(metaService: MetaTransctionService) {
        this.metaService = metaService;
    }

    async init(): Promise<void> {
        this.provider = new JsonRpcProvider(process.env.SEPLOIA_RPC_URL!);
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
          throw new Error('No contract address (ca_transac) found in TunerContract table');
        }
        this.msgSigner = new Contract(contractAddress, contractABI, this.provider).connect(this.wallet) as Contract;
    }

  getPool(): TxPoolItem[] {
    return this.txpool;
  }

  async verifyAndAdd(message: string, uid: string): Promise<TxPoolItem> {
    const singer_wallet = await this.metaService.createWallet(uid);
    const messageString = JSON.stringify(message); // 정확히 이 문자열로 서명해야 함

    const signature = await this.metaService.createSign(singer_wallet, messageString);
    const txData = { user_id: uid, message : {sender: singer_wallet.address, value: messageString}, signature };
    this.txpool.push(txData);
    return txData;
  }

  async processPool(): Promise<any> {
    if (this.txpool.length === 0) return { status: 'empty' };

    const batched = this.txpool.reduce(
      (acc, e) => {
        acc.address.push(e.message.sender);
        acc.value.push(e.message.value);
        acc.msg.push(JSON.stringify(e.message));
        acc.sign.push(e.signature);
        return acc;
      },
      { address: [], value: [], msg: [], sign: [] } as {
        address: string[];
        value: string[];
        msg: string[];
        sign: string[];
      }
    );

    const tx = await this.msgSigner.mint(
      batched.address,
      batched.value,
      batched.msg,
      batched.sign
    );

    this.txpool = []; // clear after processing
    return tx;
  }

  clear(): Number {
    const totalNum = this.txpool.length;
    this.txpool = [];
    return totalNum;
  }
}
