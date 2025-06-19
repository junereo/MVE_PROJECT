//txpool.worker.ts
import { TxPoolService } from '../services/txpool.service.js';

const txPoolService = new TxPoolService();

await txPoolService.init(); // provider, wallet, contract 초기화

const INTERVAL_MS = 10000; // 10초마다

export function startTxPoolWorker() {
  setInterval(() => {
    const clearedTx = txPoolService.getPool();

    if (clearedTx.length > 0) {
      console.log(`[TXPool Worker] Cleared ${clearedTx.length} transactions`);
      // 여기에 DB 저장, 블록체인 전송 등 처리 로직 가능
    }
  }, INTERVAL_MS);
}
