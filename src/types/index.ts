export type Tone = "professional" | "casual" | "storytelling" | "educational";

export type ThreadLength = 5 | 7 | 10;

export type ThreadSource = "generated" | "optimized";

export type Plan = "free" | "pro";

export interface Tweet {
  id: string;
  text: string;
}

export interface Thread {
  id: string;
  title: string;
  tweets: Tweet[];
  /** ISO 8601 timestamp */
  createdAt: string;
  /** null for optimized threads, where the tone comes from the original text */
  tone: Tone | null;
  source: ThreadSource;
}

export interface GenerateOptions {
  topic: string;
  tone: Tone;
  length: ThreadLength;
  audience?: string;
  includeCta: boolean;
}

export interface OptimizeResult {
  original: Tweet[];
  optimized: Tweet[];
  improvements: string[];
}

export interface Usage {
  used: number;
  limit: number;
  plan: Plan;
}
