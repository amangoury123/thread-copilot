# thread-copilot

This repo for Thread Copilot, an AI-powered Twitter/X thread writing and optimization tool for indie hackers and business builders.

## Features (MVP)
- **Thread Generator**: topic or rough notes → structured thread (hook, body, CTA)
- **Thread Optimizer**: paste an existing thread → improved version + list of changes
- **Saved Drafts**
- **Freemium usage limit** (5 free threads/month, then Pro)
- Copy thread + "Open in X" (no direct posting in the MVP)

The frontend currently runs on a mock data layer (`src/lib/mock`); the backend (Supabase, Claude API, Razorpay) comes next.

## Tech stack
Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui, lucide-react, twitter-text.

## Getting started
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

- `npm run build` — production build check
- `npm run lint` — lint

## Docs
- [docs/PRD.md](docs/PRD.md) — product requirements
- [docs/PROGRESS.md](docs/PROGRESS.md) — what's done and what's next
- [docs/DECISIONS.md](docs/DECISIONS.md) — decision log
- [CLAUDE.md](CLAUDE.md) — project rules and structure
