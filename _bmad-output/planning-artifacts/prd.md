# Product Requirements Document - AI-Powered Expense Intelligence Dashboard

**Author:** PrinceLevin
**Date:** 2026-03-08

## Executive Summary

The AI-Powered Expense Intelligence Dashboard is a web application that transforms cryptic Indian bank statement data into categorized spending insights using AI semantic understanding. It targets young Indians — students, first-time earners, and early-career professionals — who cannot answer the basic question "where does my money go?" because their bank statements contain unreadable descriptions like "AMZN Mktp IN*4F7K2" and "UPI-RAZORPAY-SWIGGY".

The core problem: existing tools either require unsustainable manual tagging or use rigid keyword-matching that breaks on the inconsistent, messy formats of Indian bank transactions (UPI references, abbreviated merchant names, POS terminal codes). No available tool uses AI to semantically parse these descriptions and produce accurate categorizations without user effort.

The solution: upload a bank statement (CSV or Excel) and receive an instant spending breakdown — AI-categorized transactions, visual dashboards, and plain-language insights like "Food delivery is 30% of your income" — in under 30 seconds, with zero configuration. The emotional payoff: users finally understand their own spending without doing anything.

This is a portfolio/demonstration project. The primary audience is engineering evaluators — interviewers, tech leads, and peers assessing applied AI judgment, edge case thinking, and end-to-end solution design. The product must be genuinely useful (not a toy demo) to validate the engineering, but the bar is "impressive engineering showcase" rather than "production-ready fintech product."

### What Makes This Special

**AI as the right tool, not AI for AI's sake.** The project demonstrates engineering judgment about tool selection. Messy, inconsistent bank transaction descriptions are precisely the problem space where rule-based approaches fail and semantic understanding wins. A built-in comparison mode proves this quantitatively — showing AI categorization results alongside rule-based output on the same data.

**Zero-effort-to-insight pipeline.** Upload → get clarity. No signup, no manual tagging, no financial literacy required. The entire value proposition rests on the AI correctly interpreting cryptic descriptions without any user intervention — that's the magic moment.

**Domain depth over generic wrapper.** Indian payment ecosystem expertise — UPI transaction format parsing, POS terminal code handling, common merchant abbreviation resolution (AMZN, SWGY), NEFT/IMPS reference identification — demonstrates that the builder understood the data domain, not just the AI API. Edge case handling (refunds, bank transfers, salary credits, EMIs) separates this from naive categorizers.

## Project Classification

| Dimension | Value |
|---|---|
| **Project Type** | Web Application (SPA, browser-based dashboard) |
| **Domain** | Fintech — Personal finance, bank transaction analysis |
| **Complexity** | Medium (fintech domain, but scoped as stateless portfolio project — no auth, no stored data, no compliance burden) |
| **Project Context** | Greenfield — new product, no existing codebase |

## Success Criteria

### User Success

| Criteria | Metric | Target |
|---|---|---|
| **Spending Clarity** | Test user correctly identifies top 3 spending categories and approximate amounts after 60 seconds with dashboard | 100% of test users |
| **Zero-Effort Categorization** | Transactions categorized accurately without any user input beyond file upload | >90% accuracy |
| **Edge Case Handling** | Refunds, transfers, salary credits, EMIs correctly identified and excluded from spending analysis | >85% accuracy |
| **Instant Comprehension** | AI-generated insights understood without explanation or financial literacy | >95% comprehension |
| **Time-to-Clarity** | Time from file upload to user understanding their spending breakdown | <30 seconds |

**North Star:** After using the dashboard, users can answer "where does my money go?" with specific categories and numbers — without referencing the raw bank statement again. A user who gets clarity in 15 seconds is a better outcome than one who spends 5 minutes exploring.

### Business Success (Portfolio Impact)

| Criteria | Signal |
|---|---|
| **"Real project" perception** | Evaluators recognize this as a genuine product, not a tutorial copy-paste |
| **End-to-end thinking visible** | Problem identification → tool selection rationale → architecture → edge case handling → working product — the full chain is evident |
| **Engineering judgment demonstrated** | README explains *why* AI over rules, *how* the pipeline works, and *what* edge cases are handled |
| **Genuine interest sparked** | Evaluators ask follow-up questions about architecture or design decisions (not checkbox review) |
| **Thesis proven with data** | Comparison mode shows quantitative AI vs. rule-based results — this is the moment evaluators stop and think "this person proved it, not just claimed it" |

### Technical Success

| Criteria | Evidence |
|---|---|
| **Clean separation of concerns** | Distinct layers: file parsing → AI categorization → data aggregation → visualization → insight generation |
| **README as design document** | Explains architecture, AI prompt design decisions, edge case rationale, and accuracy results |
| **Quantitative proof** | Comparison mode with real numbers (e.g., "AI: 92% accuracy vs. rule-based: 61% on 500 transactions") |
| **Graceful error handling** | Malformed rows reported gracefully — no crashes, clear user feedback |
| **Critical path test coverage** | AI categorization validation and edge case handling tested thoroughly |
| **Right-sized architecture** | No over-engineering — no unnecessary abstractions or enterprise patterns. Appropriately scoped for a portfolio project |

