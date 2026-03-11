# Product Brief: AI-Powered Expense Intelligence Dashboard

## Executive Summary

The AI-Powered Expense Intelligence Dashboard is a web application that transforms messy bank transaction data into clear, categorized spending insights using AI. It targets individuals — college students, first-time earners, and young professionals — who have never analyzed their transactions and lack the tools or motivation to do so manually.

The core problem: bank statements are full of cryptic descriptions like "AMZN Mktp IN*4F7K2" or "UPI-RAZORPAY-SWIGGY". Users don't know where their money goes because parsing this data manually is tedious, confusing, and unrewarding. Existing expense trackers either require manual tagging (which nobody sustains) or use rigid rule-based systems that fail on the messy reality of Indian bank transaction descriptions.

This project demonstrates how AI/semantic understanding can solve what rule-based systems cannot — accurately categorizing real-world transaction data into meaningful spending categories, then presenting that data through clean visualizations, AI-generated natural language insights, and a conversational AI chat interface where users can ask questions about their spending in plain language.

**The core thesis:** AI-powered categorization of messy transaction descriptions is the unlock. Once transactions are accurately categorized with zero user effort, everything else — spending breakdowns, merchant analysis, trend detection, plain-language insights, and conversational exploration — flows naturally.

The application is designed with student-friendly UX throughout — replacing financial jargon like "Total Income/Expenses" with intuitive labels like "Money In (Credits)" and "Money Out (Debits)" — making it genuinely accessible to users with zero financial literacy.

This is a portfolio/demonstration project showcasing applied AI in the personal finance domain, with emphasis on clean engineering, thoughtful edge case handling, and domain understanding. It uses Google Gemini 2.5 Flash as its primary LLM, with OpenAI as an alternative provider.

---

## Core Vision

### Problem Statement

Young individuals in India — students, first-time earners, and early-career professionals — have no meaningful visibility into their spending patterns. Their bank statements contain hundreds of transactions with cryptic, inconsistent descriptions that are effectively unreadable without significant manual effort. The result: money leaves their accounts without any understanding of where it went, why spending increased, or what patterns are forming.

### Problem Impact

- **Zero spending visibility**: Users cannot answer basic questions like "how much did I spend on food this month?" without manually reading every transaction
- **Cryptic transaction data**: Descriptions like "AMZN Mktp IN*4F7K2", "UPI-PAYTM-7298461", "POS 4421XX ZOMATO" are meaningless to users without manual interpretation
- **Manual tracking fatigue**: Users who attempt spreadsheet-based tracking abandon it within weeks because categorizing transactions one-by-one is unsustainable
- **Invisible overspending**: Without categorized breakdowns, users don't realize they spent ₹8,000 on food delivery or ₹3,000 on subscriptions they forgot about
- **Financial stress from lack of clarity**: People don't struggle because they don't earn enough — they struggle because they have no visibility into where their money actually goes

### Why Existing Solutions Fall Short

Personal finance apps available in India — including Walnut, Money Manager, CRED, and manual spreadsheets — each fail in specific ways:

- **Manual tagging apps**: Require users to categorize every transaction themselves — adoption drops within weeks
- **Rule-based categorizers**: Use keyword matching that breaks on the messy, inconsistent formats of Indian bank statements (UPI references, abbreviated merchant names, POS terminal codes)
- **Bank apps**: Show raw transaction lists with no categorization, no aggregation, no insight
- **Spreadsheets**: Require significant effort to maintain and provide no intelligence layer
- **CRED/Fi Money**: Focus on credit score and rewards, not spending analysis and insight

**The gap**: No existing tool uses AI to semantically understand messy transaction descriptions and automatically produce accurate categorizations without user effort. That's the core opportunity.

### Proposed Solution

A web-based dashboard that takes a user's bank statement file (CSV or Excel — including password-protected Excel from SBI YONO) and delivers:

