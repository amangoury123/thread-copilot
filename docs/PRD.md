# Thread Copilot — Product Requirements (MVP)

## Summary
Thread Copilot helps indie hackers and business builders write and improve Twitter/X threads with AI. The focus is writing quality, not scheduling or engagement automation.

## Target users
- Indie hackers sharing build-in-public updates, launches and lessons.
- Founders and business builders turning expertise into audience growth.
- Common pain: they have ideas and notes, but struggle with hooks, structure and brevity.

## Goals
- Go from raw idea to a publish-ready thread in under 2 minutes.
- Improve an existing thread and explain *why* each change was made.
- Validate willingness to pay via a simple freemium limit.

## Non-goals (MVP)
- Direct posting or scheduling to X (no X API).
- Analytics, engagement tools, auto-replies.
- Team workspaces or multi-account support.

---

## Feature 1: Thread Generator
Turn a topic or rough notes into a structured thread: hook → body → CTA.

**User flow**
1. User opens **Generate**.
2. Enters a topic or pastes notes (required).
3. Optionally sets: tone (e.g. casual, professional, bold), target length (number of tweets), and CTA goal (e.g. follow, visit link, reply).
4. Clicks **Generate**. A loading state shows skeleton tweets.
5. Result shows each tweet as an editable card with a live character count (via `twitter-text`, 280 limit) and a label: Hook / Body / CTA.
6. User can edit any tweet, regenerate the whole thread, or regenerate the hook only.
7. User can **Copy thread**, **Open in X** (intent link for the first tweet), or **Save draft**.

**Acceptance criteria**
- Every generated tweet is ≤ 280 weighted characters; over-limit tweets are highlighted.
- Empty input disables the Generate button.
- One generation counts as one use toward the monthly limit.

## Feature 2: Thread Optimizer
Paste an existing thread and get an improved version plus a list of changes.

**User flow**
1. User opens **Optimize**.
2. Pastes a thread. Tweets are split by blank lines or numbering (e.g. "1/", "2/").
3. The app shows the parsed tweets so the user can confirm the split.
4. Optionally selects a focus: stronger hook, clarity, brevity, CTA.
5. Clicks **Optimize**.
6. Result shows the original and improved versions side by side (stacked on mobile), plus a **Changes** list. Each change has a short reason (e.g. "Hook: led with the outcome instead of the backstory").
7. User can edit, copy, open in X, or save as draft.

**Acceptance criteria**
- The changes list is always present and specific (no generic "improved wording").
- Improved tweets respect the 280 limit.
- One optimization counts as one use.

## Feature 3: Saved Drafts
Keep threads to revisit and edit later.

**User flow**
1. From a Generator or Optimizer result, user clicks **Save draft**. A toast confirms it.
2. **Drafts** page lists drafts with title (first line of the hook), tweet count, source (Generated/Optimized) and last-edited date.
3. User opens a draft to edit, copy, or open in X. Edits save explicitly.
4. User can delete a draft (with confirmation dialog).

**Acceptance criteria**
- Drafts persist between sessions (mock layer first, Supabase later).
- Empty state explains how to create a first draft.

## Feature 4: Freemium usage limit
Free users get a fixed number of threads per month; paid users get more or unlimited.

**User flow**
1. A usage badge (e.g. "3 / 5 threads this month") is visible in the app header.
2. When the limit is reached, Generate/Optimize open an **Upgrade** dialog instead of running.
3. Upgrade dialog shows plan comparison and a **Upgrade** button (Razorpay checkout later; mock for now).
4. Usage resets on the first day of each month.

**Acceptance criteria**
- Limit is enforced server-side once the backend exists (UI check alone is not enough).
- Editing, copying and saving drafts do not count as usage.

## Feature 5: Copy thread + X intent link (no direct posting)
**User flow**
1. **Copy thread** copies all tweets, separated by blank lines, and shows a toast.
2. **Copy** on a single tweet copies just that tweet.
3. **Open in X** opens `https://x.com/intent/post?text=...` with the first tweet prefilled. The user posts the rest as replies manually.

**Acceptance criteria**
- Works on mobile and desktop.
- No X API calls anywhere in the MVP.

---

## Cross-cutting requirements
- Mobile-responsive, light and dark mode.
- All data access goes through `src/lib/api` (backed by `src/lib/mock` until the backend exists).
- AI calls live only in `src/lib/ai`. Haiku for light tasks (e.g. splitting, hook rewrite), Sonnet for full generation and optimization.