### Measurable Outcomes

| Outcome | Measurement | Target |
|---|---|---|
| **AI vs. Rule-Based Delta** | Accuracy gap between AI and keyword-matching on same transaction dataset | >25 percentage points improvement |
| **Categorization Accuracy** | % of transactions correctly categorized on real Indian bank statements | >90% |
| **Edge Case Accuracy** | % of non-expense transactions (refunds, transfers, salary, EMIs) correctly identified | >85% |
| **Pipeline Performance** | End-to-end processing time for a typical month's transactions (~150-200 rows) | <30 seconds |
| **Error Resilience** | App stability when processing malformed/unexpected file data | Zero crashes, graceful error reporting |

## User Journeys

### Journey 1: Priya — The Organized Professional (Happy Path)

**Who:** Priya, 28, software engineer in Bangalore. Earns ₹90,000/month across UPI, credit card, debit card, and auto-debits. Has 150–200 transactions monthly. Knows she should track spending but finds it too tedious. Has tried spreadsheets twice — abandoned both within 3 weeks.

**Opening Scene:** It's the last week of the month. Priya checks her bank balance and it's lower than expected — again. She's been meaning to figure out where the money goes, but scrolling through 180 transactions with descriptions like "POS 4421XXXX8823 ZOMATO LI" and "UPI/CR/408215XXXXXX/PAYTM" feels pointless. She downloads her HDFC bank statement CSV.

**Rising Action:** She opens the Expense Intelligence Dashboard, drags her CSV file onto the upload area. No signup. No configuration. The file uploads and she sees a brief processing indicator — the AI is categorizing her transactions.

**Climax:** Within 15 seconds, the dashboard renders. A donut chart shows her spending breakdown: ₹12,400 on Food Delivery (Swiggy, Zomato), ₹4,200 on Subscriptions (Netflix, Spotify, YouTube Premium, iCloud), ₹8,900 on Shopping (Amazon, Myntra). The AI insight reads: "Food delivery was your #1 expense at ₹12,400 — 14% of your income. Your Swiggy spending increased 22% compared to your average." She stares at the number. Fourteen percent. On *delivery*.

**Resolution:** For the first time, Priya has an actual answer. She screenshots the dashboard and sends it to her friend: "I spent ₹12K on Swiggy last month." She doesn't need the app to tell her what to do — the clarity itself is the value. She decides to cook twice a week. She uses the month filter to check just February — and sees her food delivery was even higher last month. The trend is clear. Next month, she'll upload again to see if it worked.

**"Aha" Moment:** When "AMZN Mktp IN*4F7K2" appears correctly categorized as "Shopping / Amazon" — without Priya doing anything. The AI understood her messy bank data.

**Requirements Revealed:** CSV parsing for HDFC format, AI categorization of UPI/POS/merchant descriptions, spending breakdown visualization (donut chart, category bars), top merchants display, AI-generated insights with trend language, fast processing (<15 seconds perceived), month filter for temporal comparison.

---

### Journey 2: Rahul — The First-Time Earner (Low Financial Literacy Path)

**Who:** Rahul, 23, junior analyst in Pune. First job out of college. Earns ₹35,000/month. Uses UPI for everything. Has never opened a bank statement file. Doesn't understand financial terminology. Runs out of money before payday every month.

**Opening Scene:** Rahul's parents ask — again — "where does your money go?" He genuinely doesn't know. His friend mentions a tool: "just upload your bank statement, it shows you everything." Rahul opens the SBI YONO app, finds the "Download Statement" option after some searching, and downloads an Excel file. He's never opened a bank statement file in his life.

**Rising Action:** He opens the dashboard. The upload area says something simple — no jargon, no "import your financial data." He selects his file. He doesn't know what a "POS transaction" is. He doesn't know what "NEFT" means. None of that matters — the AI handles it.

**Climax:** The dashboard appears. A simple pie chart, big numbers. The AI summary — in plain language — says: "You spent ₹11,200 on food this month — ₹6,800 of that was food delivery. Your top merchant was Zomato (₹4,100). You made 38 transactions under ₹100 that totaled ₹2,840." Rahul reads it like a text message. No charts to interpret, no ratios to calculate. Just sentences that state facts.

**Resolution:** Rahul finally has an answer for his parents. More importantly, he has an answer for himself. He had no idea those ₹50-₹120 chai-and-snacks UPI payments added up to ₹2,840. The invisible became visible.

Then he notices the chat icon. He types: "What did I spend on Zomato?" The chatbot replies: "You spent ₹4,100 on Zomato across 19 orders this month. Your average order was ₹216." He asks: "What about last Tuesday?" — "On Tuesday Feb 24, you had 3 transactions: Zomato ₹249, Amazon ₹599, and a UPI transfer of ₹1,000." It's like texting a friend who actually read his bank statement. He doesn't need budgeting advice — he needs to *see* what he's doing. Now he does — and he can ask questions about it.