1. **AI-Powered Transaction Categorization**: Semantic understanding of messy bank descriptions (e.g., "AMZN Mktp IN*4F7K2" → Shopping/Amazon, "UPI-SWIGGY-9182" → Food Delivery/Swiggy) with intelligent handling of edge cases like refunds, transfers, salary credits, and EMIs. Powered by Google Gemini 2.5 Flash.
2. **Spending Breakdown Dashboard**: Visual charts showing category-wise spending distribution, top merchants, and spending trends — the answer to "where did my money go?" — with month-by-month filtering
3. **AI-Generated Natural Language Insights**: Plain-language summaries like "You spent 34% of your income on food delivery this month — up 12% from last month" that make data immediately actionable without interpretation
4. **Conversational AI Chat**: A floating chat interface where users ask natural-language questions about their spending (e.g., "What did I spend on food last Tuesday?") and receive AI-powered answers grounded in their actual transaction data
5. **Enhanced Statement View**: A searchable, sortable, filterable transaction table with daily groupings, day-of-week labels, daily totals, and color-coded category pills — giving users full drill-down capability into their categorized transactions
6. **AI vs. Rule-Based Comparison Mode**: A built-in comparison showing AI categorization results alongside rule-based output on the same transaction data, with quantitative accuracy metrics proving the AI thesis with data — not just claims

### Key Differentiators

| Differentiator | Description |
|---|---|
| **AI Semantic Categorization** | Uses Google Gemini 2.5 Flash to understand messy, real-world transaction descriptions — not brittle keyword rules that break on Indian bank formats |
| **Zero User Effort** | Upload CSV or Excel (including password-protected) → get insights. No manual tagging, no configuration, no accounting knowledge required |
| **Conversational AI Chat** | Users ask natural-language questions about their spending and get answers grounded in their actual transaction data — not a generic chatbot |
| **Encrypted File Support** | Handles AES-encrypted Excel files (e.g., SBI YONO password-protected .xlsx) with smart header detection that scans up to 20 rows to find actual data |
| **Student-Friendly UX** | Financial jargon replaced with intuitive labels ("Money In/Out" instead of "Income/Expenses") — genuinely accessible to users with zero financial literacy |
| **Edge Case Intelligence** | Thoughtful handling of refunds, bank transfers, salary credits, EMIs, and other non-expense transactions that confuse naive categorizers |
| **Plain-Language Insights** | AI-generated natural language summaries — not charts that require interpretation, but sentences that state what's happening |
| **Clean Data Pipeline** | Demonstrates good engineering: file parsing (CSV/Excel) → AI categorization → data aggregation → visualization → insight generation |

---

## Target Users

### Primary Users

#### Persona: Priya — The Organized Professional

**Profile:**
- **Age**: 28, Software Engineer at a mid-size tech company
- **Income**: ₹90,000/month, multiple payment methods (UPI, credit card, debit card, auto-debits)
- **Location**: Bangalore
- **Financial Behavior**: Earns well but uses multiple payment channels — UPI for daily purchases, credit card for online shopping, auto-debits for subscriptions and EMIs. Knows she should track spending but finds it too tedious.

**Problem Experience:**
- Has 150–200 transactions per month across accounts
- Wants to spot overspending patterns but can't parse cryptic transaction descriptions
- Has tried spreadsheets twice and abandoned both times within 3 weeks
- Suspects she's overspending on food delivery and subscriptions but can't prove it without manually reviewing every transaction

**Success Vision:**
Uploads her bank statement file, and within seconds sees a clean breakdown: ₹12,400 on food delivery (Swiggy, Zomato), ₹4,200 on subscriptions (Netflix, Spotify, YouTube Premium, iCloud), ₹8,900 on shopping (Amazon, Myntra). She immediately spots that food delivery is 14% of her income — higher than she expected. The AI insight confirms: "Your food delivery spending increased 22% compared to last month."

**"Aha!" Moment:**
When the AI correctly categorizes "AMZN Mktp IN*4F7K2" as Amazon Shopping and "UPI-RAZORPAY-SWIGGY" as Food Delivery — without her doing anything. That's when she realizes this tool *understands* her transactions.

---

#### Persona: Rahul — The First-Time Earner

**Profile:**
- **Age**: 23, Junior Analyst, first job out of college
- **Income**: ₹35,000/month
- **Location**: Pune
- **Financial Behavior**: Never tracked expenses in his life. Uses UPI for almost everything. Gets salary credited, spends through the month, and is surprised when the balance is low before payday.

**Problem Experience:**
- Has never opened a bank statement file in his life
- Doesn't understand financial terminology — "what's a POS transaction?"
- Frequently runs out of money in the last week of the month
- Parents ask "where does your money go?" and he genuinely doesn't know

