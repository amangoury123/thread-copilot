import type { Plan } from "@/types";

export interface PlanInfo {
  id: Plan;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

export const PLANS: Record<Plan, PlanInfo> = {
  free: {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Try it out and write your first threads.",
    features: [
      "5 threads per month",
      "Thread Generator & Optimizer",
      "Live X character counter",
      "Saved drafts",
      "Copy & Open in X",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For builders who post every week.",
    features: [
      "Unlimited threads",
      "Everything in Free",
      "Unlimited tweet regenerations",
      "Priority access to new features",
      "Email support",
    ],
  },
};

export const UPGRADE_COMING_SOON = "Payments are coming soon. You'll be the first to know!";