**"Aha" Moment:** When the dashboard aggregates dozens of tiny UPI transactions he'd never review individually and shows them as a meaningful category total. Small spends aren't small.

**Requirements Revealed:** SBI Excel format support, zero-jargon UI copy, plain-language AI insights (no financial terminology), small-transaction aggregation insight, clear visual hierarchy that works without financial literacy, immediate comprehension without onboarding or explanation, conversational AI chat for ad-hoc spending questions.

---

### Journey 3: Error Recovery — The Unsupported Format

**Who:** A user (any persona) attempts to upload a file the system can't process correctly.

**Scenario A — Wrong file type entirely:**
User accidentally uploads a PDF bank statement. The system immediately responds: "This doesn't appear to be a supported file type. Please upload a bank statement in CSV or Excel (.xls/.xlsx) format." No crash, no blank screen. Clear instruction on what to do next.

**Scenario B — CSV but not a bank statement:**
User uploads a file of employee contact data. The system scans for expected columns (date, description/narration, amount) and doesn't find them. Response: "We couldn't find transaction data in this file. We look for columns like Date, Description/Narration, and Amount. Please upload a bank statement in CSV or Excel format."

**Scenario C — Unrecognized bank format:**
User uploads a valid bank statement file but from a bank with unfamiliar column names (e.g., Kotak Mahindra with non-standard headers). The system attempts column detection by data patterns — looks for date-formatted columns, currency-formatted amounts. If auto-detection fails: "We couldn't automatically detect your bank format. Supported formats: SBI, HDFC. More banks coming soon." For MVP, this is an acceptable limitation with a clear message.

**Scenario D — Partial data issues:**
User uploads an HDFC statement where 8 out of 195 rows have formatting issues (missing amounts, garbled descriptions). The system processes the 187 valid rows and displays: "Processed 187 of 195 transactions. 8 rows were skipped due to formatting issues." The dashboard renders with the valid data — partial success, not total failure.

**Scenario E — Encoding issues:**
A bank statement downloaded from SBI in ISO-8859-1 encoding contains garbled merchant names after UTF-8 parsing. The system detects encoding mismatch, retries with common Indian bank encodings (UTF-8, ISO-8859-1, Windows-1252). If garbled text persists, flags affected transactions rather than displaying garbage.

**Scenario F — Empty file or too-large file:**
Empty: "This file appears to be empty. Please upload a bank statement with transaction data." Too large (>5MB or >10,000 rows): "This file is larger than expected for a personal bank statement. Please upload a file with fewer than 10,000 transactions."

**Design Principle:** Never crash. Never show a blank screen. Always tell the user what happened and what to do next. Graceful degradation over silent failure.

**Requirements Revealed:** File type validation, CSV/Excel structure validation, column detection logic, multi-encoding support (UTF-8, ISO-8859-1, Windows-1252), partial row processing with skip-and-report, file size limits, clear error messaging with actionable guidance at every failure point.

---

### Journey 4: The Portfolio Evaluator

**Who:** A senior engineer or tech lead reviewing the project as part of a portfolio assessment or interview preparation. They've seen dozens of "I used ChatGPT API" projects. They're looking for signal that this person *thinks*, not just codes.

**Opening Scene:** The evaluator lands on the project's GitHub page. They scan the README. It's not a generic "how to install" doc — it reads like a mini design document. It explains *why* AI over rules (messy Indian bank descriptions break keyword matching), *how* the pipeline works (file upload → parsing → AI categorization → aggregation → visualization → insights), and *what* edge cases are handled (refunds, transfers, EMIs, salary credits). Their interest moves from "let me check this box" to "let me actually look at this."

**Rising Action:** They click through to the live demo. They upload a sample file (either provided or their own). The dashboard loads. Transactions are categorized correctly. Charts render cleanly. AI insights are specific and data-backed — not generic advice. The evaluator thinks: "Okay, it works." That's table stakes.

**Climax:** They click into the comparison mode. A side-by-side table appears: the same transactions categorized by AI and by rule-based logic. They see "UPI/DR/407812XXXXXX/SWIGGY INSTAMART" — AI correctly labels it "Groceries / Swiggy Instamart" while the rule-based system tagged it "Other." They see "AMZN Mktp IN*4F7K2" — AI says "Shopping / Amazon," rules say "Unknown." The quantitative summary: "AI: 93% accuracy. Rule-based: 58% accuracy. On 200 real transactions." That's the moment. This person didn't just call an API — they *proved their thesis with data*.

**Resolution:** The evaluator looks at the code structure. Clean separation: parsing module, AI categorization layer, aggregation logic, visualization components. They see thoughtful prompt engineering — not "categorize this transaction" but structured prompts that handle UPI formats, POS codes, and edge cases. They see test coverage on the critical path. They close the tab thinking: "This person understands when AI is the right tool, handles edge cases deliberately, and builds clean end-to-end systems." They make a note to ask about the prompt design and accuracy validation approach in the interview.