**Success Vision:**
Uploads his statement and sees a simple, visual breakdown he actually understands — the dashboard says "Money Out (Debits) ↑" instead of confusing terms like "Total Expenses." He selects last month from the month filter and the AI tells him in plain language: "You spent ₹11,200 on food this month — ₹6,800 of that was food delivery. Your top merchant was Zomato (₹4,100)." He types into the chat bubble: "How much did I spend on Zomato?" and gets an instant answer. For the first time, he has an actual conversation with his own financial data.

**"Aha!" Moment:**
When the dashboard shows him a pie chart of his spending with the label "Money Out (Debits) ↑" — no jargon — and the AI summary says "Food delivery is your #1 expense category." Then he asks the chat "What was my biggest single purchase?" and gets an immediate, specific answer. No reports, no effort — just clarity he can interact with.

---

#### Persona: Ananya — The Budget-Conscious Student

**Profile:**
- **Age**: 20, Engineering student
- **Income**: ₹8,000/month allowance from parents
- **Location**: Hyderabad
- **Financial Behavior**: Limited budget, every hundred rupees matters. Uses UPI almost exclusively. Wants to understand spending to stretch her allowance further.

**Problem Experience:**
- Runs out of allowance mid-month regularly
- Spends small amounts frequently (₹50 chai, ₹120 snacks, ₹199 subscription) that add up invisibly
- Has no tools — just checks bank balance and panics
- Needs to see where small, frequent transactions accumulate into real spending

**Success Vision:**
Uploads her statement and discovers that ₹2,400 went to food/snacks (30% of her allowance) across 45 small transactions she barely noticed. The dashboard shows "Money In (Credits) ↓: ₹8,000" and "Money Out (Debits) ↑: ₹7,200" — she immediately understands without Googling what "credit" means. She filters to last month using the month dropdown, then switches to the Statement tab to see her transactions grouped by day with color-coded category pills. She asks the chat: "Where did most of my money go this week?" and gets a clear answer. The AI insight: "You made 45 food purchases averaging ₹53 each — they totaled ₹2,400 this month." She finally sees the pattern that "small spends" aren't small at all.

**"Aha!" Moment:**
When the dashboard aggregates dozens of tiny UPI transactions she'd never review individually and shows them as a meaningful spending category — using language she actually understands. The invisible becomes visible, and she can ask follow-up questions in the chat to dig deeper.

---

### User Journey

**Discovery:**
Users find the project through GitHub, portfolio links, tech community showcases, or peer recommendations. Interest is sparked by the promise: "Upload your bank statement, get instant AI-powered spending insights."

**Onboarding (First 2 Minutes):**
1. Open the web app
2. Upload bank statement (CSV or Excel)
3. AI processes and categorizes all transactions automatically
4. Dashboard renders with spending breakdown, top merchants, and AI insights
5. No signup, no configuration, no manual tagging — clarity in under 2 minutes

**The "Aha!" Moment:**
When the AI correctly interprets a cryptic transaction like "POS 4421XXXX8823 ZOMATO LI" as "Food Delivery / Zomato" — and the user realizes the system *understands* their messy bank data without any help.

**Core Usage:**
Upload a new statement monthly (or whenever curiosity strikes). Review spending breakdown, check top merchants, read AI-generated insights. Adjust behavior based on what they learn. Over time, users develop spending awareness that persists even outside the app.

---

## Success Metrics

### Project Success Metrics

**North Star Outcome:** Demonstrate that AI-powered semantic categorization of messy bank transactions produces meaningfully better results than rule-based approaches, and that the resulting insights create genuine "aha moments" for users.

**What This Project Proves:**

| Dimension | Success Criteria |
|---|---|
| **AI Categorization Accuracy** | >90% accuracy on real Indian bank statement transactions, including messy UPI/POS descriptions |
| **Edge Case Handling** | Correctly identifies and handles refunds, transfers, salary credits, EMIs, and other non-expense transactions |
| **Rule-Based Comparison** | Demonstrably outperforms naive keyword-matching on real-world transaction data |
| **Zero-Effort Insight** | Users receive meaningful spending breakdown and insights without any manual input beyond file upload (CSV or Excel) |
| **Clarity Delivery** | AI-generated insights are understandable by users with zero financial literacy |
| **Engineering Quality** | Clean data pipeline, well-structured code, comprehensive error handling, thoughtful architecture |

