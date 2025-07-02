"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, ReactNode, FC, isValidElement } from "react";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStep = (searchParams.get("step") as T) || initialStep;

  const setStep = useCallback(
    (nextStep: T) => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.set("step", nextStep);
        router.push(`?${params.toString()}`);
      }
    },
    [router]
  );

  const Step: FC<StepProps> = ({ children }) => <>{children}</>;

  const Funnel: FunnelComponent = ({ children }) => {
    const childArray = Array.isArray(children) ? children : [children];

    const current = childArray.find(
      (child) => isValidElement(child) && child.props.name === currentStep
    );

    return <>{current}</>;
  };

  Funnel.Step = Step;

  return { Funnel, setStep, currentStep };
}
