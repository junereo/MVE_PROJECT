import { useState, ReactNode, FC, isValidElement } from "react";

type StepProps = {
  name: string;
  children: ReactNode;
};

type FunnelProps = {
  children: ReactNode | ReactNode[];
};

interface FunnelComponent extends FC<FunnelProps> {
  Step: FC<StepProps>;
}

export function useFunnel<T extends string>(initialStep: T) {
  const [step, setStep] = useState<T>(initialStep);

  const Step: FC<StepProps> = ({ children }) => <>{children}</>;

  const Funnel: FunnelComponent = ({ children }) => {
    const childArray = Array.isArray(children) ? children : [children];

    const current = childArray.find(
      (child) => isValidElement(child) && child.props.name === step
    );

    return <>{current}</>;
  };

  Funnel.Step = Step;

  return { Funnel, setStep, currentStep: step };
}