### User Experience Metrics

| Metric | Definition | Target |
|---|---|---|
| **Time-to-Insight** | Time from file upload to full dashboard with AI insights | <30 seconds |
| **Categorization Accuracy** | % of transactions correctly categorized by AI | >90% |
| **Insight Clarity** | Users understand AI-generated insights without explanation | >95% comprehension |
| **Edge Case Coverage** | Refunds, transfers, salary, EMIs correctly identified and excluded from spending analysis | >85% accuracy |
| **Chat Engagement** | Users ask follow-up questions via the conversational chat interface | Measured by chat sessions per upload |
| **Month Filter Usage** | Users filter dashboard by individual months to explore spending over time | Measured by filter interactions per session |
| **User Comprehension** | Users can answer "where did my money go?" after using the dashboard | 100% of test users |

### Technical Demonstration Goals

- **AI vs. Rules**: Include a comparison mode showing AI categorization results alongside what a rule-based system would produce — demonstrating the gap
- **Pipeline Transparency**: Clean, traceable data flow from raw file (CSV/Excel) → parsed transactions → AI categorization → aggregated data → charts → insights
- **Domain Understanding**: Evidence of thoughtful personal finance domain modeling — handling of Indian-specific transaction formats, UPI patterns, common merchant naming conventions
- **Code Quality**: Well-documented, tested, maintainable codebase that demonstrates professional engineering practices

---

## MVP Scope

### Core Features (8 Features)

**1. File Upload & Parsing (CSV and Excel — including password-protected)**
- **What it does**: Accepts bank statement files in CSV and Excel (.xls/.xlsx) formats — including AES-encrypted password-protected Excel files (e.g., SBI YONO) — and parses them into structured transaction data
- **Scope**: SBI and HDFC for MVP. The extensible format-config architecture makes adding new banks (ICICI, Axis, etc.) a config addition, not a code rewrite. SBI/YONO exports password-protected Excel only — encrypted file support and Excel parsing are essential for real-world coverage. Handle variations in column naming, date formats, and amount formatting across both file types.
- **Smart Header Detection**: Scans up to 20 rows to find the actual header row (SBI YONO has metadata rows before data), with 4-pass fuzzy column matching to handle non-standard column names
- **Password-Protected Excel**: Uses officecrypto-tool to decrypt AES-encrypted .xlsx files. Users see a password dialog when uploading Excel files that require decryption.
- **Edge cases**: Graceful handling of malformed rows, encoding issues, duplicate transactions, multi-format CSVs, Excel sheets with multiple tabs or header rows, and encrypted files with incorrect passwords
- **Output**: Clean, structured array of transactions with date, description, amount, and type (debit/credit)

**2. AI-Powered Transaction Categorization**
- **What it does**: Uses AI/LLM to semantically understand messy transaction descriptions and assign accurate spending categories
- **This IS the core feature**: The entire product thesis rests on this working well. This is NOT rule-based — AI semantic understanding (powered by Google Gemini 2.5 Flash, with OpenAI as an alternative provider) is what makes the product valuable.
- **Categories**: Food & Dining, Food Delivery, Shopping, Subscriptions, Transport, Utilities, Entertainment, Rent, EMI/Loans, Groceries, Health, Education, Personal Care, Transfers (excluded from spending), Salary/Income (excluded), Refunds (excluded), Other
- **Edge case handling**:
  - Refunds: Detected and excluded from spending totals (or shown as offsets)
  - Transfers: Bank-to-bank transfers identified and excluded from expense analysis
  - Salary/Income: Credits correctly identified and separated from expenses
  - EMIs: Recurring loan payments identified and categorized distinctly
  - UPI patterns: "UPI-MERCHANTNAME-REFNUM" format parsed correctly
  - POS patterns: "POS XXXXXXXXXX MERCHANT CITY" format handled
  - Abbreviated merchants: "AMZN Mktp IN*4F7K2" → Amazon Shopping
- **Output**: Each transaction tagged with category, confidence score, and merchant name (where identifiable)

