"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Usage } from "@/types";
import { getUsage } from "@/lib/api/threads";
import { UpgradeDialog } from "./upgrade-dialog";

interface UsageContextValue {
  /** null while loading */
  usage: Usage | null;
  refreshUsage: () => Promise<void>;
  openUpgrade: () => void;
}

const UsageContext = createContext<UsageContextValue | null>(null);

export function UsageProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const refreshUsage = useCallback(async () => {
    try {
      setUsage(await getUsage());
    } catch {
      // Keep the last known value
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getUsage()
      .then((result) => {
        if (!cancelled) setUsage(result);
      })
      .catch(() => {
        // Meter stays in its loading state
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openUpgrade = useCallback(() => setUpgradeOpen(true), []);

  return (
    <UsageContext.Provider value={{ usage, refreshUsage, openUpgrade }}>
      {children}
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} usage={usage} />
    </UsageContext.Provider>
  );
}

export function useUsage(): UsageContextValue {
  const context = useContext(UsageContext);
  if (!context) throw new Error("useUsage must be used inside <UsageProvider>");
  return context;
}
