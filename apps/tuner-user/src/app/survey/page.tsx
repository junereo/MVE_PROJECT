import Disclosure from "@/components/ui/Disclosure";
import SutveyAccordion from "./components/SurveyAccordion";
import Link from "next/link";

export default function Survey() {
  return (
    <div className="content">
      <h1 className="title">SURVEY</h1>
      <p>설문 페이지</p>
      <Link
        href="/survey/create"
        className="flex text-end font-bold text-blue-600"
      >
        설문 생성
      </Link>
      <Disclosure title="Disclosure">
        <p>Disclosure 내용입니당</p>
      </Disclosure>
      <SutveyAccordion />
    </div>
  );
}
