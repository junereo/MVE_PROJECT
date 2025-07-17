"use client";

import { Wallet, ArrowDown, ReceiptText } from "lucide-react";
import { useState } from "react";
import { requestWithdrawal } from "@/features/withdrawal/services/withdrawal";
import { useUserStore } from "@/features/users/store/useUserStore";
import LatestRequestCard from "../withdrawal/components/LatestRequestCard";
import { useWithdrawalStore } from "@/features/withdrawal/store/useWithdrawalStore";
import { getTunerBalance } from "@/features/withdrawal/utils/getTunerBalance";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Disclosure from "@/components/ui/Disclosure";
import Pagination from "@/components/ui/Pagination";
import WithdrawalList from "./components/WithdrawalHistoryList";

export default function Reward() {
  const [amount, setAmount] = useState("");
  const userInfo = useUserStore((state) => state.userInfo);
  const balance = userInfo?.balance ?? 0;
  const { withdrawals } = useWithdrawalStore();
  const [page, setPage] = useState(1);
  const perPage = 5;
  const latest = withdrawals[0]; // 가장 최근 요청
  const rest = withdrawals.slice(1);
  const totalPages = Math.ceil(rest.length / perPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    image: "",
    description: "",
    buttonLabel: "",
    color: "",
  });
  if (!userInfo) return null;

  const point = Math.floor(balance / 1000);
  const tuner = getTunerBalance(withdrawals);

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
        user_id: userInfo.id,
        amount: numericAmount,
        txhash: `${Date.now()}-${Math.random()}`, // 임시 트랜잭션 해시
        status: "completed",
      });

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
          onClick={() => {
            if (modalContent.image === "check.png") {
              window.location.reload(); // 출금 성공 시 새로고침
            } else {
              setIsModalOpen(false); // 실패 시 그냥 닫기만
            }
          }}
        />
      )}

      <div className="bg-white shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-800">잔액</h2>
        </div>
        <div className="grid grid-flow-col grid-row-2 gap-4 text-center">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600">포인트</p>
            <p className="text-gray-800 font-medium ">
              {point || 0}{" "}
              <span className="text-blue-600 font-bold">포인트</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 border-l border-l-gray-200">
            <p className="text-sm text-gray-600">TUNER</p>
            <p className="font-medium text-gray-800">
              {tuner} <span className="text-blue-600 font-bold">TUNER</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ArrowDown className="w-5 h-5 text-green-500" />
          <h2 className="text-base font-semibold text-gray-800">출금 신청</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 max-w-[768px] sm:max-w-[640px] xs:max-w-[485px]"
        >
          <Input
            label="출금 금액 (포인트)"
            name="reward"
            type="text"
            placeholder="50 포인트 이상 출금 가능합니다."
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              // 숫자 또는 소수점만 허용
              if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                setAmount(value);
              }
            }}
          />

          <Button type="submit" color="blue">
            출금하기
          </Button>
        </form>
      </div>

      <div className="bg-white shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-gray-500" />
          <h2 className="text-base font-semibold text-gray-800">TUNER 내역</h2>
        </div>
        {latest && <LatestRequestCard data={latest} />}
        {rest.length > 0 && (
          <Disclosure title="이전 출금 요청 보기">
            <WithdrawalList data={rest} page={page} perPage={perPage} />
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </Disclosure>
        )}
      </div>
    </div>
  );
}
