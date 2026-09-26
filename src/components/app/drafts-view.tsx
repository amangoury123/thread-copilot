"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileTextIcon, Loader2Icon, SparklesIcon, Trash2Icon, WandSparklesIcon } from "lucide-react";
import { toast } from "sonner";
import type { Thread } from "@/types";
import { deleteDraft, getDrafts } from "@/lib/api/threads";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "./page-header";

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function DraftsView() {
  const [drafts, setDrafts] = useState<Thread[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Thread | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getDrafts()
      .then((result) => {
        if (!cancelled) setDrafts(result);
      })
      .catch(() => {
        if (!cancelled) {
          setDrafts([]);
          toast.error("Couldn't load your drafts.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteDraft(pendingDelete.id);
      setDrafts((current) => current?.filter((d) => d.id !== pendingDelete.id) ?? null);
      toast.success("Draft deleted");
      setPendingDelete(null);
    } catch {
      toast.error("Couldn't delete the draft. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Drafts"
        description="Threads you've saved. Open one to keep editing, copy it, or post it."
        actions={
          drafts && drafts.length > 0 ? (
            <Link href="/app" className={buttonVariants({ size: "sm" })}>
              <SparklesIcon />
              New thread
            </Link>
          ) : null
        }
      />

      {drafts === null ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <EmptyDrafts />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <Card key={draft.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Badge variant={draft.source === "generated" ? "default" : "secondary"}>
                    {draft.source === "generated" ? "Generated" : "Optimized"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {dateFormat.format(new Date(draft.createdAt))}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 leading-snug">{draft.title}</CardTitle>
                <CardDescription>
                  {draft.tweets.length} tweet{draft.tweets.length === 1 ? "" : "s"}
                  {draft.tone && ` · ${draft.tone.charAt(0).toUpperCase()}${draft.tone.slice(1)}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm whitespace-pre-line text-muted-foreground">
                  {draft.tweets[0]?.text}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Link
                  href={`/app/drafts/${draft.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
                >
                  Open
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete "${draft.title}"`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setPendingDelete(draft)}
                >
                  <Trash2Icon />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this draft?</DialogTitle>
            <DialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will be permanently deleted. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting && <Loader2Icon className="animate-spin" />}
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EmptyDrafts() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileTextIcon className="size-5" />
      </div>
      <h2 className="mt-4 font-semibold">No drafts yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Generate or optimize a thread, then hit &ldquo;Save draft&rdquo; to keep it here.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/app" className={buttonVariants()}>
          <SparklesIcon />
          Generate a thread
        </Link>
        <Link href="/app/optimize" className={buttonVariants({ variant: "outline" })}>
          <WandSparklesIcon />
          Optimize a thread
        </Link>
      </div>
    </div>
  );
}
