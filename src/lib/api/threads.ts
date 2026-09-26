/**
 * Data layer for threads, drafts and usage.
 * UI components call ONLY these functions. They're backed by src/lib/mock
 * for now and will switch to the real backend (Supabase + src/lib/ai) later.
 */
import type { GenerateOptions, OptimizeResult, Thread, Tweet, Usage } from "@/types";
import * as mock from "@/lib/mock/threads";

export { UsageLimitError } from "@/lib/errors";

/** Throws UsageLimitError when the monthly free limit is reached. */
export async function generateThread(options: GenerateOptions): Promise<Thread> {
  return mock.generateThread(options);
}

/** Throws UsageLimitError when the monthly free limit is reached. */
export async function optimizeThread(tweets: Tweet[]): Promise<OptimizeResult> {
  return mock.optimizeThread(tweets);
}

export async function regenerateTweet(threadId: string, tweetId: string): Promise<Tweet> {
  return mock.regenerateTweet(threadId, tweetId);
}

export async function getDrafts(): Promise<Thread[]> {
  return mock.getDrafts();
}

export async function getDraft(id: string): Promise<Thread | null> {
  return mock.getDraft(id);
}

/** Creates or updates a draft (matched by thread id). */
export async function saveDraft(thread: Thread): Promise<Thread> {
  return mock.saveDraft(thread);
}

export async function deleteDraft(id: string): Promise<void> {
  return mock.deleteDraft(id);
}

export async function getUsage(): Promise<Usage> {
  return mock.getUsage();
}

/** Demo only: restores seed drafts and usage. Remove once the backend exists. */
export async function resetDemoData(): Promise<void> {
  return mock.resetDemoData();
}
