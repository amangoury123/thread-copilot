"use client";

import { CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUsage } from "./usage-provider";

export function UsageMeter({ className }: { className?: string }) {
  const { usage, openUpgrade } = useUsage();

  if (!usage) {
    return (
      <div className={cn("space-y-2 rounded-lg border bg-background p-3", className)}>
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-7 w-full" />
      </div>
    );
  }

  if (usage.plan === "pro") {
    return (
      <div className={cn("flex items-center gap-2 rounded-lg border bg-background p-3 text-sm", className)}>
        <CrownIcon className="size-4 text-primary" />
        Pro plan · Unlimited threads
      </div>
    );
  }

  const percent = Math.min(100, (usage.used / usage.limit) * 100);
  const atLimit = usage.used >= usage.limit;

  return (
    <div className={cn("space-y-2.5 rounded-lg border bg-background p-3", className)}>
      <p className="text-sm">
        <span className="font-medium tabular-nums">
          {usage.used} / {usage.limit}
        </span>{" "}
        <span className="text-muted-foreground">free threads used</span>
      </p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={usage.used}
        aria-valuemin={0}
        aria-valuemax={usage.limit}
        aria-label="Monthly thread usage"
      >
        <div
          className={cn("h-full rounded-full transition-all", atLimit ? "bg-destructive" : "bg-primary")}
          style={{ width: `${percent}%` }}
        />
      </div>
      <Button size="sm" className="w-full" onClick={openUpgrade}>
        <CrownIcon />
        Upgrade
      </Button>
    </div>
  );
}
