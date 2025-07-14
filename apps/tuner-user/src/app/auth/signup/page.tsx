import SignupForm from "./components/SignupForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function Signup() {
  return (
    <div>
      <Breadcrumb crumbs={[{ label: "회원가입" }]} />
      <div className="sm:pt-[100px]">
        <div className="flex items-center justify-center font-bold text-2xl pt-1 pb-1 text-blue-600">
          TUNER
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
