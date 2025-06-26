import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import BottomNavbar from "@/components/layouts/BottomNavbar";
import Wrapper from "@/components/layouts/Wrapper";
import Link from "next/link";

export default function Survey() {
  return (
    <>
      <Header />
      <Wrapper>
        <h1 className="title">SURVEY</h1>
        <p>설문 페이지</p>
        <Link
          href="/survey/create"
          className="flex text-end font-bold text-blue-600"
        >
          설문 생성
        </Link>
      </Wrapper>
      <BottomNavbar />
      <Footer />
    </>
  );
}
