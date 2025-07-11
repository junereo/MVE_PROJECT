// src/wallet/service/meta_transaction.services.ts
import  {
  ethers,
  Wallet,
  JsonRpcProvider,
  Contract,
  keccak256,
  toUtf8Bytes,
  formatUnits,
  parseUnits,
  BigNumberish,
  getBytes,
  MaxUint256,
} from 'ethers';
import { TunerContractService } from './tunerContract.service';
import dotenv from 'dotenv';
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
      console.error('No contract address (ca_transac) found in TunerContract table');
      return; // 또는 적절한 fallback 처리
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
    // 모든 인자를 배열로 변환 (value는 ether 단위 → wei 변환)
    const addresses = [address];
    const values = [ethers.parseUnits(value, 18)];
    const messages = [msg];
    const signatures = [getBytes(sign)];

    const { hash: txHash } = await this.msgSigner.mint(
      addresses, values, messages, signatures
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
    /**
   * TunerToken에 approve (owner → MetaTransaction)
   */
  async approveTunerToken(spender: string, tokenAddress: string, amount: string = MaxUint256.toString()) {
    // amount를 ether(소수점) 단위로 받아서 wei로 변환
    const amountWei = parseUnits(amount, 18).toString();
    const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const tunerToken = new Contract(tokenAddress, abi, this.wallet);

    const tx = await tunerToken.approve(spender, amountWei);
    await tx.wait();

    return { txHash: tx.hash, approved: amount };
  }

  /**
   * TunerToken에 대한 approve 해제
   */
  async revokeTunerToken(spender: string, tokenAddress: string) {
    const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const tunerToken = new Contract(tokenAddress, abi, this.wallet);

    const tx = await tunerToken.approve(spender, 0);
    await tx.wait();

    return { txHash: tx.hash, revoked: true };
  }

  /**
   * owner가 spender에게 위임한 토큰 allowance 조회
   */
  async getAllowance(owner: string, spender: string, tokenAddress: string) {
    const abi = ["function allowance(address owner, address spender) public view returns (uint256)"];
    const tunerToken = new Contract(tokenAddress, abi, this.provider);
    const allowance = await tunerToken.allowance(owner, spender);
    // 18자리 ether 단위로 변환
    return ethers.formatUnits(allowance, 18);
  }

}
