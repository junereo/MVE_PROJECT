"use client";

import { ReactNode } from "react";
import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export default function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
