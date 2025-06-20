import { 
    JsonRpcProvider, 
    Contract, 
    Wallet,
} from 'ethers';
import contractABI from '../../../ABI/meta_transction_ABI.json' assert { type: 'json' };
import { MetaTransctionService } from './meta_transction.service';
import dotenv from 'dotenv';
dotenv.config();

interface TxMessage {
  sender: string;
  data: string;
}

interface TxPoolItem {
  message: TxMessage;
  signature: string;
}

export class TxPoolService {
    private txpool: TxPoolItem[] = [];
    private provider!: JsonRpcProvider;
    private wallet!: Wallet;
    private msgSigner!: Contract;
    private metaService: MetaTransctionService;

    constructor(metaService: MetaTransctionService) {
        this.metaService = metaService;
    }

    async init(): Promise<void> {
        this.provider = new JsonRpcProvider(process.env.SEPLOIA_RPC_URL!);
        this.wallet = new Wallet(process.env.WALLET_PRIVATE_KEY!, this.provider);
        const contractAddress = process.env.META_CONTRACT_ADDRESS!;
        this.msgSigner = new Contract(contractAddress, contractABI, this.provider).connect(this.wallet) as Contract;
    }

  getPool(): TxPoolItem[] {
    return this.txpool;
  }

  async verifyAndAdd(message: string, uid: string): Promise<TxPoolItem> {
    const singer_wallet = await this.metaService.createWallet(uid);
    const signature = await this.metaService.createSign(singer_wallet, JSON.stringify(message));
    const txData = { message : {sender: singer_wallet.address, data: message}, signature };
    this.txpool.push(txData);
    return txData;
  }

  async processPool(): Promise<any> {
    if (this.txpool.length === 0) return { status: 'empty' };

    const batched = this.txpool.reduce(
      (acc, e) => {
        acc.address.push(e.message.sender);
        acc.data.push(e.message.data);
        acc.msg.push(JSON.stringify(e.message));
        acc.sign.push(e.signature);
        return acc;
      },
      { address: [], data: [], msg: [], sign: [] } as {
        address: string[];
        data: string[];
        msg: string[];
        sign: string[];
      }
    );

    const tx = await this.msgSigner.mint(
      batched.address,
      batched.data,
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
