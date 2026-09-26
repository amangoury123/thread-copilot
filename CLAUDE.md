# Thread Copilot

## What we're building
An AI tool that helps indie hackers and business builders write and optimize Twitter/X threads. Differentiator: tight, high-quality AI writing assistance (not scheduling like Typefully, not engagement tools like Postwise).

## MVP features
- Thread Generator: topic/notes -> structured thread (hook, body, CTA)
- Thread Optimizer: paste existing thread -> improved version + list of changes
- Saved Drafts
- Freemium usage limit (free threads per month, then paid plan)
- NO direct X posting in MVP. Use "Copy thread" + X intent link instead.

## Tech stack
- Next.js (App Router, TypeScript strict), Tailwind CSS, shadcn/ui, lucide-react
- Hosting: Vercel
- Database + Auth: Supabase (added later)
- AI: Claude API — Haiku for light tasks, Sonnet for generation (added later)
- Payments: Razorpay (added later)
- Email: SendGrid (added later)

## Folder structure
- src/app — routes
- src/components — UI components (src/components/ui = shadcn)
- src/lib/api — ALL data-fetching functions. UI must only call functions from here.
- src/lib/mock — mock implementations used until the backend exists
- src/types — shared TypeScript types

## Rules
- TypeScript strict, no `any`.
- UI components never call fetch or LLM APIs directly — always go through src/lib/api.
- All LLM calls (later) must live in one place: src/lib/ai. Keep prompts short to save tokens.
- Use twitter-text for character counting, never string.length.
- Mobile-responsive by default. Support light and dark mode.
- After finishing any task: run `npm run build` to check for errors, update docs/PROGRESS.md, and make a git commit with a clear message.

## Commands
- npm run dev — start dev server
- npm run build — production build check

## Next.js version notes
@AGENTS.md
