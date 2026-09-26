# Progress

## Done
- **2026-09-26 — Project setup**
  - Next.js 16 (App Router, TypeScript strict, Tailwind v4, ESLint, `src/`, `@/*` alias).
  - shadcn/ui initialized; added button, card, textarea, input, label, tabs, badge, dialog, dropdown-menu, select, switch, sonner, skeleton, separator, sheet, avatar, tooltip.
  - Installed `twitter-text` (+ `@types/twitter-text`) and `lucide-react`.
  - Folder skeleton: `src/lib/api`, `src/lib/mock`, `src/lib/ai`, `src/types`.
  - Docs: CLAUDE.md, docs/PRD.md, docs/PROGRESS.md, docs/DECISIONS.md.
  - Git repo initialized with first commit.

## In Progress
- _(nothing yet)_

## Next
- App shell: root layout with theme provider (light/dark via `next-themes`), `<Toaster />`, `<TooltipProvider />`, header and navigation.
- Shared types in `src/types` (Thread, Tweet, Draft, Usage).
- Mock data layer in `src/lib/mock` + API functions in `src/lib/api`.
- Character-count utility built on `twitter-text`.
- Thread Generator UI.
