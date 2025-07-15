import SignupForm from "./components/SignupForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SearchHeader from "@/components/layouts/SearchHeader";

export default function Signup() {
  return (
    <>
      <SearchHeader />
      <Breadcrumb crumbs={[{ label: "회원가입" }]} />
      <div>
        <SignupForm />
      </div>
    </>
  );
}
