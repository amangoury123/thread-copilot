"use client";

import { CheckIcon, CrownIcon } from "lucide-react";
import { toast } from "sonner";
import type { Usage } from "@/types";
import { PLANS, UPGRADE_COMING_SOON } from "@/lib/plans";
import { Button } from "@/components/ui/button";
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
  const atLimit = usage !== null && usage.plan === "free" && usage.used >= usage.limit;
  const pro = PLANS.pro;

  function handleUpgrade() {
    toast.info(UPGRADE_COMING_SOON);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CrownIcon className="size-5" />
          </div>
          <DialogTitle>
            {atLimit ? "You've used all your free threads" : "Upgrade to Pro"}
          </DialogTitle>
          <DialogDescription>
            {atLimit
              ? `You've written ${usage.used} of ${usage.limit} free threads this month. Go Pro for unlimited threads, or wait until your limit resets next month.`
              : "Write as many threads as you want, every month."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold">{pro.price}</span>
            <span className="text-sm text-muted-foreground">{pro.period}</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {pro.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button onClick={handleUpgrade}>
            <CrownIcon />
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
