import type { Tweet } from "@/types";

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Matches "1/", "2/ ", "3/10" at the start of a line.
const NUMBER_MARKER = /^[ \t]*\d{1,2}[ \t]*\/[ \t]*(?:\d{1,2})?[ \t]*/gm;

/**
 * Splits a pasted thread into tweet texts.
 * Uses "1/", "2/" markers when there are at least two, otherwise blank lines.
 */
export function splitThread(raw: string): string[] {
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const markers = [...text.matchAll(NUMBER_MARKER)];
  if (markers.length >= 2) {
    const parts: string[] = [];
    const leading = text.slice(0, markers[0].index).trim();
    if (leading) parts.push(leading);
    markers.forEach((match, i) => {
      const start = match.index + match[0].length;
      const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
      parts.push(text.slice(start, end).trim());
    });
    return parts.filter(Boolean);
  }

  return text
    .split(/\n[ \t]*\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function formatThread(tweets: Tweet[]): string {
  return tweets
    .map((tweet) => tweet.text.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function buildXIntentUrl(text: string): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

/** First line of the first tweet, trimmed to a card-friendly length. */
export function deriveTitle(tweets: Tweet[]): string {
  const firstLine = tweets[0]?.text.trim().split("\n")[0]?.trim() ?? "";
  if (!firstLine) return "Untitled thread";
  return firstLine.length > 70
    ? `${firstLine.slice(0, 67).replace(/\s+\S*$/, "")}…`
    : firstLine;
}
