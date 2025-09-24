import { useState } from "react";

export const useActiveComponent = (initialComponent: string) => {
  const [activeComponent, setActiveComponent] =
    useState<string>(initialComponent);

  return { activeComponent, setActiveComponent };
};
