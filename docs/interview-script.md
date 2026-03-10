# Interview Presentation Script — AI-Powered Expense Intelligence Dashboard

---

## Section 1: Intro — Problem + Why This Project (3 min)

"Hi, I'm Prince Levin. The project I'll be walking you through is the AI-Powered Expense Intelligence Dashboard.

This project came from a personal frustration actually. When I download my bank statement, it's just hundreds of lines like 'UPI-RAZORPAY-SWIGGY' or 'AMZN Mktp IN\*4F7K2'… and I honestly have no idea where my money is going. That's 150-200 transactions a month, completely unreadable without manually going through every line.

Existing tools don't solve this well. Apps like Walnut require manual tagging, and most people abandon them within weeks. Rule-based tools use keyword matching, but Indian bank transactions are too messy — UPI reference codes, abbreviated merchant names, POS terminal codes. Keyword matching breaks constantly.

So the core thesis of my project is: this is exactly the kind of problem where AI semantic understanding is the right tool. Not AI for the sake of AI — but because messy, inconsistent text is precisely what LLMs are good at parsing. The app takes a bank statement file, AI categorizes every transaction, and you get a spending dashboard with plain-language insights in under 30 seconds. Zero configuration, zero manual effort.

The tech stack is TypeScript end-to-end — React frontend with Vite, Express backend, Gemini 2.5 Flash as the primary LLM with OpenAI as a fallback. Tailwind for styling, Recharts for charts, zod for validation. I deliberately chose a minimal stack — no Next.js, no database, no auth — because the project is stateless by design. Upload, process, return results, discard data."

**If they ask "why not Next.js?":**

"I evaluated five options — Next.js, T3 Stack, Turborepo, CRA, and Vite+Express. Next.js brings SSR, server components, file-based routing — none of which I need for a stateless SPA with one API endpoint. I picked the minimal stack that matches the actual problem."

---

## Section 2: Live Demo (5 min)

"Before I show the architecture or code, let me show the product working — because that's the fastest way to understand what it does."

*(Upload sample file)*
"I'm uploading a sample bank statement — this is real SBI format data. The file goes to the backend, gets parsed, each transaction is sent to Gemini in batches for categorization, then results come back."

*(Dashboard renders)*
"Within about 15 seconds, the dashboard shows me everything — a spending breakdown by category, top merchants, and income vs expenses summary. Notice it says 'Money In' and 'Money Out' instead of 'Credits' and 'Debits' — I designed it for users who don't understand financial jargon."

*(Show AI insights)*
"These insights are AI-generated — plain language, specific to this data. 'Food delivery was your #1 expense at ₹12,400 — 14% of your income.' Not generic advice — actual facts from the user's data."

*(Show comparison mode)*
"This is my favorite part — the comparison mode. Same transactions, categorized by AI on the left, rule-based keyword matching on the right. The AI gets 'UPI-SWIGGY INSTAMART' correct as Groceries. The rule-based system says 'Unknown.' Across about 200 real transactions, AI categorizes around 93% correctly, while the rule-based approach gets about 58%. That gap is exactly why AI works better for messy financial data."

*(Show chat)*
"And there's a chat interface — I can ask 'What did I spend on Zomato?' and it answers from my actual transaction data."

---

## Section 3: How I Used AI to Build This (5 min)

"Now let me explain how I used AI throughout this project — not just in the product, but in building it.

I used GitHub Copilot with a structured workflow called BMAD, which basically treats AI as a team of roles — analyst, product manager, architect, and developer.

What was interesting for me is that AI didn't replace the development process — it actually simulated a small product team. I just happened to be the person coordinating and reviewing that team.

So instead of one person manually writing a product brief, then a PRD, then an architecture document — which takes days — I used AI agents in specific roles. A Business Analyst agent created the product brief. A Product Manager agent created the PRD with 44 functional requirements. An Architect agent made all the technology decisions and produced the architecture document.

But — and this is important — I didn't just press a button and accept whatever came out. Each phase was a conversation. I provided the vision and domain knowledge, the AI generated structured output, and then I reviewed every document critically. Some things I accepted. Some things I corrected. Some things I rejected entirely.

The SDLC planning phases — the ones that traditionally take days of meetings and document drafting — can be dramatically accelerated with AI, as long as a human is steering and reviewing. The AI generates the structure and detail; the human provides judgment, domain expertise, and quality control."

---

## Section 4: Show Planning Artifacts — Quick Screen Share (5 min)

> **Tip: Move through this quickly. Interviewers care about your thinking, not document length.**

*(Open product brief)*
"This is the product brief — problem, target users, solution, MVP scope. Three user personas — Priya the professional, Rahul the first-time earner, Ananya the student — each representing different relationships with money."

*(Open PRD — scroll quickly)*
"This is the PRD — 44 functional requirements, 23 non-functional, four user journeys. Domain-specific requirements for Indian payment formats — UPI, POS codes, five different date formats across banks, currency in lakhs notation. The AI structured all of this, but the domain knowledge — like knowing SBI YONO exports password-protected Excel, not CSV — that came from me."

