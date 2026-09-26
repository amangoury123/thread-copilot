import type {
  GenerateOptions,
  OptimizeResult,
  Thread,
  Tweet,
  Usage,
} from "@/types";
import { UsageLimitError } from "@/lib/errors";
import { createId, deriveTitle } from "@/lib/thread-utils";
import { getTweetLength } from "@/lib/twitter";
import { REGEN_POOL, SEED_DRAFTS, TEMPLATES } from "./data";
import { readJSON, removeKey, writeJSON } from "./storage";

const DRAFTS_KEY = "drafts";
const USAGE_KEY = "usage";
const FREE_LIMIT = 5;
const SEED_USED = 3;

const CTA_PATTERN = /\b(follow|repost|retweet|bookmark|reply|subscribe|dm me)\b/i;
const NUMBERED_PATTERN = /^\s*\d{1,2}(?:[.)]|\/)\s*/;

// ---------- helpers ----------

function delay(): Promise<void> {
  const ms = 1000 + Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pick<T>(items: readonly T[], exclude?: T): T {
  const pool = items.length > 1 ? items.filter((item) => item !== exclude) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Topic phrased for use mid-sentence, e.g. "Growing a newsletter" -> "growing a newsletter". */
function topicPhrase(topic: string): string {
  const firstLine = topic.trim().split("\n")[0].replace(/[.!?:]+$/, "").trim();
  const short =
    firstLine.length > 60 ? firstLine.slice(0, 57).replace(/\s+\S*$/, "") : firstLine;
  const keepCase = short.length > 1 && short[1] === short[1].toUpperCase();
  return keepCase ? short : short.charAt(0).toLowerCase() + short.slice(1);
}

function toTitle(phrase: string): string {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

function toTweets(texts: string[]): Tweet[] {
  return texts.map((text) => ({ id: createId(), text }));
}

// ---------- in-memory metadata for regenerateTweet ----------

type TweetRole = "hook" | "body" | "cta";

interface TweetMeta {
  role: TweetRole;
  topic: string;
}

const tweetMeta = new Map<string, TweetMeta>();

function roleAt(index: number, tweets: Tweet[]): TweetRole {
  if (index === 0) return "hook";
  if (index === tweets.length - 1 && CTA_PATTERN.test(tweets[index].text)) return "cta";
  return "body";
}

function registerTweets(tweets: Tweet[], topic: string): void {
  tweets.forEach((tweet, i) => tweetMeta.set(tweet.id, { role: roleAt(i, tweets), topic }));
}

// ---------- usage ----------

interface StoredUsage extends Usage {
  period: string;
}

function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function loadUsage(): StoredUsage {
  const stored = readJSON<StoredUsage>(USAGE_KEY, {
    used: SEED_USED,
    limit: FREE_LIMIT,
    plan: "free",
    period: currentPeriod(),
  });
  // Monthly reset
  return stored.period === currentPeriod()
    ? stored
    : { ...stored, used: 0, period: currentPeriod() };
}

function publicUsage({ used, limit, plan }: StoredUsage): Usage {
  return { used, limit, plan };
}

function assertCanUse(): void {
  const usage = loadUsage();
  if (usage.plan === "free" && usage.used >= usage.limit) {
    throw new UsageLimitError(publicUsage(usage));
  }
}

function consumeUsage(): void {
  const usage = loadUsage();
  writeJSON<StoredUsage>(USAGE_KEY, { ...usage, used: usage.used + 1 });
}

// ---------- drafts ----------

function loadDrafts(): Thread[] {
  return readJSON<Thread[]>(DRAFTS_KEY, SEED_DRAFTS);
}

function storeDrafts(drafts: Thread[]): void {
  writeJSON(DRAFTS_KEY, drafts);
}

// ---------- public mock API ----------

export async function generateThread(options: GenerateOptions): Promise<Thread> {
  assertCanUse();
  await delay();

  const template = TEMPLATES[options.tone];
  const topic = topicPhrase(options.topic);
  const bodyCount = options.length - 1 - (options.includeCta ? 1 : 0);
  const body = template.body
    .slice(0, bodyCount)
    .map((text, i) => `${i + 1}. ${text}`);

  const texts = [template.hook(topic, bodyCount), ...body];
  if (options.includeCta) texts.push(template.cta(topic));

  const tweets = toTweets(texts);
  registerTweets(tweets, topic);
  consumeUsage();

  return {
    id: createId(),
    title: toTitle(topic),
    tweets,
    createdAt: new Date().toISOString(),
    tone: options.tone,
    source: "generated",
  };
}

const FILLERS: RegExp[] = [
  /\bI (?:really )?think (?:that )?/gi,
  /\bat the end of the day,? /gi,
  /\b(?:really|very|basically|actually|literally|just|honestly) /gi,
];

const REPLACEMENTS: [RegExp, string][] = [
  [/\bin order to\b/gi, "to"],
  [/\ba lot of\b/gi, "many"],
  [/\bthe fact that\b/gi, "that"],
];

function capitalizeSentences(text: string): string {
  return text.replace(/(^|[.!?]\s+|\n\s*)([a-z])/g, (_, prefix: string, char: string) => prefix + char.toUpperCase());
}

export async function optimizeThread(tweets: Tweet[]): Promise<OptimizeResult> {
  assertCanUse();
  await delay();

  let fillerCount = 0;
  let hashtagCount = 0;
  let splitCount = 0;

  const cleaned = tweets.map((tweet) => {
    let text = tweet.text;

    for (const pattern of FILLERS) {
      fillerCount += text.match(pattern)?.length ?? 0;
      text = text.replace(pattern, "");
    }
    for (const [pattern, replacement] of REPLACEMENTS) {
      fillerCount += text.match(pattern)?.length ?? 0;
      text = text.replace(pattern, replacement);
    }

    const hashtags = text.match(/\s*#\w+/g);
    if (hashtags) {
      hashtagCount += hashtags.length;
      text = text.replace(/\s*#\w+/g, "");
    }

    text = text.replace(/[ \t]{2,}/g, " ").trim();

    // Break dense single-paragraph tweets into skimmable lines
    const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
    if (!text.includes("\n") && text.length > 160 && sentences.length >= 2) {
      text = sentences.join("\n\n");
      splitCount += 1;
    }

    return capitalizeSentences(text);
  });

  const improvements: string[] = [];

  // Hook: make it obvious there's more to read
  if (cleaned.length > 1 && !/🧵|👇|thread/i.test(cleaned[0])) {
    cleaned[0] = `${cleaned[0]}\n\n🧵👇`;
    improvements.push("Added a clear 🧵 cue to the hook so readers know there's more to expand.");
  }

  if (fillerCount > 0) {
    improvements.push(
      `Cut ${fillerCount} filler word${fillerCount === 1 ? "" : "s"} (like "really", "just", "I think") to make every line hit harder.`,
    );
  }
  if (hashtagCount > 0) {
    improvements.push(
      `Removed ${hashtagCount} hashtag${hashtagCount === 1 ? "" : "s"}. They rarely add reach on X and make threads look spammy.`,
    );
  }
  if (splitCount > 0) {
    improvements.push(
      `Broke ${splitCount} dense tweet${splitCount === 1 ? "" : "s"} into short lines so ${splitCount === 1 ? "it's" : "they're"} easier to skim on mobile.`,
    );
  }

  // Numbering for body tweets
  const alreadyNumbered = cleaned.slice(1).some((text) => NUMBERED_PATTERN.test(text));
  if (cleaned.length >= 3 && !alreadyNumbered) {
    for (let i = 1; i < cleaned.length; i++) cleaned[i] = `${i + 1}/ ${cleaned[i]}`;
    improvements.push("Added 2/, 3/… numbering so readers can track their progress through the thread.");
  }

  // Closing CTA
  if (!CTA_PATTERN.test(cleaned[cleaned.length - 1] ?? "")) {
    cleaned.push(
      "If this was useful:\n\n1. Follow me for more lessons like this\n2. Repost the first tweet so other builders see it\n\nWhat would you add? 👇",
    );
    improvements.push("Added a closing CTA (follow + repost + question). Threads without one leave engagement on the table.");
  }

  const overLimit = cleaned
    .map((text, i) => (getTweetLength(text).isOver ? i + 1 : null))
    .filter((n): n is number => n !== null);
  if (overLimit.length > 0) {
    improvements.push(
      `Tweet${overLimit.length === 1 ? "" : "s"} ${overLimit.join(", ")} still ${overLimit.length === 1 ? "goes" : "go"} over 280 characters. Consider splitting ${overLimit.length === 1 ? "it" : "them"}.`,
    );
  }

  if (improvements.length === 0) {
    improvements.push(
      "Your thread was already in great shape: strong hook, clear structure, and a CTA.",
      "Checked every tweet against the 280-character limit.",
    );
  }

  const optimized = toTweets(cleaned);
  registerTweets(optimized, topicPhrase(deriveTitle(optimized)));
  consumeUsage();

  return { original: tweets, optimized, improvements };
}

export async function regenerateTweet(threadId: string, tweetId: string): Promise<Tweet> {
  await delay();

  let meta = tweetMeta.get(tweetId);
  let currentText: string | undefined;

  const draft = loadDrafts().find((thread) => thread.id === threadId);
  if (draft) {
    const index = draft.tweets.findIndex((tweet) => tweet.id === tweetId);
    if (index >= 0) {
      currentText = draft.tweets[index].text;
      meta ??= { role: roleAt(index, draft.tweets), topic: topicPhrase(draft.title) };
    }
  }

  const { role, topic } = meta ?? { role: "body" as const, topic: "building in public" };

  if (role === "hook") {
    return { id: tweetId, text: pick(REGEN_POOL.hooks)(topic) };
  }
  if (role === "cta") {
    return { id: tweetId, text: pick(REGEN_POOL.ctas, currentText) };
  }

  // Keep the original numbering prefix ("3." or "3/") if there was one
  const prefix = currentText?.match(NUMBERED_PATTERN)?.[0] ?? "";
  const text = pick(REGEN_POOL.body);
  return { id: tweetId, text: `${prefix}${text}` };
}

export async function getDrafts(): Promise<Thread[]> {
  await delay();
  return [...loadDrafts()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getDraft(id: string): Promise<Thread | null> {
  await delay();
  return loadDrafts().find((thread) => thread.id === id) ?? null;
}

export async function saveDraft(thread: Thread): Promise<Thread> {
  await delay();
  const saved: Thread = {
    ...thread,
    title: thread.title.trim() || deriveTitle(thread.tweets),
    tweets: thread.tweets.filter((tweet) => tweet.text.trim()),
  };
  const drafts = loadDrafts();
  const exists = drafts.some((draft) => draft.id === saved.id);
  storeDrafts(
    exists ? drafts.map((draft) => (draft.id === saved.id ? saved : draft)) : [saved, ...drafts],
  );
  return saved;
}

export async function deleteDraft(id: string): Promise<void> {
  await delay();
  storeDrafts(loadDrafts().filter((draft) => draft.id !== id));
}

export async function getUsage(): Promise<Usage> {
  await delay();
  return publicUsage(loadUsage());
}

export async function resetDemoData(): Promise<void> {
  await delay();
  removeKey(DRAFTS_KEY);
  removeKey(USAGE_KEY);
  tweetMeta.clear();
}
