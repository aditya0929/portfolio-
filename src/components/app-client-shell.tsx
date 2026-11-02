"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useState, type ReactNode } from "react";
import { LoadingScreen } from "./loading-screen";

export function AppClientShell({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const finish = useCallback(() => setLoading(false), []);

  return (
    <>
      <AnimatePresence mode="wait">{loading && <LoadingScreen key="loader" onComplete={finish} />}</AnimatePresence>
      {children}
    </>
  );
}