*(Open architecture.md — scroll to project structure and data flow)*
"Architecture document — tech stack decisions, 70+ files mapped, data flow, implementation patterns, and a validation section that checks every functional requirement has an architectural home. 44 out of 44 covered, 23 out of 23 NFRs covered."

"The point isn't that these documents are long — it's that they're internally consistent. The PRD references the product brief. The architecture references the PRD. Requirements trace through all three. AI generated the structure; I ensured the consistency."

---

## Section 5: What I Accepted, Changed, and Rejected (8 min)

> **This is your strongest section. Be specific and confident here.**

"Let me give you concrete examples of where I intervened — because this is what working with AI actually looks like.

**Example 1 — I rejected the analyst's entire direction.**
In the first version, the analyst agent actually drifted the product toward a small business finance tool instead of personal finance. It renamed the project 'Paisa Pilot,' switched the target audience to small business owners, and made the core feature rule-based instead of AI-powered — which literally contradicts the whole thesis. I caught it during review and corrected the direction before regenerating the product brief. If I had accepted that output, the entire project would have been built on the wrong foundation.

**Example 2 — I added domain knowledge the AI couldn't have.**
Midway through the PRD phase, I realized that SBI YONO — one of the two banks we're supporting — doesn't export CSV files. It only exports Excel, and those Excel files are password-protected with AES encryption. The AI had no way to know this — it's experiential knowledge from actually using the app. So I updated the requirements: added Excel parsing, encrypted file support using officecrypto-tool, and a smart header detection system because SBI files have metadata rows before the actual data. That change rippled through the PRD and architecture.

**Example 3 — I caught missing dependencies.**
The architecture document specified zod as a critical dependency — used for schema validation, LLM response validation, API contracts — but it was missing from both installation command blocks. The AI designed an entire architecture around zod but forgot to install it. Same with client-side test dependencies — the directory structure mapped test files but the install commands didn't include vitest or testing-library.

**Example 4 — I caught requirement inconsistencies.**
The PRD had error messages referencing four banks — SBI, HDFC, ICICI, and Axis — but the MVP scope only supports two. If that shipped to production, users would see a message promising support that doesn't exist. Caught it during review.

**Example 5 — I made architectural judgment calls.**
The AI suggested a merchant cache — a JSON file with regex patterns for matching merchant names. I evaluated that approach and decided to handle merchant matching within the LLM prompt instead, because maintaining a separate regex cache adds complexity without clear benefit when the LLM already understands merchant names. That's an engineering judgment the AI couldn't make on its own."

"The pattern is consistent: AI generates 80-90% of the content correctly. But the 10-20% it gets wrong are often the things that matter most — wrong audience, missing domain knowledge, inconsistent requirements, forgotten dependencies. The human's job is to catch those."

---

## Section 6: Closing — What I Learned (3 min)

"Three things I took away from this project.

First — AI is a multiplier, not a replacement. The planning phase that would typically take a week of meetings and document drafting took about two days. But it only worked because I was actively reviewing and correcting at every step. If I had blindly accepted AI output, I'd have built the wrong product for the wrong audience.

Second — domain expertise is the human's superpower. The AI can structure a PRD perfectly, but it doesn't know that SBI YONO only exports encrypted Excel files, or that Indian banks use five different date formats, or that UPI reference codes have merchant names embedded in non-standard positions. That domain understanding is what separates a real product from a generic demo.

Third — the best way to use AI is to treat it as a very fast collaborator who needs oversight, not an oracle who gets everything right. I'd give it a role, let it generate, review the output critically, and correct. That review cycle — generate, review, correct — is really the core skill of working effectively with AI.

That's the project. Happy to answer any questions."

---

## Quick Cheat Sheet (Keep Visible Off-Screen)

| Likely Question | Your One-Liner |
|---|---|
| How long did planning take? | ~2 days with AI vs. ~1 week manually |
| Did AI write the code too? | AI assisted with boilerplate and structure; I reviewed and wrote domain-specific logic |
| What's the accuracy? | ~93% AI vs ~58% rule-based on 200 real transactions |
| Why Gemini over OpenAI? | Cost-effective for batching, built with provider abstraction so I can swap anytime |
| What would you do differently? | Start with a smaller scope — the chat feature added complexity; would ship dashboard first |
| Any risks with this approach? | Yes — AI drift (like the Paisa Pilot incident). You must review every output, not just the first one |

---

## Prepared Answers for Likely Questions

**Q: "Did AI write most of the code?"**
"AI helped generate boilerplate and structure, but I reviewed everything and implemented domain-specific logic myself."

**Q: "Why Gemini instead of OpenAI?"**
"Gemini Flash is cost-efficient for batch classification. I also built a provider abstraction so I can switch models easily."

**Q: "What would you improve?"**
"I would start with a smaller MVP — probably the dashboard first, and add chat later."

**Q: "What risk does AI introduce?"**
"Drift — where AI moves away from the intended problem. That's why review is critical."
