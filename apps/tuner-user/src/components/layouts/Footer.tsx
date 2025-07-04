"use client";

export default function Footer() {
  return (
    <footer className="w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto pb-[80px] px-4 py-8 text-gray-500 text-sm border-t border-gray-200 bg-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-between">
          <p className="cursor-pointer">이용약관</p>
          <p className="cursor-pointer">개인정보처리방침</p>
          <p className="cursor-pointer">자주 묻는 질문</p>
          <p className="cursor-pointer">문의하기</p>
        </div>

        <div className="text-center leading-relaxed text-xs text-gray-400">
          <p>© 2025 TUNEROnline Inc. All rights reserved.</p>
          <p>서울특별시 강남구 테헤란로 123, 튜너타워 5층</p>
          <p>사업자등록번호: 123-45-67890 | 대표자: TUNER</p>
        </div>
      </div>
    </footer>
  );
}
