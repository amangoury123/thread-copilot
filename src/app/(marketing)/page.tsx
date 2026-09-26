import Link from "next/link";
import {
  ArrowRightIcon,
  CopyIcon,
  FileTextIcon,
  GaugeIcon,
  PenLineIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  WandSparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { DemoThread } from "@/components/marketing/demo-thread";
import { Faq } from "@/components/marketing/faq";
import { PricingCards } from "@/components/marketing/pricing/pricing-cards";
import { buttonVariants } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

const STEPS = [
  {
    title: "Drop in your idea",
    description: "A topic, a lesson, or messy notes from your day. No need to be polished.",
  },
  {
    title: "Pick a tone and length",
    description: "Professional, casual, storytelling, or educational. 5, 7, or 10 tweets.",
  },
  {
    title: "Polish, copy, post",
    description: "Edit inline, regenerate any tweet, then copy the thread or open it in X.",
  },
];

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: SparklesIcon,
    title: "Thread Generator",
    description: "Turns a topic into a structured thread: scroll-stopping hook, numbered insights, clear CTA.",
  },
  {
    icon: WandSparklesIcon,
    title: "Thread Optimizer",
    description: "Paste a draft and get a sharper version, plus a list of exactly what changed and why.",
  },
  {
    icon: GaugeIcon,
    title: "Exact character count",
    description: "Uses X's own counting rules, so links and emoji never push you over 280 by surprise.",
  },
  {
    icon: PenLineIcon,
    title: "Edit every tweet",
    description: "Tweak text inline, regenerate a single tweet, add or delete tweets anywhere in the thread.",
  },
  {
    icon: FileTextIcon,
    title: "Saved drafts",
    description: "Keep ideas in progress and come back to them when you're ready to post.",
  },
  {
    icon: CopyIcon,
    title: "Copy & Open in X",
    description: "One click to copy the whole thread, or open X with your first tweet ready to go.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,var(--color-primary)_0%,transparent_60%)] opacity-15"
        />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <SlidersHorizontalIcon className="size-3.5 text-primary" />
            AI thread writer for indie hackers
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Write X threads that <span className="text-primary">actually get read</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            Turn rough notes into sharp, structured threads with a strong hook, clear insights, and a
            CTA that converts. Built for founders who&apos;d rather build than wordsmith.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login" className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}>
              Start writing free
              <ArrowRightIcon />
            </Link>
            <Link
              href="#how-it-works"
              className={buttonVariants({ variant: "ghost", size: "lg", className: "h-11 px-5 text-base" })}
            >
              See how it works
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {PLANS.free.threadsPerMonth} free threads every month · No credit card
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <DemoThread />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="How it works" title="From idea to thread in under a minute" />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-xl border bg-card p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to write great threads"
            description="No scheduling queues or engagement hacks. Just better writing, faster."
          />
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="scroll-mt-20 border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Upgrade when you're hooked."
            description="Every plan includes every feature. Plans differ only by how many threads you write."
          />
          <div className="mt-12">
            <PricingCards />
          </div>
          <p className="mt-8 text-center text-sm">
            <Link href="/pricing" className="font-medium text-primary hover:underline">
              Compare plans in detail →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-12">
            <Faq />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Your next thread is 60 seconds away
            </h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
              Stop staring at a blank post. Start with your idea and let Thread Copilot shape it.
            </p>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "mt-8 h-11 px-5 text-base",
              })}
            >
              Start writing free
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  );
}
