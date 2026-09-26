"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, FileQuestionIcon } from "lucide-react";
import { toast } from "sonner";
import type { Thread } from "@/types";
import { getDraft } from "@/lib/api/threads";
import { ThreadPreview } from "@/components/thread/thread-preview";
import { ThreadSkeleton } from "@/components/thread/thread-skeleton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type LoadState = { status: "loading" } | { status: "missing" } | { status: "ready"; thread: Thread };

export function DraftEditor({ id }: { id: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getDraft(id)
      .then((thread) => {
        if (!cancelled) setState(thread ? { status: "ready", thread } : { status: "missing" });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "missing" });
          toast.error("Couldn't load this draft.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const setThread = (thread: Thread) => setState({ status: "ready", thread });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/app/drafts"
        className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-2 mb-4" })}
      >
        <ArrowLeftIcon />
        All drafts
      </Link>

      {state.status === "loading" && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <ThreadSkeleton count={4} />
        </div>
      )}

      {state.status === "missing" && (
        <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-20 text-center">
          <FileQuestionIcon className="size-8 text-muted-foreground" />
          <h1 className="mt-4 font-semibold">Draft not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">It may have been deleted.</p>
          <Link href="/app/drafts" className={buttonVariants({ className: "mt-6" })}>
            Back to drafts
          </Link>
        </div>
      )}

      {state.status === "ready" && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Badge variant={state.thread.source === "generated" ? "default" : "secondary"}>
              {state.thread.source === "generated" ? "Generated" : "Optimized"}
            </Badge>
            <Input
              value={state.thread.title}
              onChange={(e) => setThread({ ...state.thread, title: e.target.value })}
              aria-label="Draft title"
              placeholder="Untitled thread"
              className="h-auto border-none px-0 text-2xl font-semibold tracking-tight shadow-none focus-visible:ring-0 md:text-2xl dark:bg-transparent"
            />
          </div>
          <ThreadPreview
            thread={state.thread}
            onChange={setThread}
            onSaved={setThread}
            saveLabel="Save changes"
          />
        </div>
      )}
    </div>
  );
}
