import SurveyWrapper from "../create/components/layouts/SurveyWrapper";

export default function SurveyCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SurveyWrapper>{children}</SurveyWrapper>;
}
