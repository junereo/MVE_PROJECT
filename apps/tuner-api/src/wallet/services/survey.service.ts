// src/wallet/service/survey.services.ts
import { JsonRpcProvider, Contract, Wallet, keccak256, toUtf8Bytes } from 'ethers';
import { TunerContractService } from './tunerContract.service';
import { MetaTransctionService } from './meta_transction.service';
import { create as createIpfsClient, IPFSHTTPClient } from 'ipfs-http-client';
// import { createReadStream, existsSync } from 'fs';
// import { promises as fs } from 'fs';
// import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

// Initialize IPFS client
const ipfs: IPFSHTTPClient = createIpfsClient({
  url: process.env.IPFS_API_URL,
});

interface TxPoolItem {
  message: { sender: string; data: string };
  signature: string;
}

interface MetadataAttribute {
  trait_type: string;
  value: string;
}

interface SurveyMetadata {
  name: string;
  description: string;
  attributes: MetadataAttribute[];
}

export class SurveyService {
  private provider!: JsonRpcProvider;
  private wallet!: Wallet;
  private contract!: Contract;
  private metaService: MetaTransctionService;
  private txpool: TxPoolItem[] = [];
  private tunerContractService = new TunerContractService();

  constructor(metaService: MetaTransctionService) {
    this.metaService = metaService;
  }

  async init(): Promise<void> {
    this.provider = new JsonRpcProvider(process.env.SEPLOIA_RPC_URL!);
    this.wallet = new Wallet(process.env.WALLET_PRIVATE_KEY!, this.provider);
    // DB에서 ABI 동적 로드
    const latest = await this.tunerContractService.getLatestContract();
    let surveyABI: any[] = [];
    if (latest?.abi_survey) {
      if (typeof latest.abi_survey === 'string') {
        surveyABI = JSON.parse(latest.abi_survey);
      } else {
        surveyABI = latest.abi_survey as any[];
      }
    }
    this.contract = new Contract(process.env.SURVEY_CONTRACT_ADDRESS!, surveyABI, this.wallet);
  }

  // ✅ submitSurveyAndMint (서베이 응답 + NFT 민팅)
  async submitSurveyAndMint(uid: string, surveyId: string, answers: string): Promise<any> {
    const message = { surveyId, uid, answers };

    // 1. 메타데이터 구성 및 IPFS 업로드
    const metadata = {
      name: `Survey ${surveyId}`,
      description: `Participation for ${surveyId} (recorded, not rewarded)`,
      attributes: [
        { trait_type: "UID", value: uid },
        { trait_type: "Survey", value: surveyId },
        { trait_type: "Completed At", value: new Date().toISOString() }
      ]
    };

    const metadataUri = await this.uploadToIPFS(metadata);

    // 2. tokenId 생성
    const tokenId = BigInt(keccak256(toUtf8Bytes(surveyId)));

    // 3. owner로 mint
    const tx = await this.contract.mint(this.wallet.address, surveyId, 1, metadataUri);
    const receipt = await tx.wait();

    return {
      status: "minted",
      tokenId: tokenId.toString(),
      txHash: receipt.hash,
      metadataUri
    };
  }
    /**
   * Survey 메타데이터를 IPFS에 업로드
   * @param metadata Survey 메타데이터 객체
   * @returns ipfs://CID 형태의 URI
   */
  async uploadToIPFS(metadata: SurveyMetadata): Promise<string> {
    try {
      // 1. JSON 문자열로 변환
      const metadataJson = JSON.stringify(metadata, null, 2);

      // 2. IPFS에 업로드
      const result = await ipfs.add(metadataJson, {
        cidVersion: 1,
        hashAlg: 'sha2-256',
        rawLeaves: true
      });

      // 3. Pin 고정
      await ipfs.pin.add(result.cid);

      // 4. Return ipfs:// URI
      return `ipfs://${result.cid.toString()}`;
    } catch (err) {
      console.error('❌ Failed to upload survey metadata to IPFS:', err);
      throw new Error('IPFS metadata upload failed');
    }
  }

    /**
   * surveyId로부터 tokenId를 생성하고, 해당 NFT의 URI(ipfs://...)를 조회
   * @param surveyId 설문 ID
   * @returns ipfs://CID 형식의 메타데이터 URI
   */
  async getSurveyUri(surveyId: string): Promise<string> {
    try {
      const tokenId = BigInt(keccak256(toUtf8Bytes(surveyId)));
      const uri: string = await this.contract.uri(tokenId);
      return uri;
    } catch (err) {
      console.error(`❌ Failed to get URI for surveyId ${surveyId}:`, err);
      throw new Error('Failed to retrieve token URI');
    }
  }

}