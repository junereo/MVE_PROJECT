import Disclosure from "@/components/ui/Disclosure";
import SutveyAccordion from "./components/SurveyAccordion";

export default function Survey() {
  return (
    <div className="content">
      <h1 className="title">SURVEY</h1>
      <p>설문 페이지</p>

      <Disclosure title="Disclosure">
        <p>Disclosure 내용입니당</p>
      </Disclosure>
      <SutveyAccordion />
    </div>
  );
}
