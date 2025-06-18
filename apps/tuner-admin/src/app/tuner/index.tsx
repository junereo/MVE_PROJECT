'use client';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import useEthers from "../hooks/useEthers"; // 기존 로직 유지

const ABI = [...]; // 기존 ERC20 ABI 그대로 사용

const Home = () => {
  const [selectAccount, setSelectAccount] = useState(0);
  const [erc20Count, setErc20Count] = useState<number>(0);
  const [txpool, setTxpool] = useState<any[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);

  const { pkProvider } = useEthers({
    _privateKeys: [
      // 프라이빗키 10개 넣기
    ],
  });

  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

  const getTxPoolHandler = async () => {
    const { data } = await axios.get(`${api}/getTxPool`);
    setTxpool(data);
  };

  const messageHandler = async () => {
    const txMessage = {
      sender: pkProvider[selectAccount].address,
      data: erc20Count.toString(),
    };
    const sign = await pkProvider[selectAccount].wallet.signMessage(JSON.stringify(txMessage));
    await axios.post(`${api}/sign`, { message: txMessage, signature: sign });
  };

  const metaTxHandler = async () => {
    const { data } = await axios.post(`${api}/txpool/submit`);
    console.log("Tx Submitted:", data);
    await getTxPoolHandler();
  };

  useEffect(() => {
    if (pkProvider.length === 0) return;
    const contract = new ethers.Contract(
      "0x98391c501f1F3Ce8906a3bcaFB5EC3B49E85A5B3",
      ABI,
      pkProvider[selectAccount].wallet.provider
    );

    const loadBalances = async () => {
      const balances = await Promise.all(
        pkProvider.map(async (e) => {
          const balance = await contract.balanceOf(e.address);
          return balance.toString();
        })
      );
      setTokens(balances);
    };

    loadBalances();
  }, [pkProvider, selectAccount]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">선택한 지갑</h2>
      <p>계정: {pkProvider[selectAccount]?.address}</p>
      <p>{pkProvider[selectAccount]?.balance} ETH</p>

      <h3 className="mt-6 font-semibold">계정 목록</h3>
      <ul className="mb-4">
        {pkProvider.map((e, i) => (
          <li
            key={i}
            className="cursor-pointer hover:underline"
            onClick={() => setSelectAccount(i)}
          >
            {e.address} : {e.balance} ETH : {tokens[i]} STK
          </li>
        ))}
      </ul>

      <div className="border p-2 mb-4">
        <h4 className="font-semibold">트랜잭션 요청</h4>
        <p>대납 지갑: {pkProvider[pkProvider.length - 1]?.address}</p>
        <p>ETH: {pkProvider[pkProvider.length - 1]?.balance}</p>
        <input
          type="number"
          value={erc20Count}
          onChange={(e) => setErc20Count(Number(e.target.value))}
          className="border px-2"
        />
        <button className="ml-2 bg-blue-500 text-white px-3" onClick={messageHandler}>
          대납 신청
        </button>
      </div>

      <div className="border p-2">
        <h4 className="font-semibold">Tx Pool</h4>
        <button className="mb-2 bg-gray-200 px-3 py-1" onClick={getTxPoolHandler}>
          txpool 조회
        </button>
        <ul>
          {txpool.map((e, idx) => (
            <li key={idx}>
              {e.message.sender}가 토큰 {e.message.data}개 받고 싶어함
            </li>
          ))}
        </ul>
        <button className="mt-2 bg-green-500 text-white px-3" onClick={metaTxHandler}>
          트랜잭션 실행
        </button>
      </div>
    </div>
  );
};

export default Home;
