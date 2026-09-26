"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import {
  CURRENCIES,
  DEFAULT_BILLING,
  DEFAULT_CURRENCY,
  formatPrice,
  getPlanPrice,
  maxYearlyDiscountPercent,
  MONEY_BACK_DAYS,
  PLAN_ORDER,
  PLANS,
  UPGRADE_COMING_SOON,
  yearlySavings,
  type BillingPeriod,
  type Currency,
  type PlanInfo,
} from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FoundingBanner } from "./founding-banner";
import { SegmentedControl } from "./segmented-control";

/** Shared by /pricing and the landing page, so both always match. */
export function PricingCards() {
  const [period, setPeriod] = useState<BillingPeriod>(DEFAULT_BILLING);
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <SegmentedControl<BillingPeriod>
          label="Billing period"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "monthly", label: "Monthly" },
            {
              value: "yearly",
              label: (
                <>
                  Yearly
                  <Badge className="h-4.5 px-1.5 text-[10px]">
                    Save up to {maxYearlyDiscountPercent()}%
                  </Badge>
                </>
              ),
            },
          ]}
        />
        <SegmentedControl<Currency>
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((c) => ({ value: c, label: c === "INR" ? "₹ INR" : "$ USD" }))}
        />
      </div>

      <FoundingBanner />

      <div className="grid gap-6 pt-2 md:grid-cols-3 md:items-stretch">
        {PLAN_ORDER.map((id) => (
          <PlanCard key={id} plan={PLANS[id]} period={period} currency={currency} />
        ))}
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <ShieldCheckIcon className="size-4 text-primary" />
        Cancel anytime · {MONEY_BACK_DAYS}-day money-back guarantee
      </p>
    </div>
  );
}

interface PlanCardProps {
  plan: PlanInfo;
  period: BillingPeriod;
  currency: Currency;
}

function PlanCard({ plan, period, currency }: PlanCardProps) {
  const isFree = plan.prices[currency].monthly === 0;
  const price = getPlanPrice(plan.id, period, currency);
  const savings = yearlySavings(plan.id, currency);

  return (
    <Card
      className={cn(
        "relative overflow-visible",
        plan.highlighted && "shadow-xl shadow-primary/15 ring-2 ring-primary md:-translate-y-2",
      )}
    >
      {plan.badge && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 shadow-sm">{plan.badge}</Badge>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <CardDescription>{plan.tagline}</CardDescription>
        <div className="flex items-baseline gap-1 pt-4">
          <span className="text-4xl font-semibold tracking-tight tabular-nums">
            {formatPrice(price, currency)}
          </span>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>
        <p className="min-h-10 text-xs text-muted-foreground">
          {isFree ? (
            "Free forever. No credit card."
          ) : period === "yearly" ? (
            <>
              {formatPrice(price * 12, currency)} billed yearly
              <br />
              <span className="font-medium text-primary">
                Save {formatPrice(savings, currency)} a year
              </span>
            </>
          ) : (
            <>
              Billed monthly
              <br />
              or {formatPrice(getPlanPrice(plan.id, "yearly", currency), currency)}/mo yearly (save{" "}
              {formatPrice(savings, currency)})
            </>
          )}
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-2.5 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent pb-4">
        {isFree ? (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
          >
            {plan.cta}
          </Link>
        ) : (
          <Button
            size="lg"
            variant={plan.highlighted ? "default" : "outline"}
            className="w-full"
            onClick={() => toast.info(UPGRADE_COMING_SOON)}
          >
            {plan.cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
