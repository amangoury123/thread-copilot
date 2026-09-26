import type { Thread, Tone } from "@/types";

export interface ThreadTemplate {
  hook: (topic: string, count: number) => string;
  /** Unnumbered insights; the generator adds "1.", "2." … */
  body: string[];
  cta: (topic: string) => string;
}

export const TEMPLATES: Record<Tone, ThreadTemplate> = {
  professional: {
    hook: (t, n) =>
      `I've spent the last 3 years learning ${t} the hard way.\n\nHere are ${n} lessons that actually moved the needle (most founders learn these too late): 🧵`,
    body: [
      "Talk to users before you write code.\n\nFive customer calls will teach you more than five weeks of building. Ask about their last painful week, not about your idea.",
      "Charge from day one.\n\nFree users give you compliments. Paying users give you feedback. Only one of those keeps the lights on.",
      "Narrow beats broad.\n\n\"Project management for everyone\" loses to \"client portals for freelance designers\" every time. A small niche is easier to reach and easier to win.",
      "Distribution is half the product.\n\nIf you can't explain where your first 100 users come from, you don't have a plan yet. You have a hope.",
      "Ship ugly, then iterate.\n\nMy first version had one feature and a payment link. It made $340 in month one. Polish came after proof.",
      "Measure one number.\n\nPick the metric that matters most right now (activation, retention, or revenue) and ignore the rest until it moves.",
      "Write in public.\n\nEvery lesson you share compounds. My best customers found me through a thread I almost didn't post.",
      "Protect your focus.\n\nSay no to features one customer wants. Say yes to problems ten customers share.",
      "Consistency beats intensity.\n\n30 minutes every day outperforms a 12-hour weekend sprint followed by two weeks of burnout.",
    ],
    cta: (t) =>
      `That's a wrap.\n\nIf you found this useful:\n\n1. Follow me for more on ${t}\n2. Repost the first tweet to help another founder\n\nWhat would you add to this list?`,
  },
  casual: {
    hook: (t, n) =>
      `Let's talk about ${t} 👇\n\nI got this wrong for way too long. Here are ${n} things I wish someone had told me sooner:`,
    body: [
      "Stop overthinking the idea.\n\nSeriously. The idea is maybe 10% of it. The other 90% is showing up, shipping, and talking to people.",
      "Your first version will be embarrassing.\n\nGood. If it isn't, you launched too late. Nobody remembers v1 anyway.",
      "Talk to actual humans.\n\nNot your friends. Not your mom. People who have the problem and would pay to make it go away.",
      "Tweet what you're building.\n\nEven if 12 people see it. Those 12 turn into 120, then 1,200. It adds up faster than you think.",
      "Don't copy the big players.\n\nThey have 50 engineers and a marketing team. You have speed and a direct line to your users. Use that.",
      "Pricing is scary. Do it anyway.\n\nI undercharged for 6 months. Doubled my price and… nobody left. Lesson learned.",
      "Burnout is real.\n\nTake the weekend off. The code will still be broken on Monday, and you'll fix it faster.",
      "Celebrate tiny wins.\n\nFirst signup. First $1. First \"this is awesome\" DM. They're fuel for the hard weeks.",
      "Just start.\n\nThe best time was a year ago. The second best time is tonight after dinner.",
    ],
    cta: (t) =>
      `That's it! 🙌\n\nIf this helped, give me a follow. I share what I'm learning about ${t} every week.\n\nAnd tell me: which one hit home for you?`,
  },
  storytelling: {
    hook: (t) =>
      `18 months ago I knew nothing about ${t}.\n\nToday it pays my rent.\n\nHere's the whole story: the wins, the mistakes, and what I'd do differently. 🧵`,
    body: [
      "It started with a problem I had myself.\n\nI was spending 3 hours a week on something that should take 10 minutes. So I built a tiny script to fix it.",
      "I shared it in a small community.\n\n47 people asked for access in 24 hours. That's when I realized it wasn't just my problem.",
      "Then I made every classic mistake.\n\nSpent 2 months on features nobody asked for. Launched to crickets. Almost quit.",
      "The turning point was one email.\n\nA user wrote: \"I'd pay for this if it did X.\" I built X in a weekend. She became customer #1.",
      "From there, I talked to everyone.\n\n50 calls in 30 days. Every call ended with the same question: \"What would make this a no-brainer for you?\"",
      "Growth came from content, not ads.\n\nI wrote one thread a week about what I was learning. Three of them took off and drove 80% of signups.",
      "The numbers today:\n\n• 312 paying customers\n• $8.4k MRR\n• 0 employees\n• 1 very tired but happy founder",
      "What I'd do differently:\n\nCharge earlier. Talk to users sooner. Build less. Write more.",
      "The biggest lesson?\n\nYou don't need a perfect idea. You need a real problem, a little patience, and the willingness to look foolish in public.",
    ],
    cta: () =>
      "If you made it this far, thank you.\n\nI'm sharing the rest of this journey in public. Follow along, and repost the first tweet if it resonated. 🙏",
  },
  educational: {
    hook: (t, n) =>
      `${capitalize(t)}, explained simply.\n\n${n} principles that will save you months of trial and error. Bookmark this one: 🧵`,
    body: [
      "Start with the problem, not the solution.\n\nWrite down the exact pain in your customer's words. If you can't, you don't understand it yet.",
      "Validate with money, not opinions.\n\nA pre-order or a paid pilot is worth more than 100 \"I'd use that!\" replies.",
      "Use the 1-1-1 rule.\n\nOne customer type. One core problem. One channel to reach them. Expand only after this works.",
      "Price on value, not cost.\n\nIf you save someone 5 hours a month, $29 is a bargain. Anchor to the outcome, not your server bill.",
      "Build the smallest useful thing.\n\nAsk: what's the one action a user must complete to get value? Build only that path first.",
      "Onboarding is part of the product.\n\nMost churn happens in the first session. Get users to their first win in under 5 minutes.",
      "Track activation, not signups.\n\nSignups feel good. Activation (users who reach the core value) tells you if the product works.",
      "Retention is the real test.\n\nIf 40%+ of users come back in week 4, you have something. If not, fix the product before marketing it.",
      "Share the process.\n\nTeaching what you learn builds trust and an audience at the same time. It's the cheapest marketing there is.",
    ],
    cta: (t) =>
      `If this was useful:\n\n• Bookmark it for later\n• Follow me for more practical breakdowns on ${t}\n• Repost to help someone who's just getting started`,
  },
};

