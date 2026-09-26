# Progress

## Done
- **2026-09-26 — Frontend UI with mock data layer**
  - App shell: theme provider (light/dark/system via `next-themes`), `<Toaster />`, `<TooltipProvider />`, violet accent theme.
  - Shared types in `src/types` (Tweet, Thread, GenerateOptions, OptimizeResult, Usage).
  - Mock data layer: `src/lib/api/threads.ts` → `src/lib/mock/threads.ts` (1–2s delays, realistic indie-hacker threads). Drafts + usage persist in localStorage (accessed only in `src/lib/mock/storage.ts`, client-side after mount).
  - Helpers: `src/lib/twitter.ts` (twitter-text character count), `src/lib/thread-utils.ts` (split pasted threads, copy format, X intent URL).
  - `ThreadPreview` / `TweetCard`: X-style cards, inline editing, live 280 counter, copy / regenerate / delete (with undo) / add below, Copy full thread, Open in X, Save draft.
  - Routes: `/` landing, `/pricing`, `/login` (UI only), `/app` Generate, `/app/optimize` (before/after + improvements), `/app/drafts`, `/app/drafts/[id]` editor, `/app/settings`.
  - Sidebar with usage meter + Upgrade dialog; Sheet menu on mobile. Usage limit enforced in the mock (opens Upgrade dialog).
- **2026-09-26 — Project setup**
  - Next.js 16 (App Router, TypeScript strict, Tailwind v4, ESLint, `src/`, `@/*` alias).
  - shadcn/ui initialized with the base component set (+ accordion).
  - Installed `twitter-text` (+ `@types/twitter-text`) and `lucide-react`.
  - Docs: CLAUDE.md, docs/PRD.md, docs/PROGRESS.md, docs/DECISIONS.md.

## In Progress
- _(nothing yet)_

## Next — backend integration
- Supabase: auth (Google + magic link) wired to `/login`, route protection for `/app`.
- Supabase DB: `threads` and `usage` tables; swap `src/lib/mock` for real implementations behind `src/lib/api`.
- Claude API in `src/lib/ai`: Sonnet for generate/optimize, Haiku for single-tweet regenerate. Short prompts.
- Server-side usage limit enforcement + monthly reset.
- Real profile data (name, handle, avatar) in previews and Settings.
- Razorpay checkout for Pro; replace upgrade toasts.
- Remove demo-only pieces: "Reset demo data" in Settings, `resetDemoData()`, localStorage storage.
