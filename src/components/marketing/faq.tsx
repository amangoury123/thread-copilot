import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string;
}

export const GENERAL_FAQ: FaqItem[] = [
  {
    question: "How is Thread Copilot different from Typefully or Hypefury?",
    answer:
      "Those tools focus on scheduling and analytics. Thread Copilot focuses on one thing: helping you write better threads, from the hook down to the CTA.",
  },
  {
    question: "Does it post to X for me?",
    answer:
      "Not yet. You copy the thread or use “Open in X” to start a post with your first tweet prefilled. It keeps things simple and your account safe.",
  },
  {
    question: "Will my threads sound like AI?",
    answer:
      "Threads are written to be short, specific, and conversational. You can edit every tweet inline and regenerate any single tweet until it sounds like you.",
  },
  {
    question: "How accurate is the character counter?",
    answer:
      "It uses X's official counting rules (twitter-text), so links, emoji, and special characters are counted exactly the way X counts them.",
  },
  {
    question: "What counts as one thread?",
    answer:
      "Each Generate or Optimize run counts as one thread. Editing, regenerating single tweets, copying, and saving drafts are free.",
  },
  {
    question: "Can I cancel Pro anytime?",
    answer: "Yes. Pro is billed monthly and you can cancel whenever you like. You keep Pro until the end of your billing period.",
  },
];

export function Faq({ items = GENERAL_FAQ }: { items?: FaqItem[] }) {
  return (
    <Accordion className="mx-auto max-w-2xl rounded-xl border bg-card px-4 sm:px-6">
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="py-4 text-left text-base">{item.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
