"use client";

import { Wallet, ArrowDown } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

export default function Reward() {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    image: "",
    description: "",
    buttonLabel: "",
    color: "",
  });

  const balance = 3.21; // 일단 고정값-!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    // 출금 요청 실패
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return (
        setModalContent({
          image: "X.png",
          description: "유효한 출금 금액을 입력해주세요.",
          buttonLabel: "확인",
          color: "red",
        }),
        setIsModalOpen(true)
      );
    }

    // 출금 요청 성공
    setModalContent({
      image: "check.png",
      description: `${numericAmount} ETH 출금 요청이 완료되었습니다.`,
      buttonLabel: "확인",
      color: "blue",
    });
    setIsModalOpen(true);
    setAmount(""); // 입력 초기화
  };

  return (
    <>
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

      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-700">지갑 정보</h2>
          </div>
          <p className="text-gray-600">
            주소: <span className="font-mono text-gray-800">0x1234...abcd</span>
          </p>
          <p className="text-gray-600">
            잔액: <span className="text-blue-600 font-bold">{balance} ETH</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-700">출금 신청</h2>
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
    </>
  );
}