**3. Spending Breakdown Dashboard**
- **What it does**: Visual dashboard showing categorized spending with charts and merchant breakdowns, filterable by month
- **Visualizations**:
  - Category-wise spending pie/donut chart
  - Top 10 merchants by spend amount
  - Category-wise spending bar chart
  - Summary cards with student-friendly labels: "Money In (Credits) ↓" and "Money Out (Debits) ↑" with explanatory helper text
- **Month Filter**: Dropdown to filter all dashboard data — see Feature 8 for full scope
- **Scope**: Web-only, clean and responsive design. Focused on clarity — no clutter, no unnecessary controls.
- **Output**: Interactive dashboard that answers "where did my money go?" at a glance

**4. AI-Generated Natural Language Insights**
- **What it does**: AI analyzes the categorized spending data and generates 3–5 plain-language insights
- **Insight types**:
  - Top spending category highlight ("Food delivery was your #1 expense at ₹8,400 — 24% of your total spending")
  - Unusual patterns ("You had 12 Swiggy orders in the last week of the month — double your weekly average")
  - Merchant concentration ("67% of your shopping spend went to Amazon alone")
  - Small-spend accumulation ("You made 38 transactions under ₹100 that totaled ₹2,840")
  - Simple actionable advice ("Reducing food delivery by 2 orders/week could save ~₹2,000/month")
- **Output**: 3–5 clear, specific, jargon-free sentences displayed alongside the dashboard

**5. Conversational AI Chat**
- **What it does**: A floating chat bubble (ChatBox component) that lets users ask natural-language questions about their spending and receive AI-powered answers grounded in their actual individual transaction data
- **Powered by**: Google Gemini 2.5 Flash (primary), OpenAI (alternative) via `/api/chat` endpoint
- **Context**: Full individual transaction data is passed as context so answers are specific and accurate — not generic financial advice
- **Example queries**:
  - "What did I spend on food last Tuesday?"
  - "How much did I spend on Swiggy this month?"
  - "What was my biggest single purchase?"
  - "Show me all my subscriptions"
- **Output**: Conversational AI responses displayed in a floating chat interface alongside the dashboard

**6. Enhanced Statement View (Transaction Table)**
- **What it does**: A searchable, sortable, filterable transaction table providing a full statement view of all categorized transactions
- **Features**:
  - Daily groupings with day-of-week labels (e.g., "Monday, March 3")
  - Daily spending totals per group
  - Color-coded category pills for visual scanning
  - Search by description, merchant, or category
  - Sort by date, amount, or category
  - Filter by category
- **Scope**: Accessible as a "Statement" tab in the dashboard
- **Output**: Detailed transaction-level view that enables drill-down from the summary charts

**7. AI vs. Rule-Based Comparison**
- **What it does**: Runs both the AI categorization engine and a rule-based keyword-matching engine on the same transactions, then presents a side-by-side comparison with quantitative accuracy metrics
- **Scope**:
  - Side-by-side table showing the same transactions categorized by AI vs. rule-based engine
  - Quantitative accuracy summary (e.g., "AI: 94% accurate, Rules: 67% accurate")
  - Always-run-both-engines design — rule-based engine is zero-cost, so both engines run on every upload
- **Why it matters**: This is the feature that proves the project thesis with data. It's the "portfolio evaluator's aha moment" — demonstrable evidence that AI semantic understanding outperforms keyword matching on real-world transaction data
- **Output**: Comparison view with accuracy metrics, disagreement highlights, and per-category breakdowns

**8. Month Filter**
- **What it does**: Provides a dropdown to filter all dashboard data by individual month when the uploaded statement spans multiple months
- **Scope**: Filters charts, summaries, insights, and statement view by selected month — enabling month-over-month comparison
- **Output**: All dashboard components update to reflect data for the selected month only

### Also MVP (Non-Feature Requirements)

- **Sample dataset for demo**: Pre-loaded synthetic bank statement so evaluators without real bank statements can experience the full dashboard immediately
- **Graceful error handling at every failure point**: File parsing errors, LLM failures, malformed data — every failure path shows a clear, user-friendly message
- **Privacy transparency note on upload page**: Clear statement that uploaded data is processed in-memory and not stored
- **Financial disclaimer in UI footer**: Standard disclaimer that this tool provides informational insights, not financial advice
- **Live demo deployment**: Deployed on Vercel (frontend) + Render (backend) for instant portfolio evaluation
- **README as design document**: Comprehensive README covering architecture decisions, tech stack rationale, and demo instructions

