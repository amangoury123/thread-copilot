import type { Metadata } from "next";
import { Faq, type FaqItem } from "@/components/marketing/faq";
import { PricingCards } from "@/components/marketing/pricing-cards";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start free with 5 threads a month. Go Pro for unlimited threads.",
};

const PRICING_FAQ: FaqItem[] = [
  {
    question: "What happens when I hit the free limit?",
    answer:
      "You can still edit, copy, and save your existing drafts. New generations unlock again on the 1st of next month, or right away with Pro.",
  },
  {
    question: "What counts as one thread?",
    answer:
      "Each Generate or Optimize run counts as one. Regenerating a single tweet, editing, and saving drafts don't count.",
  },
  {
    question: "Which payment methods do you accept?",
    answer: "UPI, cards, and net banking through Razorpay, billed monthly in INR.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel from Settings and keep Pro until the end of your billing period.",
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
          Start with 5 free threads every month. Upgrade when Thread Copilot becomes part of your routine.
        </p>
      </div>

      <div className="mt-14">
        <PricingCards />
      </div>

      <div className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">Billing questions</h2>
        <Faq items={PRICING_FAQ} />
      </div>
    </div>
  );
}
