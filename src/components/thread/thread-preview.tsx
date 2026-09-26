"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CopyIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import type { Thread, Tweet } from "@/types";
import { regenerateTweet, saveDraft } from "@/lib/api/threads";
import { buildXIntentUrl, createId, formatThread } from "@/lib/thread-utils";
import { getTweetLength } from "@/lib/twitter";
import { XLogoIcon } from "@/components/brand/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TweetCard } from "./tweet-card";

interface ThreadPreviewProps {
  thread: Thread;
  onChange: (thread: Thread) => void;
  onSaved?: (thread: Thread) => void;
  saveLabel?: string;
}

async function copyToClipboard(text: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch {
    toast.error("Couldn't copy. Check your browser's clipboard permissions.");
  }
}

export function ThreadPreview({ thread, onChange, onSaved, saveLabel = "Save draft" }: ThreadPreviewProps) {
  const router = useRouter();
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Async actions resolve later; always apply them to the latest thread, not a stale closure.
  const latest = useRef(thread);
  useEffect(() => {
    latest.current = thread;
  }, [thread]);

  const tweets = thread.tweets;
  const overLimitCount = tweets.filter((t) => getTweetLength(t.text).isOver).length;

  function setTweets(next: Tweet[]) {
    const current = { ...latest.current, tweets: next };
    latest.current = current;
    onChange(current);
  }

  function handleEdit(id: string, text: string) {
    setTweets(latest.current.tweets.map((t) => (t.id === id ? { ...t, text } : t)));
  }

  async function handleRegenerate(id: string) {
    setRegeneratingId(id);
    try {
      const fresh = await regenerateTweet(thread.id, id);
      setTweets(latest.current.tweets.map((t) => (t.id === id ? { ...t, text: fresh.text } : t)));
      toast.success("Tweet regenerated");
    } catch {
      toast.error("Couldn't regenerate this tweet. Try again.");
    } finally {
      setRegeneratingId(null);
    }
  }

  function handleDelete(id: string) {
    const current = latest.current.tweets;
    if (current.length <= 1) {
      toast.error("A thread needs at least one tweet.");
      return;
    }
    const index = current.findIndex((t) => t.id === id);
    const removed = current[index];
    setTweets(current.filter((t) => t.id !== id));
    toast("Tweet deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          const restored = [...latest.current.tweets];
          restored.splice(Math.min(index, restored.length), 0, removed);
          setTweets(restored);
        },
      },
    });
  }

  function handleAddBelow(id: string) {
    const current = latest.current.tweets;
    const index = current.findIndex((t) => t.id === id);
    const newTweet: Tweet = { id: createId(), text: "" };
    setTweets([...current.slice(0, index + 1), newTweet, ...current.slice(index + 1)]);
    setFocusId(newTweet.id);
    toast.success(`Tweet added at position ${index + 2}`);
  }

  function handleCopyThread() {
    const text = formatThread(tweets);
    if (!text) {
      toast.error("Nothing to copy yet.");
      return;
    }
    void copyToClipboard(text, `Copied ${tweets.filter((t) => t.text.trim()).length} tweets to clipboard`);
  }

  function handleOpenInX() {
    const first = tweets.find((t) => t.text.trim());
    if (!first) {
      toast.error("Write your first tweet before opening X.");
      return;
    }
    window.open(buildXIntentUrl(first.text.trim()), "_blank", "noopener,noreferrer");
    toast.info("Opened X with your first tweet", {
      description: "Post it, then add the rest of the thread as replies.",
    });
  }

  async function handleSave() {
    if (!tweets.some((t) => t.text.trim())) {
      toast.error("Add some text before saving.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveDraft(latest.current);
      toast.success("Draft saved", {
        action: { label: "View drafts", onClick: () => router.push("/app/drafts") },
      });
      onSaved?.(saved);
    } catch {
      toast.error("Couldn't save the draft. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {tweets.length} tweet{tweets.length === 1 ? "" : "s"}
          </span>
          {overLimitCount > 0 && (
            <Badge variant="destructive">{overLimitCount} over limit</Badge>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleCopyThread}>
          <CopyIcon />
          Copy full thread
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleOpenInX}>
          <XLogoIcon className="size-3.5" />
          Open in X
        </Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
          {saving ? "Saving…" : saveLabel}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        {tweets.map((tweet, i) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            index={i}
            total={tweets.length}
            connector={i < tweets.length - 1}
            autoFocus={tweet.id === focusId}
            regenerating={regeneratingId === tweet.id}
            onChange={(text) => handleEdit(tweet.id, text)}
            onCopy={() => void copyToClipboard(tweet.text, `Tweet ${i + 1} copied`)}
            onRegenerate={() => void handleRegenerate(tweet.id)}
            onDelete={() => handleDelete(tweet.id)}
            onAddBelow={() => handleAddBelow(tweet.id)}
          />
        ))}
      </div>
    </div>
  );
}
