# Decisions

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-26 | No X API in the MVP; use "Copy thread" + X intent link instead. | The X API is expensive and adds OAuth/posting complexity that isn't needed to test the core writing value. |
| 2026-09-26 | Build a mock data layer (`src/lib/mock` behind `src/lib/api`) first. | Lets the frontend be built and tested before the backend exists, then swapped out without touching UI code. |
| 2026-09-26 | Postpone DigitalOcean. | Only needed for background jobs or scheduling, which the MVP doesn't have; Vercel covers hosting for now. |
