"use client";

import { useMemo, useState } from "react";
import { CheckCircle2Icon, ClipboardPasteIcon, Loader2Icon, WandSparklesIcon } from "lucide-react";
import { toast } from "sonner";
import type { OptimizeResult, Thread } from "@/types";
import { optimizeThread, UsageLimitError } from "@/lib/api/threads";
import { createId, deriveTitle, splitThread } from "@/lib/thread-utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ThreadPreview } from "@/components/thread/thread-preview";
import { ThreadSkeleton } from "@/components/thread/thread-skeleton";
import { TweetCard } from "@/components/thread/tweet-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "./page-header";
import { useUsage } from "./usage-provider";

const EXAMPLE_THREAD = `I think that building in public is really one of the best things you can do as a founder and I want to share why.

It basically gives you accountability. When you tell people what you're working on you actually have to follow through and ship things.

You also get a lot of feedback really early. People will tell you what they like and what they don't like before you waste months building the wrong thing.

And at the end of the day it helps you build an audience which makes launching so much easier. #buildinpublic #indiehackers`;

export function OptimizeView() {
  const { refreshUsage, openUpgrade } = useUsage();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);

  const parsed = useMemo(() => splitThread(raw), [raw]);

  async function handleOptimize() {
    if (parsed.length === 0 || loading) return;
    setLoading(true);
    try {
      const res = await optimizeThread(parsed.map((text) => ({ id: createId(), text })));
      setResult(res);
      setThread({
        id: createId(),
        title: deriveTitle(res.optimized),
        tweets: res.optimized,
        createdAt: new Date().toISOString(),
        tone: null,
        source: "optimized",
      });
      toast.success(`Thread optimized with ${res.improvements.length} improvements`);
    } catch (error) {
      if (error instanceof UsageLimitError) {
        openUpgrade();
      } else {
        toast.error("Something went wrong while optimizing. Please try again.");
      }
    } finally {
      setLoading(false);
      void refreshUsage();
    }
  }

  const before = result && (
    <div className="overflow-hidden rounded-xl border bg-card">
      {result.original.map((tweet, i) => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          index={i}
          total={result.original.length}
          connector={i < result.original.length - 1}
          readOnly
        />
      ))}
    </div>
  );

  const after = thread && <ThreadPreview thread={thread} onChange={setThread} onSaved={setThread} />;

  return (
    <>
      <PageHeader
        title="Optimize a thread"
        description="Paste a thread you've written. Get a sharper version and see exactly what changed."
      />

      <Card>
        <CardContent className="space-y-3">
          <Label htmlFor="thread-input">Your thread</Label>
          <Textarea
            id="thread-input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={"Paste your thread here.\n\nSeparate tweets with a blank line, or number them 1/, 2/, 3/…"}
            className="min-h-44 max-h-96"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={parsed.length > 0 ? "secondary" : "outline"}>
              {parsed.length} tweet{parsed.length === 1 ? "" : "s"} detected
            </Badge>
            <Button variant="ghost" size="sm" className="mr-auto" onClick={() => setRaw(EXAMPLE_THREAD)}>
              <ClipboardPasteIcon />
              Try an example
            </Button>
            <Button onClick={() => void handleOptimize()} disabled={parsed.length === 0 || loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : <WandSparklesIcon />}
              {loading ? "Optimizing…" : "Optimize thread"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ThreadSkeleton count={Math.max(parsed.length, 2)} />
          <div className="hidden lg:block">
            <ThreadSkeleton count={Math.max(parsed.length, 2)} />
          </div>
          <Skeleton className="h-32 lg:col-span-2" />
        </div>
      )}

      {!loading && result && thread && (
        <div className="mt-8 space-y-6">
          {isDesktop ? (
            <div className="grid grid-cols-2 items-start gap-6">
              <section className="space-y-3">
                <h2 className="flex h-7 items-center text-sm font-medium text-muted-foreground">Before</h2>
                {before}
              </section>
              <section className="space-y-3">
                <h2 className="flex h-7 items-center text-sm font-medium text-primary">After</h2>
                {after}
              </section>
            </div>
          ) : (
            <Tabs defaultValue="after">
              <TabsList className="w-full">
                <TabsTrigger value="before">Before</TabsTrigger>
                <TabsTrigger value="after">After</TabsTrigger>
              </TabsList>
              <TabsContent value="before" className="mt-3">
                {before}
              </TabsContent>
              <TabsContent value="after" className="mt-3">
                {after}
              </TabsContent>
            </Tabs>
          )}

          <Card>
            <CardHeader>
              <CardTitle>What we improved</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.improvements.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
