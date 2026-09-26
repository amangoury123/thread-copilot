import type { Usage } from "@/types";

/** Thrown when a free user has used all of this month's threads. */
export class UsageLimitError extends Error {
  readonly usage: Usage;

  constructor(usage: Usage) {
    super(`Monthly limit of ${usage.limit} threads reached`);
    this.name = "UsageLimitError";
    this.usage = usage;
  }
}
