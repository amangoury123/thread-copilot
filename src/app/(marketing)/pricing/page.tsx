import type { Metadata } from "next";
import { ClockIcon } from "lucide-react";
import { Faq, type FaqItem } from "@/components/marketing/faq";
import { ComparisonTable } from "@/components/marketing/pricing/comparison-table";
import { PricingCards } from "@/components/marketing/pricing/pricing-cards";
import { MONEY_BACK_DAYS, PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Start free with ${PLANS.free.threadsPerMonth} threads a month. Every plan includes every feature.`,
};

const PRICING_FAQ: FaqItem[] = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancel from Settings in a couple of clicks. You keep your plan until the end of the current billing period and won't be charged again.",
  },
  {
    question: "What's your refund policy?",
    answer: `Every paid plan comes with a ${MONEY_BACK_DAYS}-day money-back guarantee. If Thread Copilot isn't for you, email us within ${MONEY_BACK_DAYS} days of your purchase for a full refund. No questions asked.`,
  },
  {
    question: "What counts as one thread?",
    answer:
      "Each Generate or Optimize run counts as one thread. Regenerating a single tweet, editing, copying, and saving drafts never count toward your limit.",
  },
  {
    question: "What happens when I hit my limit?",
    answer:
      "Nothing is lost. You can still open, edit, copy, and post your saved drafts. New Generate and Optimize runs unlock on the 1st of next month, or right away if you upgrade.",
  },
  {
    question: "Can I switch plans?",
    answer:
      "Yes, anytime. Upgrades take effect right away so you get the higher limit immediately. Downgrades apply from your next billing period.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Simple pricing for builders
        </h1>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Every plan includes every feature. Pick the one that fits how often you post.
        </p>
        <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm">
          <ClockIcon className="size-4 shrink-0 text-primary" />
          <span>
            A good thread takes 1–2 hours to write. With Thread Copilot, it takes{" "}
            <span className="font-semibold">5 minutes</span>.
          </span>
        </p>
      </div>

      <div className="mt-12">
        <PricingCards />
      </div>

      <section className="mx-auto mt-24 max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">Compare plans</h2>
        <ComparisonTable />
      </section>

      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">Pricing questions</h2>
        <Faq items={PRICING_FAQ} />
      </section>
    </div>
  );
}