**"Aha" Moment:** The comparison mode. When they see quantitative proof that AI beats rules on real data — not a claim in the README, but a live interactive demonstration.

**Requirements Revealed:** Sample dataset for demo purposes, comparison mode UI (side-by-side table), quantitative accuracy summary, clean code architecture visible in repo, README that explains design decisions and edge case rationale, live demo deployment.

### Journey Requirements Summary

*Capabilities revealed by user journeys — formally specified in the Functional Requirements section.*

| Capability Area | Revealed By Journeys | Priority |
|---|---|---|
| **File Parsing (Multi-Bank)** | Priya (HDFC CSV), Rahul (SBI Excel), Error Recovery (unsupported formats, partial data) | MVP |
| **AI Categorization Engine** | All journeys — core product capability | MVP |
| **Spending Dashboard (Charts)** | Priya (donut, categories), Rahul (simple pie, big numbers) | MVP |
| **AI Natural Language Insights** | Priya (trend language), Rahul (plain language, small-spend aggregation) | MVP |
| **AI vs. Rule-Based Comparison** | Portfolio Evaluator (side-by-side, accuracy delta) | MVP |
| **Error Handling & Validation** | Error Recovery (file type, structure, encoding, partial rows, size) | MVP |
| **Zero-Jargon UI** | Rahul (no financial terminology, immediate comprehension) | MVP |
| **Sample Dataset for Demo** | Portfolio Evaluator (needs data to evaluate without own bank statement) | MVP |
| **Graceful Error Messaging** | Error Recovery (actionable messages at every failure point) | MVP |
| **Live Demo Deployment** | Portfolio Evaluator (needs accessible hosted version) | MVP |
| **Multi-Encoding Support** | Error Recovery (UTF-8, ISO-8859-1, Windows-1252) | MVP |
| **AI Conversational Chat** | Rahul (ad-hoc spending questions in plain language) | MVP |
| **Month Filter** | Priya (temporal comparison across months) | MVP |
| **Transaction Statement View** | All journeys (searchable, sortable full transaction list) | MVP |

## Domain-Specific Requirements

### Data Privacy & Transparency

**Data Flow:** Transaction data from uploaded files is sent to an external LLM API (Gemini 2.5 Flash primary; OpenAI as alternative) for semantic categorization. This is necessary — client-side processing cannot deliver the semantic understanding required for messy merchant descriptions.

**Privacy Approach (Portfolio-Appropriate):**

| Principle | Implementation |
|---|---|
| **Transparency** | Upload page displays: "Your transaction data is sent to an AI service for categorization and is not stored." |
| **No Storage** | Backend is fully stateless — process uploaded file, call LLM, return results, discard data. No database, no transaction logs, no file persistence. |
| **No Persistence** | No cookies, no local storage of financial data, no server-side caching of transaction content. |
| **Documentation** | README explains the complete data flow so evaluators can verify the privacy posture. |

**Production Note:** A production version would require client-side processing or a self-hosted model. For a portfolio demo, transparency + statelessness is the appropriate trade-off.

### Financial Domain Disclaimer

Include a one-liner in the UI footer and/or near the insights section: *"This tool provides spending insights for informational purposes only. It is not financial advice."*

This is low-effort and signals domain awareness — every serious fintech product includes this. Evaluators will notice its presence (or absence).

### Indian Currency & Number Formatting

Indian bank statements use non-standard number formatting that naive parsers will mishandle:

| Format Concern | Examples | Required Handling |
|---|---|---|
| **Indian numbering system** | 1,50,000 (not 150,000) = ₹1.5 lakh | Parse Indian comma grouping (XX,XX,XXX pattern) correctly |
| **Currency symbol variations** | ₹1,500 / Rs.1,500 / INR 1,500 / 1500.00 | Strip currency prefixes/symbols before parsing amount |
| **Debit/credit representation** | Negative numbers for debits vs. separate Debit/Credit columns | Detect column structure per bank format and normalize |
| **Decimal handling** | 1,500.00 vs 1500 vs 1,500 (no decimals) | Handle presence/absence of decimal places |

### Transaction Date Format Handling

Indian banks use inconsistent date formats:

| Format | Example | Banks |
|---|---|---|
| DD/MM/YYYY | 08/03/2026 | Most common (HDFC, SBI) |
| DD-MM-YYYY | 08-03-2026 | ICICI variants |
| YYYY-MM-DD | 2026-03-08 | Some digital-first banks |
| DD-Mon-YY | 08-Mar-26 | SBI, older formats |
| DD-Mon-YYYY | 08-Mar-2026 | Axis variants |

The file parser must detect date format from the data and parse consistently. Ambiguous dates (e.g., 03/08/2026 — is it March 8 or August 3?) should be resolved by checking multiple rows for pattern consistency.

