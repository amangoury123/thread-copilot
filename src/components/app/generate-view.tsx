"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Loader2Icon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import type { GenerateOptions, Thread, ThreadLength, Tone } from "@/types";
import { generateThread, UsageLimitError } from "@/lib/api/threads";
import { ThreadPreview } from "@/components/thread/thread-preview";
import { ThreadSkeleton } from "@/components/thread/thread-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "./page-header";
import { useUsage } from "./usage-provider";

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "storytelling", label: "Storytelling" },
  { value: "educational", label: "Educational" },
];

const LENGTHS: { value: ThreadLength; label: string }[] = [
  { value: 5, label: "5 tweets" },
  { value: 7, label: "7 tweets" },
  { value: 10, label: "10 tweets" },
];

const EXAMPLE_TOPICS = [
  "How I got my first 100 users without ads",
  "Lessons from bootstrapping a SaaS to $5k MRR",
  "Why most side projects never make money",
];

export function GenerateView() {
  const { refreshUsage, openUpgrade } = useUsage();
  const resultRef = useRef<HTMLDivElement>(null);

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<ThreadLength>(7);
  const [audience, setAudience] = useState("");
  const [includeCta, setIncludeCta] = useState(true);

  const [loading, setLoading] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [lastOptions, setLastOptions] = useState<GenerateOptions | null>(null);

  async function run(options: GenerateOptions) {
    setLoading(true);
    setLastOptions(options);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    try {
      const result = await generateThread(options);
      setThread(result);
      toast.success(`Generated a ${result.tweets.length}-tweet thread`);
    } catch (error) {
      if (error instanceof UsageLimitError) {
        openUpgrade();
      } else {
        toast.error("Something went wrong while generating. Please try again.");
      }
    } finally {
      setLoading(false);
      void refreshUsage();
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!topic.trim() || loading) return;
    void run({
      topic: topic.trim(),
      tone,
      length,
      audience: audience.trim() || undefined,
      includeCta,
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      handleSubmit(event);
    }
  }

  return (
    <>
      <PageHeader
        title="Generate a thread"
        description="Drop in a topic or rough notes. Get a thread with a hook, clear insights, and a CTA."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <Card className="lg:sticky lg:top-10">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or notes</Label>
                <Textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Lessons from growing my newsletter to 5,000 subscribers. Or paste your rough notes."
                  className="min-h-32 max-h-72"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select items={TONES} value={tone} onValueChange={(value) => value && setTone(value)}>
                    <SelectTrigger className="w-full" aria-label="Tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select items={LENGTHS} value={length} onValueChange={(value) => value && setLength(value)}>
                    <SelectTrigger className="w-full" aria-label="Length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LENGTHS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">
                  Audience <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. first-time SaaS founders"
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="include-cta">Include CTA</Label>
                  <p className="text-xs text-muted-foreground">End with a follow / repost ask.</p>
                </div>
                <Switch id="include-cta" checked={includeCta} onCheckedChange={setIncludeCta} />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={!topic.trim() || loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
                {loading ? "Generating…" : "Generate thread"}
              </Button>
              <p className="hidden text-center text-xs text-muted-foreground sm:block">
                Tip: press Ctrl + Enter to generate
              </p>
            </form>
          </CardContent>
        </Card>

        <div ref={resultRef} className="min-w-0 scroll-mt-20">
          {loading ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Writing your thread…</p>
              <ThreadSkeleton count={lastOptions?.length ?? length} />
            </div>
          ) : thread ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate text-lg font-semibold">{thread.title}</h2>
                {lastOptions && (
                  <Button variant="ghost" size="sm" onClick={() => void run(lastOptions)}>
                    <RefreshCwIcon />
                    Regenerate
                  </Button>
                )}
              </div>
              <ThreadPreview thread={thread} onChange={setThread} onSaved={setThread} />
            </div>
          ) : (
            <EmptyResult onPick={setTopic} />
          )}
        </div>
      </div>
    </>
  );
}

function EmptyResult({ onPick }: { onPick: (topic: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <SparklesIcon className="size-5" />
      </div>
      <h2 className="mt-4 font-semibold">Your thread will appear here</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Describe what you want to write about, or start from one of these:
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {EXAMPLE_TOPICS.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onPick(example)}
            className="rounded-full border bg-background px-3 py-1.5 text-xs transition-colors hover:border-primary/50 hover:text-primary"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