### Out of Scope (Not in MVP, Not in Future Versions)

This is a focused portfolio project. The following are permanently out of scope:

| Feature | Reason |
|---|---|
| **Mobile / Native Apps** | Web-only project |
| **Bank API Integration** | File upload (CSV/Excel) is the intended data input method |
| **Anomaly Detection System** | Beyond MVP scope — AI insights cover notable patterns |
| **Cash Flow Prediction** | Not relevant for the personal expense analysis use case |
| **Tax-Saving Suggestions** | Not relevant for the target audience or project goals |
| **Multi-user / Team Access** | Single-user tool |
| **Accountant Portal** | No B2B component |
| **Enterprise Features** | No business/SMB features |
| **Pricing / Subscriptions / SaaS** | This is a portfolio project, not a commercial product |
| **User Accounts / Auth** | Stateless — upload, view, done |

### Post-MVP Features

**Phase 2:**
- ICICI and Axis bank statement support
- Multi-month trend analysis (spending trends over time)
- Export categorized transactions as CSV
- Confidence threshold UI (show/adjust AI confidence scores)

**Phase 3:**
- Automated bank format detection (no manual bank selection)
- Custom user-defined categories
- Spending benchmarks (compare against anonymized averages)
- Budget goals and alerts
- PDF bank statement parsing

### Risk Mitigation Strategy

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **LLM categorization accuracy <90%** | Medium | High | Merchant recognition built into LLM prompt engineering + batching for consistent context |
| **LLM API cost** | Low | Medium | Google Gemini 2.5 Flash free tier handles expected demo volume |
| **LLM latency >30s** | Medium | Medium | Batching reduces total API calls; progress indicator keeps users informed during processing |
| **Bank format variability** | High | Medium | Extensible format-config architecture — adding a new bank is a config addition, not a code rewrite |
| **Solo developer bottleneck** | High | Medium | Tight MVP scope (8 features) with clear priority order; no scope creep |
| **Demo data availability** | Medium | Low | Synthetic sample dataset included so evaluators can demo without real bank statements |

### MVP Success Criteria

| Criteria | Threshold |
|---|---|
| **AI categorizes real bank transactions accurately** | >90% accuracy on test dataset of real Indian bank statements |
| **Edge cases handled correctly** | Refunds, transfers, salary, EMIs correctly identified in >85% of cases |
| **Dashboard renders clear spending breakdown** | Category chart, top merchants, and totals display correctly |
| **AI insights are specific and correct** | Insights reference actual data (not generic advice), factually accurate |
| **End-to-end pipeline works** | File upload (CSV or Excel) → categorization → dashboard → insights in <30 seconds |
| **AI outperforms rules** | Demonstrable accuracy improvement over keyword-based categorization |

---

## What This Project Demonstrates

### Technical Competencies

1. **Applied AI/LLM Integration**: Real-world use of Google Gemini 2.5 Flash for semantic understanding of unstructured text — both for transaction categorization and conversational Q&A over financial data
2. **Data Pipeline Engineering**: Clean, well-structured pipeline: file upload → parsing → AI processing → aggregation → visualization → insight generation
3. **Domain Expertise**: Thoughtful modeling of personal finance concepts — transaction types, spending categories, Indian payment ecosystem patterns (UPI, POS, NEFT, IMPS)
4. **Edge Case Thinking**: Deliberate handling of refunds, transfers, salary credits, EMIs, and other transactions that break naive categorizers
5. **Full-Stack Web Development**: End-to-end web application with data processing backend and interactive visualization frontend
6. **AI vs. Rule-Based Comparison**: Evidence-based demonstration that semantic AI understanding produces better results than keyword matching on real-world data

### Domain Understanding

- Indian bank statement formats and their inconsistencies
- UPI transaction description patterns and merchant extraction
- POS terminal description parsing
- Common merchant abbreviations and naming conventions
- Personal finance categorization taxonomy appropriate for Indian spending patterns
- Handling of financial edge cases (refunds as negative expenses, transfers as non-expenses, EMIs as debt payments)
- Password-protected Excel decryption (SBI YONO AES-encrypted .xlsx files)
- Smart header detection with fuzzy column matching for non-standard bank statement formats