### Indian Payment Ecosystem Patterns

Domain-specific transaction description patterns requiring specialized parsing:

| Pattern Type | Example Descriptions | Extraction Target |
|---|---|---|
| **UPI transfers** | UPI/DR/407812XXXXXX/SWIGGY/PaymentRef | Merchant name (SWIGGY), transaction type (DR=debit) |
| **POS transactions** | POS 4421XXXX8823 ZOMATO LI BANGALORE | Merchant (ZOMATO), city (BANGALORE) |
| **NEFT/IMPS** | NEFT/N123456789/JOHN DOE/HDFC | Transfer type, recipient name, bank |
| **Merchant abbreviations** | AMZN Mktp IN*4F7K2, SWGY INSTMRT | Resolved merchant (Amazon, Swiggy Instamart) |
| **Auto-debits** | ACH/TATA AIG/INSURANCE/POLICY123 | Merchant, category signal (INSURANCE) |
| **ATM withdrawals** | ATM/CASH WDL/SBI ATM/MUMBAI | Transaction type (cash withdrawal), location |

### Compliance Exclusions (Explicitly Not Required)

This is a stateless portfolio project. The following production fintech requirements are explicitly out of scope:

- **KYC/AML** — No user identity verification (no user accounts)
- **PCI DSS** — No payment card data processing or storage
- **RBI Compliance** — No financial services being offered
- **GDPR/DPDP** — No personal data stored (stateless processing)
- **SOX** — No financial reporting or audit requirements

## Web Application Specific Requirements

### Project-Type Overview

Single-page application (SPA) with three UI states: upload → processing → dashboard. No multi-page routing required. The dashboard state contains multiple tabs (Overview, Statement, Comparison) plus a floating chat interface. One page, multiple states — keep it simple.

### Browser Support

| Browser | Versions Supported |
|---|---|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge (Chromium) | Latest 2 versions |

No IE11 support. No legacy polyfills. The audience is tech evaluators on modern machines.

### Responsive Design

| Viewport | Priority | Behavior |
|---|---|---|
| **Desktop (1024px+)** | Primary | Full dashboard layout — charts side-by-side, full data tables |
| **Tablet (768px–1023px)** | Secondary | Stacked charts, responsive tables |
| **Mobile (< 768px)** | Low | Functional but not optimized — charts stack vertically, scrollable tables |

Desktop is the primary target. Portfolio evaluators review projects on laptops/monitors, not phones. Mobile should work (responsive CSS) but isn't a priority.

### Performance Targets

See NFR1–NFR6 for measurable performance requirements. Key web-specific context:

- **Processing UX:** Display progress indicator during AI categorization — "Processing 187 transactions..." with a progress bar or spinner. No streaming of individual results. Simple, clean loading state.
- **Desktop-first optimization:** Performance budget prioritizes desktop experience (primary audience).

### SEO Strategy

Minimal. Not a content site — this is a tool.

| Element | Implementation |
|---|---|
| **Meta title** | "AI Expense Intelligence Dashboard — Instant Spending Insights" |
| **Meta description** | "Upload your bank statement and get AI-powered spending insights in seconds. Zero effort, zero signup." |
| **robots.txt** | Allow indexing of landing page only |
| **Structured data** | Not required |

SEO is irrelevant to the portfolio audience. Basic meta tags for discoverability if shared.

### Accessibility

WCAG 2.1 AA baseline. See NFR12–NFR16 for measurable accessibility requirements. Data table alternatives for charts are low effort and signal accessibility awareness to evaluators.

### Implementation Considerations

| Consideration | Decision |
|---|---|
| **Framework** | SPA framework (React, Vue, or Svelte — to be decided in architecture phase) |
| **State management** | Minimal — single data flow: raw file data → processed results → dashboard render. No complex state trees. |
| **API communication** | REST endpoints: POST /api/analyze for file processing, POST /api/chat for conversational queries. Simple request/response. |
| **File handling** | Client-side file selection (CSV and Excel) with drag-and-drop support. File validation before upload. |
| **Chart library** | Charting library with built-in accessibility support (to be decided in architecture phase) |
| **Excel decryption** | officecrypto-tool for AES-encrypted .xlsx files (password-protected SBI YONO exports) |
| **LLM SDK** | @google/generative-ai (Gemini 2.5 Flash primary), openai SDK (alternative) |
| **Deployment** | Static SPA frontend + lightweight backend API. Hosted for live demo access. |

## Product Scope

### MVP Strategy & Philosophy

**MVP Approach:** Proof-of-concept showcase — demonstrate the thesis that AI semantic categorization beats rule-based approaches on real messy bank data, delivered through a polished, working product.

**Success bar:** Upload a real bank statement → get accurate AI categorization → see quantitative proof (comparison mode). If these three things work well, the project succeeds.