/** Alternatives used by regenerateTweet. */
export const REGEN_POOL = {
  hooks: [
    (t: string) =>
      `Most advice about ${t} is noise.\n\nHere's what actually works, from someone who's done it (and failed plenty along the way): 🧵`,
    (t: string) =>
      `I wish I'd read this before I started with ${t}.\n\nThe short version of everything I've learned so far 👇`,
    (t: string) =>
      `Everyone overcomplicates ${t}.\n\nIt comes down to a few simple ideas. Here they are: 🧵`,
  ],
  body: [
    "Ask for the sale.\n\nMost founders hint. Great founders ask directly: \"Would you pay $20/month for this?\" The answer tells you everything.",
    "Build an audience before you need it.\n\nThe best time to start posting was before your launch. The second best time is today.",
    "Kill features, not momentum.\n\nIf a feature isn't used by 20% of users after a month, remove it. Less surface area means faster shipping.",
    "Your competitors aren't the enemy.\n\nConfusion is. Most customers leave because they don't understand what you do, not because someone else is better.",
    "Automate the boring parts early.\n\nEvery hour spent on manual support or invoicing is an hour not spent talking to users.",
    "Write the landing page first.\n\nIf you can't explain the value in one sentence, the product isn't clear enough to build yet.",
  ],
  ctas: [
    "Found this helpful?\n\nFollow me for weekly lessons on building profitable side projects, and repost the first tweet so more builders see it. 🔁",
    "That's all for today.\n\nReply with your biggest challenge right now, and I'll share what worked for me. 👇",
  ],
};

export const SEED_DRAFTS: Thread[] = [
  {
    id: "seed-pricing",
    title: "How I priced my first SaaS",
    tone: "professional",
    source: "generated",
    createdAt: "2026-09-20T09:30:00.000Z",
    tweets: [
      {
        id: "seed-pricing-1",
        text: "Pricing my first SaaS was the scariest decision I made as a founder.\n\nI got it wrong twice before getting it right. Here's what I learned: 🧵",
      },
      {
        id: "seed-pricing-2",
        text: "1. Don't price based on your costs.\n\nPrice based on the value you create. If you save a customer 10 hours a month, $49 is cheap.",
      },
      {
        id: "seed-pricing-3",
        text: "2. Start higher than feels comfortable.\n\nIt's easier to offer a discount than to raise prices on existing customers.",
      },
      {
        id: "seed-pricing-4",
        text: "3. Offer an annual plan early.\n\n2 months free for paying yearly improved my cash flow and cut churn almost in half.",
      },
      {
        id: "seed-pricing-5",
        text: "That's it.\n\nFollow me for more lessons on building and pricing SaaS products, and repost the first tweet to help another founder.",
      },
    ],
  },
  {
    id: "seed-features",
    title: "Why I stopped building features",
    tone: null,
    source: "optimized",
    createdAt: "2026-09-23T14:10:00.000Z",
    tweets: [
      {
        id: "seed-features-1",
        text: "I shipped 14 features last quarter.\n\nRevenue didn't move.\n\nHere's what I changed (and why growth finally picked up): 🧵",
      },
      {
        id: "seed-features-2",
        text: "I stopped asking \"What should I build next?\"\n\nAnd started asking \"Why do people leave?\"\n\nThe answers were humbling.",
      },
      {
        id: "seed-features-3",
        text: "70% of churned users never finished onboarding.\n\nSo I spent a month on onboarding only. No new features.\n\nActivation went from 22% to 41%.",
      },
      {
        id: "seed-features-4",
        text: "Lesson: more features rarely fix a leaky bucket.\n\nIf you're building in public too, follow along. I share the numbers every week.",
      },
    ],
  },
  {
    id: "seed-mrr",
    title: "From side project to $2k MRR",
    tone: "storytelling",
    source: "generated",
    createdAt: "2026-09-25T18:45:00.000Z",
    tweets: [
      {
        id: "seed-mrr-1",
        text: "A year ago, my side project made $0.\n\nThis month it crossed $2,000 MRR.\n\nHere's the honest story of how it happened: 🧵",
      },
      {
        id: "seed-mrr-2",
        text: "1. I built for myself first.\n\nI needed a better way to track client invoices. Nothing simple existed, so I made one over a few weekends.",
      },
      {
        id: "seed-mrr-3",
        text: "2. I launched in 3 small communities instead of Product Hunt.\n\n40 signups on day one. 3 of them paid. That was enough to keep going.",
      },
      {
        id: "seed-mrr-4",
        text: "3. I wrote about every milestone.\n\nFirst customer. First churn. First $1k month. Each post brought new users who liked the transparency.",
      },
      {
        id: "seed-mrr-5",
        text: "What's next: $5k MRR by March.\n\nFollow along if you want to see if I make it. I'll share every number, good or bad.",
      },
    ],
  },
];

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
