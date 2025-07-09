// src/wallet/service/meta_transaction.services.ts
import {
  Wallet,
  JsonRpcProvider,
  Contract,
  keccak256,
  toUtf8Bytes,
  formatUnits,
  BigNumberish,
} from "ethers";
import { TunerContractService } from "./tunerContract.service";
import dotenv from "dotenv";
dotenv.config();

export class MetaTransctionService {
  provider!: JsonRpcProvider;
  wallet!: Wallet;
  contract!: Contract;
  msgSigner!: Contract;
  private tunerContractService = new TunerContractService();

  constructor() {
    // init은 반드시 호출되어야 함
  }

  async init(): Promise<void> {
    this.provider = new JsonRpcProvider(`${process.env.SEPLOIA_RPC_URL}`);

    this.wallet = new Wallet(process.env.WALLET_PRIVATE_KEY!, this.provider);
    // DB에서 ABI 및 contract address 동적 로드
    const latest = await this.tunerContractService.getLatestContract();
    let metaContractABI: any[] = [];
    let badgeABI: any[] = [];
    let contractAddress = "";
    if (latest?.abi_transac) {
      if (typeof latest.abi_transac === "string") {
        metaContractABI = JSON.parse(latest.abi_transac);
      } else {
        metaContractABI = latest.abi_transac as any[];
      }
    }
    if (latest && "abi_badge" in latest && latest.abi_badge) {
      if (typeof latest.abi_badge === "string") {
        badgeABI = JSON.parse(latest.abi_badge);
      } else {
        badgeABI = latest.abi_badge as any[];
      }
    }
    if (latest?.ca_transac) {
      contractAddress = latest.ca_transac;
    } else {
      throw new Error(
        "No contract address (ca_transac) found in TunerContract table"
      );
    }
    this.contract = new Contract(
      contractAddress,
      metaContractABI,
      this.provider
    );
    // 필요하다면 badgeABI로 별도 컨트랙트 인스턴스 생성 가능
    this.msgSigner = this.contract.connect(this.wallet) as Contract;
  }

  async createKGTToken(address: string, value: string, msg: any, sign: string) {
    const { hash: txHash } = await this.msgSigner.mint(
      address,
      value,
      JSON.stringify(msg),
      sign
    );
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) return;
    return await tx.wait();
  }

  async getKGTToken(address: string): Promise<number> {
    const token = await this.msgSigner.balanceOf20(address);
    const formatted = formatUnits(token, 18);
    return Math.floor(Number(formatted));
  }

  async getKGTBadge(address: string): Promise<number> {
    const token = await this.msgSigner.balanceOf1155(address);
    const formatted = formatUnits(token, 18);
    return Math.floor(Number(formatted));
  }

  async useKGTToken(
    address: string,
    value: BigNumberish,
    msg: any,
    sign: string
  ) {
    const { hash: txHash } = await this.msgSigner.burn(
      address,
      value,
      JSON.stringify(msg),
      sign
    );
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) return;
    return await tx.wait();
  }

  async sendKGTToken(
    sender: string,
    to: string,
    value: BigNumberish,
    msg: any,
    sign: string
  ) {
    const { hash: txHash } = await this.msgSigner.transferFrom(
      sender,
      to,
      value,
      JSON.stringify(msg),
      sign
    );
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) return;
    return await tx.wait();
  }

  async createSign(wallet: Wallet, txMessage: string): Promise<string> {
    return await wallet.signMessage(txMessage);
  }

  async createWallet(uid: string): Promise<Wallet> {
    const combined = `${uid}-${process.env.SALT}`; // 또는 `${SALT}-${uid}`로도 가능
    const hash = keccak256(toUtf8Bytes(combined));
    const privateKey = hash.slice(0, 66);
    return new Wallet(privateKey, this.provider);
  }
}
