"use client";

import Link from "next/link";
import { CheckIcon, CrownIcon } from "lucide-react";
import { toast } from "sonner";
import { PLANS, UPGRADE_COMING_SOON } from "@/lib/plans";
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

export function PricingCards() {
  const plans = [PLANS.free, PLANS.pro];

  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
      {plans.map((plan) => {
        const highlighted = plan.id === "pro";
        return (
          <Card
            key={plan.id}
            className={cn("relative", highlighted && "shadow-lg shadow-primary/10 ring-2 ring-primary")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {highlighted && <Badge>Most popular</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <div className="flex items-baseline gap-1 pt-3">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {highlighted ? (
                <Button size="lg" className="w-full" onClick={() => toast.info(UPGRADE_COMING_SOON)}>
                  <CrownIcon />
                  Upgrade to Pro
                </Button>
              ) : (
                <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}>
                  Start writing free
                </Link>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
