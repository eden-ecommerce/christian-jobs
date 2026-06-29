"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type HeaderChromeContextValue = {
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
};

const HeaderChromeContext = createContext<HeaderChromeContextValue | null>(null);

export const HeaderChromeProvider = ({ children }: { children: ReactNode }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const value = useMemo(
    () => ({ searchFocused, setSearchFocused }),
    [searchFocused],
  );

  return <HeaderChromeContext.Provider value={value}>{children}</HeaderChromeContext.Provider>;
};

export const useHeaderChrome = (): HeaderChromeContextValue => {
  const context = useContext(HeaderChromeContext);
  if (!context) {
    throw new Error("useHeaderChrome must be used within HeaderChromeProvider");
  }
  return context;
};