**Resource:** Solo developer, estimated 2-3 weeks of focused work. Tight scope is intentional — 8 polished features over 15 rough ones.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Priya (happy path) — upload HDFC CSV, get accurate dashboard + insights
- Rahul (first-timer) — upload SBI Excel file, understand plain-language insights without financial literacy
- Error recovery — graceful handling of bad files, wrong formats, partial data
- Portfolio evaluator — sample dataset, comparison mode, clean code architecture

**Must-Have Capabilities:**

| # | Feature | Scope | Rationale |
|---|---|---|---|
| 1 | **File Upload & Parsing (CSV + Excel)** | SBI (Excel via YONO) + HDFC (CSV) formats (2 banks). Extensible format-config architecture — adding a new bank is a config addition, not a code rewrite. | Most common banks. Multi-format support (Excel + CSV) demonstrates real-world engineering maturity. |
| 2 | **AI-Powered Categorization** | LLM-based (Gemini 2.5 Flash) with merchant recognition handled within the categorization prompt context. Known merchant patterns (e.g., "AMZN Mktp" → Amazon, "UPI-SWIGGY" → Swiggy) are part of the prompt instructions. Batched API calls (20-30 transactions per prompt, ~7-10 calls total). Structured JSON output. | Merchant recognition within the prompt keeps the architecture simple and eliminates cache synchronization. Batching keeps latency <30s. Free tier with Gemini. |
| 3 | **Spending Dashboard** | Category donut/pie chart, top 10 merchants, category bar chart, income vs. expenses summary. Data table alternative for accessibility. | Visual clarity — answers "where did my money go?" at a glance. |
| 4 | **AI Natural Language Insights** | 3-5 plain-language insights: top category, unusual patterns, merchant concentration, small-spend aggregation, actionable suggestion. | Charts show *what*; insights show *so what*. Essential for low-literacy users (Rahul). Demonstrates a distinct AI competency (structured data → constrained NL output). |
| 5 | **AI vs. Rule-Based Comparison** | Side-by-side table of example transactions with AI vs. rule-based categorization. Quantitative accuracy summary. | Transforms project from "I called an API" to "I proved my thesis with data." The portfolio evaluator's "aha" moment. |

| 6 | **AI Conversational Chat** | Floating chat interface for natural-language spending questions. Uses individual transaction data as context. POST /api/chat endpoint. | Transforms static dashboard into interactive exploration. Demonstrates a second AI competency (conversational retrieval over structured data). |
| 7 | **Transaction Statement View** | Enhanced table with search, sortable columns, type filter (All/Money Out/Money In), daily groupings with day-of-week and daily totals. | Full transaction visibility — users can verify categorization and explore individual transactions. |
| 8 | **Month Filter** | Filter all dashboard data (charts, summaries, insights, statement) by individual month. | Multi-month statements become navigable; enables temporal comparison. |

**Also MVP (Non-Feature Requirements):**
- Sample dataset for demo (evaluators without bank statements)
- Graceful error handling at every failure point
- Privacy transparency note on upload page
- Financial disclaimer in UI footer
- Live demo deployment
- README as design document

### Post-MVP Features

**Phase 2 — Fast Follow (ICICI/Axis + Enhancements):**

| Feature | Effort | Value |
|---|---|---|
| ICICI + Axis bank format support | Low (config addition) | Broader bank coverage |
| Multi-month trend analysis | Medium | "Your food delivery spending dropped 15% this month" |
| ~~Category drill-down with transaction detail~~ | Low | **Partially implemented** — Statement tab shows all transactions with category pills, searchable and filterable. Per-category drill-down from charts not yet wired. |
| Export categorized data as CSV | Low | Users keep their organized data |
| Confidence threshold UI | Medium | See and override low-confidence categorizations |

**Phase 3 — Vision (If Project Continues):**

| Feature | Effort | Value |
|---|---|---|
| Automated bank format detection | High | Zero-config file parsing |
| Custom categories + user rules | Medium | Layered on top of AI |
| Spending benchmarks | High | "You spend 40% more on food delivery than similar users" |
| Budget goal tracking | Medium | Set goals, track against AI-categorized actuals |
| PDF bank statement parsing | High | OCR + AI pipeline |

### Risk Mitigation Strategy

| Risk | Severity | Mitigation |
|---|---|---|
| **LLM accuracy <90% on real data** | High | Merchant recognition is handled within the LLM categorization prompt — known merchant patterns (top 50-60 common merchants) are provided as prompt context to guide accurate categorization. Batched prompts with structured JSON output ensure consistency. At scale, prompt refinement and few-shot examples can further improve accuracy. |
| **LLM cost per upload** | Medium | Batch 20-30 transactions per prompt (~7-10 API calls per upload). Gemini 2.5 Flash free tier covers portfolio usage. OpenAI available as fallback. Cost: free for typical usage. |
| **LLM latency >30 seconds** | Medium | Batching reduces API calls from 200 to ~7-10. Parallel batch requests if needed. Progress indicator manages perceived latency. |
| **Bank format variability** | Medium | Extensible format-config architecture. Start with 2 well-tested formats. Graceful error messaging for unsupported formats. |
| **Solo developer bottleneck** | Low | Tight scope (8 features), clean architecture (separation of concerns), 2-3 week timeline. No over-engineering. |
| **Demo data availability** | Low | Pre-built sample dataset with realistic (synthetic) Indian bank transactions covering all categories and edge cases. |

