# Progress

## Done
- **2026-09-26 — New pricing: 3 tiers, yearly billing, founding member offer**
  - `src/lib/plans.ts` is the single source of truth: Free (5/mo), Pro ($12 / ₹799, $9 / ₹599 yearly, 150/mo), Creator ($29 / ₹1,999, $24 / ₹1,599 yearly, 400/mo + Premium AI mode), founding member offer (Pro at $7 / ₹499, first 100 users), comparison rows, price helpers.
  - Every plan includes every feature; plans differ only by volume. No feature gating in the UI.
  - `/pricing`: Monthly/Yearly toggle ("Save up to 25%"), USD/INR toggle (default USD), founding member banner, 3 cards (Pro highlighted), per-card yearly savings, guarantee line, value line, comparison table (horizontal scroll on mobile), pricing FAQ.
  - Landing page reuses the same `PricingCards` component.
  - Mock usage limits now come from `plans.ts` and apply to every plan; Upgrade dialog shows the plans above the current one; Settings and the usage meter show the correct plan name and limit.
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
- Razorpay checkout for Pro and Creator (monthly + yearly, USD + INR); replace upgrade toasts.
- Founding member offer: real spot counter (currently a static constant of 100) and locked-in pricing.
- Premium AI mode for Creator (higher-quality model in `src/lib/ai`).
- Remove demo-only pieces: "Reset demo data" in Settings, `resetDemoData()`, localStorage storage.
