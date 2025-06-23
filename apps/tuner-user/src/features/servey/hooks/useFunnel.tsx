import { FC, isValidElement, ReactNode, useState } from "react";

type StepProps = {
  name: string;
  children: ReactNode;
};

type FunnelProps = {
  children: ReactNode[]; // step 배열 형태로 받음
};

interface FunnelComponent extends FC<FunnelProps> {
  Step: FC<StepProps>;
}

type UseFunnelReturn<T> = {
  Funnel: FunnelComponent;
  setStep: (step: T) => void;
  currentStep: T;
};

export function useFunnel<T extends string>(
  initialStep: T
): UseFunnelReturn<T> {
  const [step, setStep] = useState<T>(initialStep);

  const Step: FC<StepProps> = ({ children }) => <>{children}</>;

  //   Funnel 컴포넌트 정의
  const Funnel: FunnelComponent = ({ children }) => {
    const current = children.find(
      (child) => isValidElement(child) && child.props.name === step // 현재 step만 찾아서 렌더링
    );
    return <>{current}</>;
  };

  Funnel.Step = Step; // Funnel에 Step 연결

  // Funnel : 각 단계 / setStep : 다음, 이전 상태 / currentStep: 현재 상태
  return { Funnel, setStep, currentStep: step };
}
