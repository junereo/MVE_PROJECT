export default function Footer() {
  return (
    <footer className="w-full max-w-[485px] mx-auto py-6 text-black border border-red-500 text-sm md:text-base flex justify-between">
      <div>
        <div>
          <p>02-1234-5678</p>
        </div>
        <div>
          <ul>
            <li>고객센터</li>
            <li>이용약관</li>
            <li>개인정보처리방침</li>
          </ul>
        </div>
      </div>
      <div>
        <p>TUNER</p>
        <p>대표 : 홍길동</p>
        <p>사업자등록번호 : 123-45-67890</p>
      </div>
    </footer>
  );
}
