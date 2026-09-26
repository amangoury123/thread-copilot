"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { CopyIcon, Loader2Icon, PlusIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import type { Tweet } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getTweetLength, MAX_TWEET_LENGTH } from "@/lib/twitter";
import { cn } from "@/lib/utils";

// Placeholder identity until auth exists
export const PREVIEW_AUTHOR = { name: "Your Name", handle: "@yourhandle", initials: "YN" };

interface TweetCardProps {
  tweet: Tweet;
  index: number;
  total: number;
  readOnly?: boolean;
  regenerating?: boolean;
  autoFocus?: boolean;
  /** Draw the X-style line down to the next tweet */
  connector?: boolean;
  onChange?: (text: string) => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
  onAddBelow?: () => void;
}

export function TweetCard({
  tweet,
  index,
  total,
  readOnly = false,
  regenerating = false,
  autoFocus = false,
  connector = false,
  onChange,
  onCopy,
  onRegenerate,
  onDelete,
  onAddBelow,
}: TweetCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { length, remaining, isOver } = getTweetLength(tweet.text);

  // Grow the textarea with its content
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [tweet.text]);

  return (
    <article
      className={cn(
        "group/tweet relative flex gap-3 px-4 pt-4 transition-colors",
        !readOnly && "focus-within:bg-muted/40 hover:bg-muted/30",
      )}
    >
      <div className="flex flex-col items-center">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
            {PREVIEW_AUTHOR.initials}
          </AvatarFallback>
        </Avatar>
        {connector && <div className="mt-1 w-0.5 flex-1 rounded-full bg-border" />}
      </div>

      <div className="min-w-0 flex-1 pb-3">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="truncate font-semibold">{PREVIEW_AUTHOR.name}</span>
          <span className="truncate text-muted-foreground">{PREVIEW_AUTHOR.handle}</span>
          <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {index + 1}/{total}
          </span>
        </div>

        {readOnly ? (
          <p className="mt-1 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {tweet.text}
          </p>
        ) : (
          <textarea
            ref={textareaRef}
            value={tweet.text}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={regenerating}
            autoFocus={autoFocus}
            rows={1}
            placeholder="What's happening?"
            aria-label={`Tweet ${index + 1} of ${total}`}
            className={cn(
              "mt-1 block w-full resize-none overflow-hidden bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground",
              regenerating && "animate-pulse opacity-50",
            )}
          />
        )}

        {!readOnly && (
          <div className="mt-2 flex items-center gap-1">
            <span
              className={cn(
                "mr-auto text-xs tabular-nums",
                isOver
                  ? "font-medium text-destructive"
                  : remaining <= 20
                    ? "text-amber-600 dark:text-amber-500"
                    : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {length}/{MAX_TWEET_LENGTH}
              {isOver && ` · ${Math.abs(remaining)} over`}
            </span>

            <TweetAction label="Copy tweet" onClick={onCopy}>
              <CopyIcon />
            </TweetAction>
            <TweetAction label="Regenerate" onClick={onRegenerate} disabled={regenerating}>
              {regenerating ? <Loader2Icon className="animate-spin" /> : <RefreshCwIcon />}
            </TweetAction>
            <TweetAction label="Add tweet below" onClick={onAddBelow}>
              <PlusIcon />
            </TweetAction>
            <TweetAction label="Delete tweet" onClick={onDelete} destructive>
              <Trash2Icon />
            </TweetAction>
          </div>
        )}
      </div>
    </article>
  );
}

interface TweetActionProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  children: ReactNode;
}

function TweetAction({ label, onClick, disabled, destructive, children }: TweetActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "text-muted-foreground",
              destructive ? "hover:text-destructive" : "hover:text-primary",
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