## Functional Requirements

### File Upload & Validation

- **FR1:** User can upload a bank statement file (CSV or Excel .xls/.xlsx) via file selector or drag-and-drop
- **FR2:** System can validate that the uploaded file is a supported format (CSV or Excel .xls/.xlsx) and reject unsupported file types with an actionable error message
- **FR3:** System can validate that the uploaded file (CSV or Excel) contains expected transaction data columns (date, description/narration, amount) and report missing columns clearly
- **FR4:** System can detect the bank format (SBI, HDFC) from file column structure and report unsupported formats with a list of supported banks
- **FR5:** System can enforce file size limits and reject files exceeding the threshold with a clear message
- **FR6:** System can detect and handle multiple text encodings (UTF-8, ISO-8859-1, Windows-1252) transparently

### Transaction Parsing

- **FR7:** System can parse SBI bank statement Excel format (.xls/.xlsx from YONO) into structured transaction records (date, description, amount, type)
- **FR8:** System can parse HDFC bank statement CSV format into structured transaction records
- **FR9:** System can detect and correctly parse Indian date formats (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD-Mon-YY, DD-Mon-YYYY)
- **FR10:** System can parse Indian currency formatting including lakhs notation (1,50,000), currency symbols (₹, Rs., INR), and variable decimal handling
- **FR11:** System can normalize debit/credit representation across bank formats (negative numbers vs. separate columns)
- **FR12:** System can process valid rows and skip malformed rows, reporting a summary of processed vs. skipped transactions
- **FR13:** System can detect and handle empty files with clear messaging

### AI Transaction Categorization

- **FR14:** System can categorize transactions into defined spending categories (Food & Dining, Food Delivery, Shopping, Subscriptions, Transport, Utilities, Entertainment, Rent, EMI/Loans, Groceries, Health, Education, Personal Care, Other)
- **FR15:** System can identify and exclude non-expense transactions (Transfers, Salary/Income, Refunds) from spending analysis
- **FR16:** System can resolve merchant identity from cryptic descriptions (e.g., "AMZN Mktp IN*4F7K2" → Amazon, "UPI/DR/XXXXXX/SWIGGY" → Swiggy) using merchant patterns provided within the LLM categorization prompt
- **FR17:** System can assign a confidence score to each categorization
- **FR18:** System can batch transactions for LLM processing to manage cost and latency
- **FR19:** System can parse UPI, POS, NEFT/IMPS, auto-debit, and ATM transaction description patterns

### Rule-Based Categorization (Comparison Engine)

- **FR20:** System can categorize transactions using a keyword/rule-based approach as a baseline comparator
- **FR21:** System can produce a side-by-side comparison of AI vs. rule-based categorization results for the same transactions
- **FR22:** System can calculate and display aggregate accuracy metrics for both AI and rule-based approaches, using pre-labeled ground truth data from the sample dataset against a pre-labeled ground truth dataset

### Spending Dashboard

- **FR23:** User can view a category-wise spending breakdown as a visual chart (donut/pie)
- **FR24:** User can view top merchants ranked by total spend amount
- **FR25:** User can view a category-wise spending bar chart
- **FR26:** User can view a total spending summary showing Money In, Money Out, and Balance with helper text explaining each metric
- **FR27:** User can view an accessible data table alternative for each visual chart
- **FR28:** User can toggle between the main dashboard view and the AI vs. rule-based comparison view

### AI-Generated Insights

- **FR29:** System can generate 3-5 plain-language spending insights from categorized transaction data
- **FR30:** System can generate a top spending category insight with specific amounts and percentages
- **FR31:** System can detect and report unusual spending patterns (e.g., merchant concentration, spending spikes)
- **FR32:** System can detect and report small-transaction accumulation patterns
- **FR33:** System can generate a simple actionable suggestion based on spending data
- **FR34:** System can present all insights in jargon-free language understandable without financial literacy

### Processing & Feedback

- **FR35:** User can see a progress indicator during transaction processing showing the number of transactions being processed
- **FR36:** System can display processing results within the <30 second performance target for ~200 transactions
- **FR37:** User can see clear, actionable error messages at every failure point (file errors, parsing errors, processing errors)

### Privacy & Compliance

- **FR38:** User can see a data privacy notice on the upload page explaining that transaction data is sent to an AI service and not stored
- **FR39:** User can see a financial disclaimer stating the tool provides informational insights only, not financial advice
- **FR40:** System can discard all uploaded transaction data after processing — no persistence, no logging of financial content

### Demo & Portfolio

- **FR41:** User can load a pre-built sample dataset (with manually verified category labels for accuracy benchmarking) to explore the dashboard without uploading their own bank statement
- **FR42:** Portfolio evaluator can access a live hosted demo of the application

