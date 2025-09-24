"use client";

import { SWRConfig, SWRConfiguration } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
  config?: SWRConfiguration;
}

export const SWRProvider: React.FC<SWRProviderProps> = ({
  children,
  config,
}) => {
  return <SWRConfig value={config}>{children}</SWRConfig>;
};
