/**
 * The only place in the app that touches localStorage.
 *
 * These helpers are called exclusively from async mock functions, which the UI
 * invokes from effects or event handlers — i.e. on the client, after mount.
 * On the server they fall back to defaults, so nothing read here can ever be
 * part of the server-rendered HTML (no hydration mismatches).
 */

const PREFIX = "thread-copilot:";

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode) — the mock just won't persist.
  }
}

export function removeKey(key: string): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}