### AI Conversational Chat

- **FR43:** User can ask natural-language questions about their spending via a floating chat interface (e.g., "What did I spend on last Tuesday?", "Which merchant did I spend the most at?")
- **FR44:** System exposes POST /api/chat endpoint accepting message history, spending summary, and individual transactions, returning AI-generated conversational responses

### Transaction Statement View

- **FR45:** User can view all transactions in an enhanced table with search, sortable columns (date, description, amount, category), type filter (All/Money Out/Money In), and daily groupings with day-of-week labels and daily totals

### Month Filter

- **FR46:** User can filter all dashboard data (charts, summaries, insights, statement) by individual month when the uploaded statement spans multiple months

### File Parsing Enhancements

- **FR47:** System can decrypt AES-encrypted Excel files (.xlsx) using a user-provided password, with a password dialog presented in the upload UI when encryption is detected
- **FR48:** System can detect the actual header row in Excel files by scanning up to 20 rows for date and description column keywords, handling bank formats with metadata rows before the data
- **FR49:** System can match column names using 4-pass fuzzy matching (exact → contains → normalized → index fallback) to handle non-standard column naming across bank formats

## Non-Functional Requirements

### Performance

| Requirement | Target | Measurement |
|---|---|---|
| **NFR1: Upload page initial load** | < 3 seconds | Time to interactive on standard broadband connection |
| **NFR2: File processing + AI categorization** | < 30 seconds for 200 transactions | End-to-end from upload to dashboard render, including LLM API calls |
| **NFR3: Dashboard render after data return** | < 2 seconds | Chart rendering + insight display after backend response |
| **NFR4: Largest Contentful Paint (LCP)** | < 2.5 seconds | Upload page on first visit |
| **NFR5: Cumulative Layout Shift (CLS)** | < 0.1 | No visual layout jumps during dashboard rendering |
| **NFR6: LLM API batch processing** | 7-10 batched calls per upload | Batch 20-30 transactions per prompt to manage latency and cost |

**Degradation behavior:** If LLM API latency exceeds 30 seconds, the progress indicator should continue showing status — never time out silently. If an individual batch fails, retry once before skipping those transactions and reporting partial results.

### Security & Privacy

| Requirement | Target | Measurement |
|---|---|---|
| **NFR7: Data transit encryption** | HTTPS/TLS for all client-server and server-LLM communication | No plaintext transmission of transaction data |
| **NFR8: Zero data persistence** | No transaction data stored after request completion | No database, no file system storage, no server logs containing transaction content |
| **NFR9: No client-side data persistence** | No financial data in cookies, localStorage, or sessionStorage | Browser retains zero transaction data after tab close |
| **NFR10: LLM API data handling** | Use LLM provider's data privacy options where available (Gemini, OpenAI) | Minimize third-party data retention |
| **NFR11: Input sanitization** | All uploaded file content sanitized before processing | Prevent injection attacks via crafted CSV/Excel content |

### Accessibility

| Requirement | Standard | Measurement |
|---|---|---|
| **NFR12: WCAG compliance level** | WCAG 2.1 AA | Automated audit (axe-core or Lighthouse) + manual keyboard/screen reader testing |
| **NFR13: Color contrast** | 4.5:1 minimum for normal text, 3:1 for large text and UI components | Measured via contrast checker tooling |
| **NFR14: Keyboard operability** | All interactive elements reachable and operable via keyboard | Tab through entire UI without mouse |
| **NFR15: Screen reader compatibility** | Meaningful aria labels, alt text on charts, logical reading order | Test with VoiceOver/NVDA |
| **NFR16: Chart data alternatives** | Every visual chart has an accessible data table alternative | Toggle/expand data table present for each chart |

### Reliability & Availability

| Requirement | Target | Measurement |
|---|---|---|
| **NFR17: Live demo uptime** | >95% availability | Demo accessible when evaluators visit (monitored via simple health check) |
| **NFR18: Graceful LLM API failure** | App remains functional with clear error messaging if LLM API is unavailable | User sees "AI service temporarily unavailable" — not a crash or blank screen |
| **NFR19: Partial failure resilience** | Dashboard renders with available data when partial processing occurs | Skipped transactions reported; valid transactions displayed |

### External Integration

| Requirement | Target | Measurement |
|---|---|---|
| **NFR20: LLM API error handling** | Retry failed batches once, then degrade gracefully | No silent failures; all errors surfaced to user |
| **NFR21: LLM API cost control** | Free tier for typical usage | Gemini 2.5 Flash free tier covers portfolio-scale usage; OpenAI available as paid alternative |
| **NFR22: LLM response validation** | Validate structured JSON responses from LLM before processing | Reject malformed LLM output, retry or flag affected transactions |
| **NFR23: LLM provider independence** | **PROVEN** — Gemini and OpenAI providers both implemented and swappable via env var | Swap LLM provider without rewriting categorization logic |

