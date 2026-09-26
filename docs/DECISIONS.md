# Decisions

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-26 | No X API in the MVP; use "Copy thread" + X intent link instead. | The X API is expensive and adds OAuth/posting complexity that isn't needed to test the core writing value. |
| 2026-09-26 | Build a mock data layer (`src/lib/mock` behind `src/lib/api`) first. | Lets the frontend be built and tested before the backend exists, then swapped out without touching UI code. |
| 2026-09-26 | Postpone DigitalOcean. | Only needed for background jobs or scheduling, which the MVP doesn't have; Vercel covers hosting for now. |
| 2026-09-26 | Price in USD first, with an INR toggle. | The core audience (indie hackers on X) is global and thinks in dollars; INR prices (₹799 Pro vs a straight ₹1,000 conversion) keep it affordable for Indian builders, where we're based and where Razorpay works best. |
| 2026-09-26 | Pro gets a 150-threads/month fair-use limit instead of "unlimited". | Every thread costs real LLM tokens; a clear cap protects margins from heavy/abusive use while still covering ~5 threads a day, more than any real Pro user needs. Creator (400) covers genuine high-volume users. |
| 2026-09-26 | All features on every plan; plans differ only by volume (+ Premium AI mode on Creator). | Free users experience the full product (including the Optimizer), which sells the upgrade better than locked features, and keeps the UI free of gating logic. |
| 2026-09-26 | Yearly toggle says "Save up to 25%" and each card shows its real yearly saving. | Yearly discounts differ by plan (Pro 25%, Creator ~17%), so a single "2 months free" label would be inaccurate. |
