"use client";

import Link from "next/link";
import { CheckIcon, CrownIcon } from "lucide-react";
import { toast } from "sonner";
import type { Usage } from "@/types";
import {
  DEFAULT_CURRENCY,
  formatPrice,
  getPlanPrice,
  plansAbove,
  PLANS,
  UPGRADE_COMING_SOON,
} from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usage: Usage | null;
}

export function UpgradeDialog({ open, onOpenChange, usage }: UpgradeDialogProps) {
  const currentPlan = PLANS[usage?.plan ?? "free"];
  const atLimit = usage !== null && usage.used >= usage.limit;
  const options = plansAbove(currentPlan.id);

  function handleUpgrade() {
    toast.info(UPGRADE_COMING_SOON);
    onOpenChange(false);
  }

  const title = atLimit
    ? "You've reached this month's limit"
    : options.length > 0
      ? "Upgrade your plan"
      : `You're on ${currentPlan.name}`;

  const description = atLimit
    ? `You've written all ${currentPlan.threadsPerMonth} threads on the ${currentPlan.name} plan this month. Upgrade for a higher limit, or wait until it resets on the 1st.`
    : options.length > 0
      ? "Every plan has every feature. Upgrading gives you more threads each month."
      : "You're on our biggest plan. Your limit resets on the 1st of each month.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CrownIcon className="size-5" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {options.length > 0 && (
          <div className={cn("grid gap-3", options.length > 1 && "sm:grid-cols-2")}>
            {options.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-lg border p-4",
                  plan.highlighted && "border-primary ring-1 ring-primary",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{plan.name}</span>
                  {plan.badge && <Badge>{plan.badge}</Badge>}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">
                    {formatPrice(getPlanPrice(plan.id, "monthly", DEFAULT_CURRENCY), DEFAULT_CURRENCY)}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-3 flex-1 space-y-1.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={handleUpgrade}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Link
            href="/pricing"
            onClick={() => onOpenChange(false)}
            className={buttonVariants({ variant: "ghost" })}
          >
            Compare all plans
          </Link>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {options.length > 0 ? "Maybe later" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
