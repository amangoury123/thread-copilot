"use client";

import { GemIcon } from "lucide-react";
import { toast } from "sonner";
import { FOUNDING_MEMBER, formatPrice, PLANS, UPGRADE_COMING_SOON } from "@/lib/plans";
import { Button } from "@/components/ui/button";

export function FoundingBanner() {
  const planName = PLANS[FOUNDING_MEMBER.plan].name;
  const usd = formatPrice(FOUNDING_MEMBER.price.USD, "USD");
  const inr = formatPrice(FOUNDING_MEMBER.price.INR, "INR");

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:gap-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <GemIcon className="size-4" />
      </span>
      <p className="flex-1 text-sm">
        <span className="font-semibold">Founding members:</span> {planName} at {usd}/mo ({inr}/mo),
        locked in forever.{" "}
        <span className="text-muted-foreground">
          Limited to the first {FOUNDING_MEMBER.limit} users.
        </span>
      </p>
      <Button size="sm" variant="outline" className="shrink-0" onClick={() => toast.info(UPGRADE_COMING_SOON)}>
        Claim founding price
      </Button>
    </div>
  );
}
