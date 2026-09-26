/**
 * Single source of truth for plans, prices and limits.
 * UI must read from here — never hardcode prices or thread limits.
 */
import type { Plan } from "@/types";

export type BillingPeriod = "monthly" | "yearly";
export type Currency = "USD" | "INR";

export const DEFAULT_CURRENCY: Currency = "USD";
export const DEFAULT_BILLING: BillingPeriod = "monthly";
export const CURRENCIES: Currency[] = ["USD", "INR"];

/** Per-month price. `yearly` is the per-month price when billed yearly. */
type PriceTable = Record<Currency, { monthly: number; yearly: number }>;

export interface PlanInfo {
  id: Plan;
  name: string;
  tagline: string;
  threadsPerMonth: number;
  prices: PriceTable;
  features: string[];
  highlighted: boolean;
  badge?: string;
  cta: string;
}

export const PLAN_ORDER: Plan[] = ["free", "pro", "creator"];

export const PLANS: Record<Plan, PlanInfo> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Try every feature and write your first threads.",
    threadsPerMonth: 5,
    prices: { USD: { monthly: 0, yearly: 0 }, INR: { monthly: 0, yearly: 0 } },
    features: [
      "5 threads per month",
      "Thread Generator + Optimizer",
      "All tones",
      "Per-tweet regenerate",
      "Saved drafts",
      "Copy + Open in X",
    ],
    highlighted: false,
    cta: "Start writing free",
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For builders who post every day.",
    threadsPerMonth: 150,
    prices: { USD: { monthly: 12, yearly: 9 }, INR: { monthly: 799, yearly: 599 } },
    features: [
      "150 threads per month",
      "Everything in Free",
      "Enough for daily threads, with room to iterate",
    ],
    highlighted: true,
    badge: "Most popular",
    cta: "Upgrade to Pro",
  },
  creator: {
    id: "creator",
    name: "Creator",
    tagline: "For creators and ghostwriters posting at volume.",
    threadsPerMonth: 400,
    prices: { USD: { monthly: 29, yearly: 24 }, INR: { monthly: 1999, yearly: 1599 } },
    features: [
      "400 threads per month",
      "Everything in Pro",
      "Premium AI mode (higher-quality model)",
      "Priority support",
    ],
    highlighted: false,
    cta: "Upgrade to Creator",
  },
};

export const FOUNDING_MEMBER = {
  plan: "pro" as Plan,
  /** Spots available. Static until the backend can count real sign-ups. */
  limit: 100,
  price: { USD: 7, INR: 499 } satisfies Record<Currency, number>,
};

export const MONEY_BACK_DAYS = 7;

export const UPGRADE_COMING_SOON = "Payments are coming soon. You'll be the first to know!";

type ComparisonValue = boolean | string;

export interface ComparisonRow {
  label: string;
  note?: string;
  values: Record<Plan, ComparisonValue>;
}

const allPlans = (value: ComparisonValue): Record<Plan, ComparisonValue> => ({
  free: value,
  pro: value,
  creator: value,
});

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Threads per month",
    note: "Each Generate or Optimize run counts as one thread",
    values: {
      free: String(PLANS.free.threadsPerMonth),
      pro: String(PLANS.pro.threadsPerMonth),
      creator: String(PLANS.creator.threadsPerMonth),
    },
  },
  { label: "Thread Generator", values: allPlans(true) },
  { label: "Thread Optimizer", values: allPlans(true) },
  { label: "All tones", values: allPlans(true) },
  { label: "Per-tweet regenerate", note: "Doesn't count toward your limit", values: allPlans(true) },
  { label: "Copy + Open in X", values: allPlans(true) },
  { label: "Premium AI mode", note: "Higher-quality model", values: { free: false, pro: false, creator: true } },
  { label: "Priority support", values: { free: false, pro: false, creator: true } },
];

// ---------- helpers ----------

export function formatPrice(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Per-month price for the given billing period. */
export function getPlanPrice(plan: Plan, period: BillingPeriod, currency: Currency): number {
  return PLANS[plan].prices[currency][period];
}

/** Amount saved per year by paying yearly instead of monthly. */
export function yearlySavings(plan: Plan, currency: Currency): number {
  const { monthly, yearly } = PLANS[plan].prices[currency];
  return (monthly - yearly) * 12;
}

/** Largest yearly discount across all paid plans and currencies, e.g. 25. */
export function maxYearlyDiscountPercent(): number {
  let max = 0;
  for (const plan of PLAN_ORDER) {
    for (const currency of CURRENCIES) {
      const { monthly, yearly } = PLANS[plan].prices[currency];
      if (monthly > 0) max = Math.max(max, (monthly - yearly) / monthly);
    }
  }
  return Math.floor(max * 100);
}

/** Plans above the given one, for upgrade prompts. */
export function plansAbove(plan: Plan): PlanInfo[] {
  return PLAN_ORDER.slice(PLAN_ORDER.indexOf(plan) + 1).map((id) => PLANS[id]);
}
