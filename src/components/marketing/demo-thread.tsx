import { SparklesIcon } from "lucide-react";
import type { Tweet } from "@/types";
import { TweetCard } from "@/components/thread/tweet-card";
import { Badge } from "@/components/ui/badge";

// Static marketing copy, not app data.
const DEMO_TWEETS: Tweet[] = [
  {
    id: "demo-1",
    text: "I went from 0 to $3k MRR as a solo founder in 9 months.\n\nNo funding. No team. No ads.\n\nHere are the 5 things that actually made the difference: 🧵",
  },
  {
    id: "demo-2",
    text: "1. I picked a boring problem.\n\nInvoicing for freelance designers. Not sexy, but people already paid for bad solutions. That meant demand was proven.",
  },
  {
    id: "demo-3",
    text: "2. I talked to 30 users before writing code.\n\nEvery call ended with: \"Can I pay you when it's ready?\" 11 people said yes. That was my waitlist.",
  },
  {
    id: "demo-4",
    text: "That's a wrap.\n\nIf this was useful, follow me for more lessons from building in public, and repost the first tweet to help another founder. 🙏",
  },
];

export function DemoThread() {
  return (
    <div className="relative mx-auto max-w-2xl">
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-2xl"
      />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-primary/5">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-green-400/80" />
          <span className="ml-3 text-xs text-muted-foreground">Thread Copilot · Generate</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-4 py-3 text-sm">
          <SparklesIcon className="size-4 text-primary" />
          <span className="text-muted-foreground">Topic:</span>
          <span className="font-medium">Lessons from growing a SaaS solo</span>
          <div className="ml-auto flex gap-1.5">
            <Badge variant="secondary">Storytelling</Badge>
            <Badge variant="secondary">5 tweets</Badge>
          </div>
        </div>
        {DEMO_TWEETS.map((tweet, i) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            index={i === DEMO_TWEETS.length - 1 ? 4 : i}
            total={5}
            connector={i < DEMO_TWEETS.length - 1}
            readOnly
          />
        ))}
      </div>
    </div>
  );
}
