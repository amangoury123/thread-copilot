import * as twitterTextModule from "twitter-text";

// twitter-text's ESM build has only a default export, while @types/twitter-text
// declares named exports. Unwrap the default at runtime, keeping the types.
type TwitterText = typeof twitterTextModule;
const twitterText: TwitterText =
  "default" in twitterTextModule
    ? (twitterTextModule as { default: TwitterText }).default
    : twitterTextModule;

export const MAX_TWEET_LENGTH = 280;

export interface TweetLength {
  /** Weighted length as X counts it (URLs = 23, most emoji = 2, etc.) */
  length: number;
  remaining: number;
  isOver: boolean;
}

export function getTweetLength(text: string): TweetLength {
  const { weightedLength } = twitterText.parseTweet(text);
  return {
    length: weightedLength,
    remaining: MAX_TWEET_LENGTH - weightedLength,
    isOver: weightedLength > MAX_TWEET_LENGTH,
  };
}
