import { Wallet, BigNumberish } from 'ethers';

export interface TxMessage {
  sender: string;
  data?: string;
  value: string;
}

export interface IMetaTransctionService {
  init(): Promise<void>;
  createWallet(uid: string): Promise<Wallet>;
  createSign(wallet: Wallet, msg: string): Promise<string>;
  createKGTToken(address: string, value: string, msg: TxMessage, sign: string): Promise<any>;
  getKGTToken(address: string): Promise<number>;
  sendKGTToken(sender: string, to: string, value: BigNumberish, msg: TxMessage, sign: string): Promise<any>;
  useKGTToken(sender: string, value: BigNumberish, msg: TxMessage, sign: string): Promise<any>;
}