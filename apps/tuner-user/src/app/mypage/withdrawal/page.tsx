"use client";

import { Wallet, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

import { requestWithdrawal } from "@/features/withdrawal/services/withdrawal";

import { useUserStore } from "@/features/users/store/useUserStore";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function Reward() {
  const [amount, setAmount] = useState("");
  const userInfo = useUserStore((state) => state.userInfo);
  const balance = userInfo?.balance ?? 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    image: "",
    description: "",
    buttonLabel: "",
    color: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      // const res = await getUserProfile(); // 예: /me 같은 API
      // setBalance(res.data.balance);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > balance) {
      setModalContent({
        image: "X.png",
        description: "유효한 출금 금액을 입력해주세요.",
        buttonLabel: "확인",
        color: "red",
      });
      setIsModalOpen(true);
      return;
    }

    try {
      // 실제 출금 요청
      const res = await requestWithdrawal({
        user_id: 1, // 나중에 로그인 유저 ID로 교체
        amount: numericAmount,
        txhash: `${Date.now()}-${Math.random()}`, // 임시 트랜잭션 해시
        status: "pending",
      });

      console.log("출금 요청 응답", res);

      setModalContent({
        image: "check.png",
        description: `${numericAmount} ETH 출금 요청이 완료되었습니다.`,
        buttonLabel: "확인",
        color: "blue",
      });
      setAmount("");
    } catch (err) {
      console.error("출금 요청 실패:", err);

      setModalContent({
        image: "X.png",
        description: "출금 요청에 실패했습니다.",
        buttonLabel: "확인",
        color: "red",
      });
    }

    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-100 space-y-2">
      <Breadcrumb
        crumbs={[
          { label: "마이페이지", href: "/mypage" },
          { label: "출금 요청" },
        ]}
      />

      {isModalOpen && (
        <Modal
          image={modalContent.image}
          description={modalContent.description}
          buttonLabel={modalContent.buttonLabel}
          color={modalContent.image === "check.png" ? "blue" : "red"}
          onClose={() => setIsModalOpen(false)}
          onClick={() => {}}
        />
      )}

      <div>
        {/* 지갑 주소 삭제 */}
        <div className="bg-white shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-800">지갑 정보</h2>
          </div>
          <p className="text-sm text-gray-500">
            주소: <span className="font-mono text-gray-700">0x1234...abcd</span>
          </p>
          <p className="text-sm text-gray-500">
            잔액:{" "}
            <span className="text-blue-600 font-bold">{balance} TUNER</span>
          </p>
        </div>

        {/* 출금 신청 카드 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-green-500" />
            <h2 className="text-base font-semibold text-gray-800">출금 신청</h2>
          </div>

          <Input
            label="출금 금액 (ETH)"
            name="reward"
            type="text"
            placeholder="예: 1.5"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button type="submit" color="blue">
            출금하기
          </Button>
        </form>
      </div>
    </div>
  );
}
