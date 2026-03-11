---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - prd.md
  - product-brief-Test-AI-Agent-2026-02-23.md
workflowType: 'architecture'
project_name: 'AI-Powered Expense Intelligence Dashboard'
user_name: 'PrinceLevin'
date: '2026-03-08'
lastStep: 8
status: 'complete'
completedAt: '2026-03-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (49 FRs across 13 categories):**

| Category | FR Count | Architectural Implication |
|---|---|---|
| File Upload & Validation | 6 (FR1-FR6) | Input gateway — file type detection, validation pipeline, multi-encoding handling |
| Transaction Parsing | 7 (FR7-FR13) | Multi-bank format parser with extensible config architecture, Indian locale handling |
| AI Transaction Categorization | 6 (FR14-FR19) | Core engine — LLM-based, batch processing, structured output, provider abstraction |
| Rule-Based Comparison | 3 (FR20-FR22) | Parallel categorization engine sharing interface contract with AI engine |
| Spending Dashboard | 6 (FR23-FR28) | Visualization layer — charts + data tables + comparison toggle |
| AI-Generated Insights | 6 (FR29-FR34) | Second LLM integration point — structured data → natural language generation |
| Processing & Feedback | 3 (FR35-FR37) | UX state management — progress indicators, error surfaces |
| Privacy & Compliance | 3 (FR38-FR40) | Cross-cutting — zero persistence, transparency notices |
| Demo & Portfolio | 2 (FR41-FR42) | Sample dataset, deployment infrastructure |
| AI Conversational Chat | 2 (FR43-FR44) | Third LLM integration point — chat UI + API endpoint for conversational spending queries |
| Transaction Statement View | 1 (FR45) | Enhanced transaction table with search, sort, filter, daily groupings |
| Month Filter | 1 (FR46) | Cross-dashboard month-level data filtering |
| File Parsing Enhancements | 3 (FR47-FR49) | Excel decryption, smart header detection, fuzzy column matching |

**Non-Functional Requirements (23 NFRs):**

| Category | NFR Count | Key Constraints |
|---|---|---|
| Performance | 6 (NFR1-NFR6) | <3s initial load, <30s end-to-end processing for 200 txns, <2s dashboard render, LCP <2.5s |
| Security & Privacy | 5 (NFR7-NFR11) | HTTPS, zero persistence (server+client), LLM zero-retention, input sanitization |
| Accessibility | 5 (NFR12-NFR16) | WCAG 2.1 AA, keyboard navigable, screen reader compatible, chart data alternatives |
| Reliability | 3 (NFR17-NFR19) | >95% demo uptime, graceful LLM failure, partial failure resilience |
| External Integration | 4 (NFR20-NFR23) | LLM retry/degrade, <$0.05/upload cost, JSON response validation, provider independence |

**Scale & Complexity:**

- Primary domain: Full-stack web (SPA + API + external LLM)
- Complexity level: Medium
- Estimated architectural components: ~8-10 distinct modules (file parser, bank format configs, AI categorizer, rule-based categorizer, data aggregator, insight generator, chat interface, visualization layer, error handling framework)

### Technical Constraints & Dependencies

- **Solo developer, 2-3 week timeline** — architecture must be right-sized, no over-engineering
- **External LLM dependency** — availability, latency, cost, and response format are runtime risks
- **Stateless backend** — no database, no session state, no file persistence
- **Indian payment ecosystem domain** — UPI, POS, NEFT/IMPS, merchant abbreviation patterns require domain-specific parsing
- **Multi-bank format extensibility** — adding a new bank should be a config change, not a code rewrite
- **Portfolio audience** — code clarity and architecture visibility matter as much as functionality

### Cross-Cutting Concerns Identified

1. **Error handling & graceful degradation** — every layer must handle failures with actionable user messaging; partial success over total failure
2. **Indian locale handling** — currency (₹/Rs./INR), dates (5 format variants), numbers (lakhs notation XX,XX,XXX) affect parsing, display, and insight generation
3. **Privacy / zero persistence** — enforced across server (no logs), client (no localStorage), and LLM provider (zero-retention mode)
4. **Accessibility (WCAG 2.1 AA)** — keyboard navigation, screen reader support, color contrast, data table alternatives for every chart
5. **LLM resilience** — retry logic, timeout handling, response validation, provider abstraction, cost control
6. **Input sanitization** — prevent injection via crafted CSV/Excel content across the parsing pipeline

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web — React SPA frontend + Node.js REST API backend, TypeScript end-to-end.

### Technical Preferences

- **Language:** TypeScript 5.6 (end-to-end)
- **Frontend Framework:** React 19
- **Backend Framework:** Express 5 (Node.js)
- **Build Tooling:** Vite 6 (frontend)
- **Testing:** Vitest 2.1.9
- **LLM Provider:** Gemini 2.5 Flash (primary, via @google/generative-ai SDK), OpenAI GPT-4o-mini (alternative)
- **Deployment:** Vercel (frontend), Railway or Render (backend API)

### Starter Options Considered

| Option | Verdict | Rationale |
|---|---|---|
| **Vite + React + TS / Express + TS** | ✅ Selected | Right-sized for a stateless SPA + single REST endpoint. No unnecessary abstractions. |
| **Next.js + API Routes** | ❌ Rejected | Brings SSR, file-based routing, server components — none needed for a pure SPA with 3 UI states. Adds architectural noise. |
| **T3 Stack** | ❌ Rejected | Includes Prisma (no DB), tRPC (single endpoint), NextAuth (no auth). Misleading layers for this architecture. |
| **Turborepo Monorepo** | ❌ Rejected | Monorepo tooling overhead for 2 packages is over-engineering. Simple `/client` + `/server` directories suffice. |
| **Create React App** | ❌ Rejected | Deprecated/unmaintained. Vite is the successor. |

### Selected Starter: Vite + React + TypeScript (frontend) + Express + TypeScript (backend)

**Rationale:** Minimal, mainstream, portfolio-appropriate. No framework overhead beyond what the project requires. Express is the most recognizable backend framework for evaluators. Vite is the current standard for React SPAs. TypeScript end-to-end demonstrates type safety awareness.

**Initialization Commands:**

```bash
# Create project root
mkdir expense-intelligence && cd expense-intelligence

# Frontend (Vite 6 + React 19 + TypeScript 5.6)
npm create vite@latest client -- --template react-ts
cd client
npm install recharts
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
cd ..

# Backend (Express 5 + TypeScript 5.6)
mkdir server && cd server
npm init -y
npm install express cors dotenv multer @google/generative-ai openai papaparse xlsx officecrypto-tool zod
npm install -D typescript @types/express @types/cors @types/node @types/multer @types/papaparse tsx vitest
npx tsc --init
cd ..

# Root (workspace scripts)
npm init -y
npm install -D concurrently
```

**Architectural Decisions Provided by Starter:**

| Decision | Value |
|---|---|
| **Language & Runtime** | TypeScript 5.6 end-to-end, Node.js runtime |
| **Frontend Framework** | React 19 via Vite 6 (SWC-based transforms, HMR) |
| **Backend Framework** | Express 5 (minimal, REST API) |
| **Build Tooling** | Vite (frontend bundling + dev server), `tsx` (backend dev runner) |
| **Testing Framework** | Vitest 2.1.9 (frontend + backend — Vite-native, Jest-compatible API) |
| **Linting/Formatting** | ESLint + Prettier (Vite template includes ESLint config) |
| **Dev Experience** | Vite HMR (frontend), tsx watch (backend), Vitest watch mode |

**Project Structure:**

```
expense-intelligence/
├── client/                  # React SPA (Vite)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client, data transformation
│   │   ├── types/           # Shared TypeScript types
│   │   └── App.tsx          # Root component (3 states: upload/processing/dashboard)
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                  # Express API
│   ├── src/
│   │   ├── parsers/         # Bank format parsers (HDFC CSV, SBI Excel)
│   │   ├── categorizers/    # Rule-based categorization engine
│   │   ├── services/        # LLM client (Gemini/OpenAI), insight generator
│   │   ├── types/           # Shared TypeScript types
│   │   └── index.ts         # Express server: POST /api/analyze, POST /api/chat, GET /api/health
│   ├── tsconfig.json
│   └── package.json
├── README.md
└── package.json             # Root scripts (dev, build, test)
```

**Note:** Project initialization using these commands should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- File parsing libraries (papaparse + xlsx)
- Data validation strategy (zod)
- LLM provider abstraction interface
- API contract design
- Frontend state management approach
- Charting library selection

**Important Decisions (Shape Architecture):**
- Styling solution (Tailwind CSS)
- Input sanitization approach
- CI/CD pipeline

**Deferred Decisions (Post-MVP):**
- Multi-month trend storage (if Phase 2 proceeds)
- Custom category persistence (if Phase 3 proceeds)
- PDF parsing pipeline (if Phase 3 proceeds)

### Data Architecture

| Decision | Choice | Version | Rationale |
|---|---|---|---|
| **CSV Parsing** | papaparse | 5.5 | Industry standard. Handles encoding detection (UTF-8, ISO-8859-1, Windows-1252), streaming, error recovery, partial row handling. Works server-side in Node.js. |
| **Excel Parsing** | xlsx (SheetJS) | 0.18 | De facto standard for .xls/.xlsx reading. Community edition is free. Async parsing with smart header detection (scans up to 20 rows for header keywords). Uses headerIndexMap to align data columns with merged-cell headers. 4-pass fuzzy column matching in bankFormats.ts (exact → contains → normalized → index fallback). |
| **Excel Decryption** | officecrypto-tool | — | AES decryption for password-protected Excel files. Applied before xlsx parsing in the async excelParser pipeline. |
| **Schema Validation** | zod | — | TypeScript-first schema validation. Single source of truth for runtime validation AND TypeScript type inference. Used for: parsed transaction schemas, LLM JSON response validation, API request/response contracts. |
| **Merchant Matching** | LLM prompt context | — | Merchant categorization handled within the LLM categorization prompt rather than a separate cache file. The LLM receives transaction descriptions and applies merchant recognition as part of its categorization logic. |
| **Database** | None (stateless) | — | No database by design. All processing is request-scoped: receive file → parse → categorize → return → discard. Zero persistence (NFR8). |

### Authentication & Security

| Decision | Choice | Rationale |
|---|---|---|
| **Authentication** | None | Stateless portfolio project. No user accounts, no sessions, no auth. |
| **Input Sanitization** | Formula injection stripping | Strip formula prefixes (`=`, `+`, `-`, `@`) from cell values during CSV/Excel parsing. Prevents formula injection attacks via crafted files. |
| **File Size Limits** | 5MB / 10,000 rows | Enforced at upload. Reject with clear messaging per PRD error scenarios. |
| **CORS** | Single-origin | Frontend domain only in production. No wildcard `*`. |
| **API Key Management** | Environment variables | `GEMINI_API_KEY` (primary), `OPENAI_API_KEY` (alternative) in `.env` (local dev) and platform env vars (production). `LLM_PROVIDER` and `GEMINI_MODEL` for provider configuration. Never exposed to client. |
| **Data Transit** | HTTPS/TLS | All client↔server and server↔LLM provider communication encrypted (NFR7). |
| **Client-Side Privacy** | Zero persistence | No cookies, localStorage, or sessionStorage for financial data (NFR9). |

### API & Communication Patterns

**REST Endpoints:**

```
POST /api/analyze
Content-Type: multipart/form-data
Body: { file: <bank statement file> }

Response 200:
{
  transactions: Transaction[],        // Parsed + categorized (AI + rule-based)
  categories: CategorySummary[],      // Aggregated spending by category
  merchants: MerchantSummary[],       // Top merchants by spend
  insights: string[],                // 3-5 AI-generated plain-language insights
  comparison: ComparisonResult,       // AI vs rule-based accuracy comparison
  meta: {
    totalRows: number,
    processedRows: number,
    skippedRows: number,
    processingTimeMs: number
  }
}

Response 4xx/5xx:
{
  error: {
    code: string,                     // e.g., "UNSUPPORTED_FORMAT", "FILE_TOO_LARGE"
    message: string,                  // User-friendly actionable message
    details?: Record<string, unknown> // Additional context (e.g., supported formats)
  }
}
```

**Health Check:** `GET /api/health` — returns 200 OK for uptime monitoring.

**Chat Endpoint:**

```
POST /api/chat
Content-Type: application/json
Body: {
  messages: ChatMessage[],      // { role: 'user'|'assistant', content: string }
  summary: SpendingSummary,     // Aggregated spending data
  transactions?: Transaction[]  // Individual transactions for context
}

Response 200:
{
  response: string              // Natural language response from LLM
}

Response 4xx/5xx:
{
  error: {
    code: string,
    message: string,
    details?: Record<string, unknown>
  }
}
```

**Design Decisions:**
- **Always run both engines** — AI and rule-based categorization run on every request. Rule-based is zero-cost and instant. Comparison data is always available; frontend shows/hides comparison tab. Simpler backend (no conditional paths).
- **Single request/response** — No streaming, no WebSockets. Upload file → wait → receive complete results. Progress indicator is client-side UX only.

**LLM Provider Abstraction (NFR23):**

```typescript
interface LLMProvider {
  categorize(transactions: RawTransaction[]): Promise<CategorizedTransaction[]>;
  generateInsights(data: SpendingSummary): Promise<string[]>;
  chat(messages: ChatMessage[], systemPrompt: string): Promise<string>;
}
```

Gemini implementation primary (`GeminiProvider`), OpenAI as alternative (`OpenAIProvider`). Provider factory reads `LLM_PROVIDER` env var (`gemini` | `openai`, defaults to `gemini`). Swapping providers = implementing this interface. Clean contract, zero coupling to provider specifics outside the implementation.

**LLM Batching Strategy:**
- Batch 20-30 transactions per LLM prompt (~7-10 API calls per upload of ~200 transactions)
- Parallel batch requests to minimize latency
- Structured JSON output with zod validation on each response
- Retry failed batches once, then skip and report partial results (NFR20)
- Cost target: <$0.05 per upload using Gemini 2.5 Flash (NFR21)

### Frontend Architecture

| Decision | Choice | Version | Rationale |
|---|---|---|---|
| **State Management** | React useState + useReducer | — | Single linear flow with 5 states: `idle → uploading → processing → dashboard → error`. No shared state across distant components. useReducer models the state machine cleanly. No external state library needed. |
| **Styling** | Tailwind CSS | 4.x | Utility-first, fast development, widely recognized by evaluators. Produces clean UI with minimal custom CSS. Good fit for solo developer on tight timeline. |
| **Charting** | Recharts | 2.15 | React-native, SVG-based (better accessibility than canvas — screen readers can traverse SVG elements). Composable API, good documentation. Supports data table alternatives naturally. |
| **HTTP Client** | Native fetch | — | Two endpoints (analyze + chat). No need for axios's features (interceptors, progress tracking). Minimal dependencies. |
| **Routing** | None | — | SPA with 3 UI states, not pages. No React Router needed. State machine drives what renders. |
| **Component Architecture** | Functional components + hooks | — | Standard React patterns. No class components, no HOCs. |

**SPA State Machine:**

```
idle → [user uploads file] → uploading → [file sent] → processing → [results received] → dashboard
  ↑                                                                                          |
  └──────────────────── [user clicks "upload new"] ←──────────────────────────────────────────┘

Any state → [error occurs] → error → [user retries] → idle
```

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|---|---|---|
| **Frontend Hosting** | Vercel | Free tier, optimized for React SPAs, automatic HTTPS, preview deployments on PRs. |
| **Backend Hosting** | Railway or Render | Free/cheap tier, easy Node.js deployment, environment variable management, health check monitoring. |
| **CI/CD** | GitHub Actions | Free for public repos. Run lint + type check + tests on PR/push. |
| **Environment Config** | .env (local) + platform env vars (prod) | Required: `GEMINI_API_KEY` (or `OPENAI_API_KEY` if using OpenAI). Optional: `LLM_PROVIDER` (gemini\|openai, default: gemini), `GEMINI_MODEL`, `PORT`, `CORS_ORIGIN`. |
| **Monitoring** | Health check endpoint only | `GET /api/health` — Railway/Render pings it for >95% uptime NFR. No additional monitoring for portfolio project. |
| **Containerization** | None | Direct Node.js deployment. Docker adds complexity with no benefit for a single-service portfolio project. |

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (Vite + Express scaffolding)
2. File parsing layer (papaparse + xlsx + officecrypto-tool + zod schemas)
3. Bank format configs (HDFC CSV, SBI Excel)
4. LLM provider abstraction + Gemini implementation (+ OpenAI alternative)
5. AI categorization engine (batching, validation, merchant matching via prompt)
6. Rule-based categorization engine
7. Data aggregation layer (categories, merchants, summaries)
8. AI insight generation
9. API endpoints (POST /api/analyze, POST /api/chat + error handling)
10. Frontend: upload component + state machine
11. Frontend: dashboard (charts + insights + comparison + chat)
12. Frontend: TransactionTable (statement view with search, sort, filter)
13. Frontend: ChatBox (conversational AI assistant)
14. Sample dataset + comparison mode
15. Deployment (Vercel + Railway/Render)
16. README as design document

**Cross-Component Dependencies:**
- zod schemas are shared between parsing, LLM validation, and API response — define once in a shared types module
- LLMProvider interface is consumed by AI categorizer, insight generator, and chat endpoint
- Both categorization engines (AI + rule-based) must output the same `CategorizedTransaction` type — enforced by shared zod schema
- Merchant matching is handled within the LLM categorization prompt — no separate cache dependency
- Frontend types mirror backend response schemas — can share type definitions across client/server
- ChatBox component depends on dashboard data (SpendingSummary + Transaction[]) for LLM context

## Implementation Patterns & Consistency Rules

### Naming Patterns

**API Naming:**

| Pattern | Convention | Example |
|---|---|---|
| Endpoints | lowercase, plural nouns | `/api/analyze` |
| Query params | camelCase | `?bankFormat=hdfc` |
| JSON response fields | camelCase | `{ processedRows, skippedRows, totalSpend }` |
| Error codes | UPPER_SNAKE_CASE | `UNSUPPORTED_FORMAT`, `FILE_TOO_LARGE` |

**Code Naming:**

| Pattern | Convention | Example |
|---|---|---|
| Files — React components | PascalCase `.tsx` | `SpendingChart.tsx`, `UploadArea.tsx` |
| Files — utilities/services/types | camelCase `.ts` | `llmProvider.ts`, `aggregator.ts` |
| Files — config/data | camelCase `.json` / `.ts` | `bankFormats.ts` |
| Files — tests | co-located `*.test.ts` | `excelParser.test.ts` next to `excelParser.ts` |
| React components | PascalCase | `SpendingChart`, `CategoryBreakdown` |
| Functions | camelCase | `parseTransactions()`, `categorizeWithAI()` |
| Variables/constants | camelCase / UPPER_SNAKE_CASE | `const maxFileSize` / `const MAX_BATCH_SIZE = 30` |
| Types/Interfaces | PascalCase | `Transaction`, `CategorizedTransaction`, `LLMProvider` |
| Enums | PascalCase (members too) | `AppState.Dashboard`, `TransactionType.Debit` |
| Zod schemas | camelCase with `Schema` suffix | `transactionSchema`, `llmResponseSchema` |

### Structure Patterns

**Test Organization:** Co-located — `excelParser.test.ts` next to `excelParser.ts`. No separate `__tests__/` directories.

**Frontend Component Organization (by feature):**

```
client/src/
├── components/
│   ├── upload/           # Upload state components
│   │   ├── UploadArea.tsx
│   │   └── FileValidator.tsx
│   ├── dashboard/        # Dashboard state components
│   │   ├── SpendingChart.tsx
│   │   ├── MerchantList.tsx
│   │   ├── InsightPanel.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── ChatBox.tsx
│   │   ├── TransactionTable.tsx
│   │   └── DashboardTabs.tsx
│   └── common/           # Shared components
│       ├── ErrorMessage.tsx
│       ├── LoadingSpinner.tsx
│       └── DataTable.tsx
├── hooks/                # Custom React hooks
│   └── useAnalysis.ts    # Manages upload + fetch + state transitions
├── services/             # API communication
│   └── api.ts            # Fetch calls: POST /api/analyze, POST /api/chat
├── types/                # TypeScript types (mirrors server types)
│   └── index.ts
└── App.tsx               # Root — renders based on AppState
```

**Server Organization (by concern/layer):**

```
server/src/
├── parsers/              # File parsing layer
│   ├── csvParser.ts      # papaparse wrapper
│   ├── excelParser.ts    # xlsx wrapper
│   ├── bankFormats.ts    # Format detection + config registry
│   └── index.ts          # Unified parseFile() entry point
├── categorizers/         # Rule-based categorization engine
│   ├── types.ts          # Categorizer interface + shared types
│   ├── ruleCategorizer.ts # Keyword-based categorization (FR20)
│   └── index.ts          # Runs categorization, returns results
├── services/             # Business logic services
│   ├── llm/
│   │   ├── types.ts      # LLMProvider interface
│   │   ├── gemini.ts     # Gemini 2.5 Flash implementation (primary)
│   │   ├── openai.ts     # OpenAI implementation (alternative)
│   │   └── index.ts      # Provider factory (reads LLM_PROVIDER env var)
│   ├── insightGenerator.ts # AI insight generation
│   └── aggregator.ts     # Raw transactions → category/merchant summaries
├── schemas/              # Zod schemas (single source of truth)
│   ├── transaction.ts    # Transaction, CategorizedTransaction schemas
│   ├── apiResponse.ts    # Full API response schema
│   └── llmResponse.ts    # LLM JSON output validation schema
├── config/               # Static configuration
│   └── bankFormats/      # Per-bank column mappings
│       ├── hdfc.json
│       └── sbi.json
├── middleware/            # Express middleware
│   ├── errorHandler.ts   # Global error handler
│   ├── fileUpload.ts     # Multer config + file validation
│   └── sanitizer.ts      # Input sanitization (formula stripping)
├── utils/                # Pure utility functions
│   ├── indianCurrency.ts # ₹/Rs./INR parsing, lakhs notation
│   ├── dateParser.ts     # Indian date format detection + parsing
│   └── logger.ts         # Structured logging (no financial data in logs)
└── index.ts              # Express app setup + POST /api/analyze, POST /api/chat, GET /api/health
```

### Format Patterns

| Pattern | Convention |
|---|---|
| **API response** | Direct response object (no wrapper). Top-level fields: `transactions`, `categories`, `merchants`, `insights`, `comparison`, `meta`. |
| **Date format in JSON** | ISO 8601 strings (`"2026-03-08"`). Parsed from Indian formats server-side, always returned as ISO. |
| **Null handling** | `null` for intentionally absent values in JSON responses. `undefined` for optional TypeScript properties in code. |
| **JSON field naming** | camelCase throughout. |

### Process Patterns

**Error Handling by Layer:**

| Layer | Pattern |
|---|---|
| Express global | Error handler middleware catches all unhandled errors → returns `{ error: { code, message } }` |
| Parser errors | Throw typed errors (`ParseError`, `UnsupportedFormatError`). Skip bad rows, report counts. Never crash. |
| LLM errors | Retry once per failed batch. If retry fails, skip batch, mark as `"Uncategorized"`. Report partial results. |
| Frontend errors | React error boundary at app root. Display error state with retry action. Never blank screen. |
| Validation errors | zod `.safeParse()` everywhere — never `.parse()`. Handle validation failures explicitly. |

**Frontend State Machine (Discriminated Union):**

```typescript
type AppState =
  | { status: 'idle' }
  | { status: 'uploading'; fileName: string }
  | { status: 'processing'; fileName: string; message: string }
  | { status: 'dashboard'; data: AnalysisResult }
  | { status: 'error'; error: { code: string; message: string }; retry: () => void };
```

Each state carries exactly the data it needs. No optional fields. No `isLoading` booleans.

**Import Convention:** Relative imports only. No path aliases, no tsconfig path mappings.

### Enforcement Guidelines

**All AI Agents MUST:**

1. Use zod `.safeParse()` for all external data validation (never `.parse()`)
2. Follow file naming conventions (PascalCase for components, camelCase for everything else)
3. Co-locate tests with source files (no `__tests__/` directories)
4. Return standardized error format `{ error: { code, message } }` from the API
5. Use the discriminated union `AppState` type for all frontend state management
6. Never log, store, or persist financial transaction data anywhere
7. Use ISO 8601 date strings in all JSON payloads
8. Use camelCase for JSON field names
9. Export from `index.ts` barrel files at each directory level
10. Handle errors explicitly — never swallow errors silently

**Anti-Patterns to Avoid:**

- `any` type usage — use `unknown` and narrow with zod
- `try/catch` that swallows errors without reporting
- Direct `console.log` — use the `logger` utility
- Inline magic numbers — use named constants
- Mixing PascalCase and camelCase file names for non-component files

## Project Structure & Boundaries

### Complete Project Directory Structure

```
expense-intelligence/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions: lint + type-check + test
├── client/                           # React SPA (Vite)
│   ├── public/
│   │   ├── sample-data.csv           # Pre-built sample dataset for demo (FR41)
│   │   └── sample-data.xlsx          # Excel sample dataset to demo Excel parser (FR41)
│   ├── src/
│   │   ├── components/
│   │   │   ├── upload/
│   │   │   │   ├── UploadArea.tsx         # Drag-and-drop file upload (FR1)
│   │   │   │   ├── UploadArea.test.tsx
│   │   │   │   ├── FileValidator.tsx      # Client-side file type/size checks (FR2, FR5)
│   │   │   │   └── PrivacyNotice.tsx      # Data privacy transparency note (FR38)
│   │   │   ├── dashboard/
│   │   │   │   ├── SpendingChart.tsx       # Category donut/pie chart (FR23)
│   │   │   │   ├── SpendingChart.test.tsx
│   │   │   │   ├── CategoryBarChart.tsx   # Category bar chart (FR25)
│   │   │   │   ├── MerchantList.tsx       # Top 10 merchants by spend (FR24)
│   │   │   │   ├── SpendingSummary.tsx    # Money In (Credits) / Money Out (Debits) / Balance with helper text (FR26)
│   │   │   │   ├── InsightPanel.tsx       # AI-generated insights display (FR29-FR34)
│   │   │   │   ├── ComparisonTable.tsx    # AI vs rule-based side-by-side (FR21, FR28)
│   │   │   │   ├── ComparisonTable.test.tsx
│   │   │   │   ├── DashboardTabs.tsx      # 3 tabs (Overview, Statement, AI vs Rules) + month filter dropdown (FR28)
│   │   │   │   ├── ChatBox.tsx            # Floating chat bubble — conversational AI with spending context
│   │   │   │   └── TransactionTable.tsx   # Statement view: search, sort, type filter, daily groupings
│   │   │   └── common/
│   │   │       ├── ErrorMessage.tsx       # Actionable error display (FR37)
│   │   │       ├── LoadingSpinner.tsx     # Processing progress indicator (FR35)
│   │   │       ├── DataTable.tsx          # Accessible table alternative for charts (FR27)
│   │   │       └── Disclaimer.tsx         # Financial disclaimer footer (FR39)
│   │   ├── hooks/
│   │   │   ├── useAnalysis.ts             # Upload + fetch + state machine orchestration
│   │   │   └── useAnalysis.test.ts
│   │   ├── services/
│   │   │   └── api.ts                     # POST /api/analyze + POST /api/chat fetch wrappers
│   │   ├── types/
│   │   │   └── index.ts                   # Frontend types (mirrors server response schemas)
│   │   ├── App.tsx                        # Root component — renders based on AppState
│   │   ├── App.test.tsx
│   │   ├── main.tsx                       # Vite entry point
│   │   └── index.css                      # Tailwind CSS imports + base styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json                  # Tailwind 4.x uses CSS-first config via @tailwindcss/vite plugin (no tailwind.config.ts)
│   ├── eslint.config.js
│   └── package.json
├── server/                               # Express API
│   ├── src/
│   │   ├── parsers/
│   │   │   ├── csvParser.ts               # papaparse wrapper (FR8)
│   │   │   ├── csvParser.test.ts
│   │   │   ├── excelParser.ts             # Async xlsx wrapper: officecrypto-tool decryption, smart header detection (scans 20 rows), headerIndexMap for merged-cell alignment (FR7)
│   │   │   ├── excelParser.test.ts
│   │   │   ├── bankFormats.ts             # Format detection + config registry + 4-pass fuzzy findColumnValue() (FR4)
│   │   │   ├── bankFormats.test.ts
│   │   │   └── index.ts                   # Unified parseFile() — encoding, validation, routing
│   │   ├── categorizers/
│   │   │   ├── types.ts                   # Categorizer interface (shared contract)
│   │   │   ├── ruleCategorizer.ts         # Keyword-based categorization (FR20)
│   │   │   ├── ruleCategorizer.test.ts
│   │   │   └── index.ts                   # Runs categorization, returns results
│   │   ├── services/
│   │   │   ├── llm/
│   │   │   │   ├── types.ts               # LLMProvider interface (NFR23)
│   │   │   │   ├── gemini.ts              # Gemini 2.5 Flash implementation (primary)
│   │   │   │   ├── openai.ts              # OpenAI implementation (alternative)
│   │   │   │   ├── openai.test.ts
│   │   │   │   └── index.ts               # Provider factory (reads LLM_PROVIDER env var)
│   │   │   ├── insightGenerator.ts        # AI insight generation (FR29-FR34)
│   │   │   ├── insightGenerator.test.ts
│   │   │   └── aggregator.ts              # Transactions → category/merchant summaries
│   │   ├── schemas/
│   │   │   ├── transaction.ts             # Transaction, CategorizedTransaction schemas
│   │   │   ├── apiResponse.ts             # Full API response schema
│   │   │   └── llmResponse.ts             # LLM JSON output validation
│   │   ├── config/
│   │   │   └── bankFormats/
│   │   │       ├── hdfc.json              # HDFC CSV column mapping (FR8)
│   │   │       └── sbi.json               # SBI Excel column mapping (FR7)
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts            # Global error handler → { error: { code, message } }
│   │   │   ├── fileUpload.ts              # Multer config + file type/size validation (FR1-FR6)
│   │   │   └── sanitizer.ts               # Formula injection stripping (NFR11)
│   │   ├── utils/
│   │   │   ├── indianCurrency.ts          # ₹/Rs./INR parsing, lakhs notation (FR10)
│   │   │   ├── indianCurrency.test.ts
│   │   │   ├── dateParser.ts              # Indian date format detection (FR9)
│   │   │   ├── dateParser.test.ts
│   │   │   └── logger.ts                  # Structured logging (no financial data)
│   │   └── index.ts                       # Express app: POST /api/analyze, POST /api/chat, GET /api/health
│   ├── tsconfig.json
│   ├── .env.example                       # GEMINI_API_KEY, OPENAI_API_KEY, LLM_PROVIDER, GEMINI_MODEL, PORT, CORS_ORIGIN
│   └── package.json
├── .gitignore
├── .env.example                           # Root-level env template
├── README.md                              # Design document (architecture, decisions, accuracy)
└── package.json                           # Root: workspace scripts (dev, build, test)
```

### Requirements to Structure Mapping

| FR Category | Primary Location | Key Files |
|---|---|---|
| **File Upload & Validation (FR1-FR6)** | `server/src/middleware/`, `client/src/components/upload/` | `fileUpload.ts`, `sanitizer.ts`, `UploadArea.tsx`, `FileValidator.tsx` |
| **Transaction Parsing (FR7-FR13)** | `server/src/parsers/`, `server/src/utils/` | `csvParser.ts`, `excelParser.ts`, `bankFormats.ts`, `indianCurrency.ts`, `dateParser.ts` |
| **AI Categorization (FR14-FR19)** | `server/src/services/llm/` | `llm/gemini.ts` (primary), `llm/openai.ts` (alternative), `llm/types.ts` (AI categorization via LLM prompt) |
| **Rule-Based Comparison (FR20-FR22)** | `server/src/categorizers/` | `ruleCategorizer.ts`, `index.ts` |
| **Spending Dashboard (FR23-FR28)** | `client/src/components/dashboard/` | `SpendingChart.tsx`, `CategoryBarChart.tsx`, `MerchantList.tsx`, `SpendingSummary.tsx`, `DashboardTabs.tsx`, `TransactionTable.tsx`, `ChatBox.tsx` |
| **AI Insights (FR29-FR34)** | `server/src/services/`, `client/src/components/dashboard/` | `insightGenerator.ts`, `InsightPanel.tsx` |
| **Processing & Feedback (FR35-FR37)** | `client/src/components/common/`, `client/src/hooks/` | `LoadingSpinner.tsx`, `ErrorMessage.tsx`, `useAnalysis.ts` |
| **Privacy & Compliance (FR38-FR40)** | `client/src/components/` | `PrivacyNotice.tsx`, `Disclaimer.tsx` |
| **Demo & Portfolio (FR41-FR42)** | `client/public/`, root | `sample-data.csv`, `sample-data.xlsx`, `README.md` |
| **AI Conversational Chat (FR43-FR44)** | `server/src/services/llm/`, `client/src/components/dashboard/` | `llm/types.ts` (chat method), `ChatBox.tsx`, `api.ts` (`POST /api/chat`) |
| **Transaction Statement View (FR45)** | `client/src/components/dashboard/` | `TransactionTable.tsx` |
| **Month Filter (FR46)** | `client/src/components/dashboard/` | `DashboardTabs.tsx` |
| **File Parsing Enhancements (FR47-FR49)** | `server/src/parsers/` | `excelParser.ts` (decryption + smart header detection), `bankFormats.ts` (4-pass fuzzy matching) |

### Architectural Boundaries

**API Boundary (HTTP):**

```
Client ↔→ Server: HTTP boundary
  POST /api/analyze (multipart/form-data → JSON response)
  POST /api/chat    (JSON → JSON response)
  GET  /api/health  (→ 200 OK)

Server ↔→ LLM Provider (Gemini/OpenAI): External API boundary
  LLMProvider interface abstracts all communication
  Batched requests (analyze), single requests (chat), retry logic, response validation
```

**Component Boundaries:**

| Boundary | Communication | Contract |
|---|---|---|
| **Client ↔ Server** | HTTP POST (fetch) | Zod-validated `AnalysisResult` response type (analyze), `ChatResponse` (chat) |
| **Server ↔ LLM Provider** | HTTPS REST | `LLMProvider` interface (categorize, generateInsights, chat) + zod-validated JSON response |
| **Parsers ↔ Categorizers** | Function call (in-process) | `RawTransaction[]` output → input |
| **Categorizers ↔ Aggregator** | Function call (in-process) | `CategorizedTransaction[]` → `CategorySummary[]` + `MerchantSummary[]` |

### Data Flow

```
[User uploads file]
       │
       ▼
┌─────────────────┐
│  fileUpload.ts   │ ← Multer: file type/size validation
│  sanitizer.ts    │ ← Formula injection stripping
└────────┬────────┘
         ▼
┌─────────────────┐
│  parsers/        │ ← bankFormats.ts detects bank (HDFC/SBI)
│  csvParser.ts    │ ← papaparse: parse CSV with encoding detection
│  excelParser.ts  │ ← xlsx: parse Excel workbook
│  dateParser.ts   │ ← Indian date format normalization
│  indianCurrency  │ ← ₹/lakhs/Rs. amount normalization
└────────┬────────┘
         │ RawTransaction[]
         ▼
┌─────────────────────────────────┐
│  categorizers/                   │
│  ├── llm/gemini.ts              │ ← LLM batches (AI categorization + merchant matching)
│  └── ruleCategorizer.ts         │ ← Keyword matching (all transactions)
└────────┬────────────────────────┘
         │ CategorizedTransaction[] (AI + rule-based)
         ▼
┌─────────────────┐
│  aggregator.ts   │ ← Summarize by category, merchant, totals
└────────┬────────┘
         │ CategorySummary[] + MerchantSummary[]
         ▼
┌─────────────────────┐
│  insightGenerator.ts │ ← LLM generates 3-5 plain-language insights
└────────┬────────────┘
         │ string[]
         ▼
┌─────────────────┐
│  API Response     │ ← Assemble full AnalysisResult, validate with zod
└────────┬────────┘
         │ JSON response
         ▼
[Client renders dashboard]
```

**Chat Flow (second path):**

```
[User sends chat message]
       │
       ▼
┌─────────────────┐
│  POST /api/chat   │ ← Receives messages + summary + transactions
└────────┴────────┘
         ▼
┌───────────────────┐
│  LLMProvider.chat  │ ← Gemini/OpenAI with system prompt containing
│                    │   individual transaction data + spending summary
└────────┴──────────┘
         │ string (natural language response)
         ▼
[Client displays in ChatBox]
```

### Development Workflow

| Workflow | Command | Notes |
|---|---|---|
| **Dev (frontend)** | `cd client && npm run dev` | Vite HMR on `localhost:5173` |
| **Dev (backend)** | `cd server && npx tsx watch src/index.ts` | Auto-restart on changes |
| **Dev (both)** | Root: `npm run dev` | Runs both concurrently |
| **Test** | `npm test` | Vitest for both client and server |
| **Lint** | `npm run lint` | ESLint across both packages |
| **Type check** | `npm run typecheck` | `tsc --noEmit` for both packages |
| **Build** | `npm run build` | Vite build (client) + tsc compile (server) |

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- TypeScript 5.6 works across React 19 (Vite), Express 5, Vitest 2.1.9, and zod — no conflicts
- Recharts 2.15 is React-native — aligns with React 19
- Tailwind CSS 4.x works with Vite — native PostCSS integration
- papaparse + xlsx + officecrypto-tool all work server-side in Node.js
- @google/generative-ai (Gemini) and OpenAI SDKs work with TypeScript and Node.js

**Pattern Consistency:**
- camelCase JSON fields ↔ camelCase TypeScript properties — aligned
- PascalCase components ↔ PascalCase `.tsx` files — aligned
- Co-located tests throughout client and server — consistent
- zod `.safeParse()` rule applied uniformly for all external data

**Structure Alignment:**
- `server/src/services/llm/types.ts` houses the LLMProvider interface (NFR23)
- `server/src/services/llm/gemini.ts` is the primary provider implementation
- `server/src/categorizers/` contains the rule-based engine; AI categorization lives in `services/llm/`
- `server/src/schemas/` centralizes zod schemas as single source of truth
- `server/src/config/bankFormats/` enables config-driven bank support

### Requirements Coverage Validation ✅

**Functional Requirements (49/49 covered):**

| FR Range | Category | Architectural Support |
|---|---|---|
| FR1-FR6 | Upload & Validation | `middleware/fileUpload.ts` + `sanitizer.ts` + `UploadArea.tsx` + `FileValidator.tsx` |
| FR7-FR13 | Parsing | `parsers/` module + `utils/indianCurrency.ts` + `utils/dateParser.ts` + bank format configs |
| FR14-FR19 | AI Categorization | `services/llm/gemini.ts` (primary) + `services/llm/openai.ts` (alternative) + batching strategy + merchant matching via LLM prompt |
| FR20-FR22 | Rule-Based Comparison | `categorizers/ruleCategorizer.ts` + shared interface + always-run-both design |
| FR23-FR28 | Dashboard | `components/dashboard/` (5 components) + `DataTable.tsx` + `DashboardTabs.tsx` |
| FR29-FR34 | AI Insights | `services/insightGenerator.ts` + `InsightPanel.tsx` |
| FR35-FR37 | Processing & Feedback | `useAnalysis.ts` hook + `LoadingSpinner.tsx` + `ErrorMessage.tsx` + discriminated union state |
| FR38-FR40 | Privacy | `PrivacyNotice.tsx` + `Disclaimer.tsx` + stateless backend |
| FR41-FR42 | Demo | `sample-data.csv` + `sample-data.xlsx` + Vercel/Railway deployment |
| FR43-FR44 | AI Conversational Chat | `services/llm/` (chat method) + `ChatBox.tsx` + `POST /api/chat` |
| FR45 | Transaction Statement View | `TransactionTable.tsx` — search, sort, type filter, daily groupings |
| FR46 | Month Filter | `DashboardTabs.tsx` — month dropdown filtering across all dashboard views |
| FR47-FR49 | File Parsing Enhancements | `excelParser.ts` (async + officecrypto-tool decryption + smart header scan) + `bankFormats.ts` (4-pass fuzzy matching) |

**Non-Functional Requirements (23/23 covered):**

| NFR Range | Category | Architectural Support |
|---|---|---|
| NFR1-NFR6 | Performance | Vite (fast builds/LCP), LLM batching (7-10 calls), <30s pipeline design |
| NFR7-NFR11 | Security | HTTPS, zero persistence, formula stripping, single-origin CORS, env vars |
| NFR12-NFR16 | Accessibility | Recharts (SVG-based), `DataTable.tsx` for chart alternatives, Tailwind contrast utilities |
| NFR17-NFR19 | Reliability | Health check endpoint, graceful LLM failure, partial result resilience |
| NFR20-NFR23 | External Integration | LLMProvider interface, retry-once, zod response validation, provider independence |

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical decisions documented with specific versions. Implementation patterns are comprehensive with concrete examples.

**Structure Completeness:** ~70 files mapped across client and server. Every FR category maps to specific files and directories.

**Pattern Completeness:** All naming, structure, format, and process patterns defined with examples and anti-patterns.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps (non-blocking):**
1. Multer configuration specifics (5MB limit, MIME types) — implementation detail, architecture specifies the constraint
2. Sample dataset needs manually verified category labels for accuracy benchmarking — data creation task, not architectural
3. Client/server type duplication — intentional trade-off (avoids monorepo build complexity)

**Nice-to-Have:**
- `.nvmrc` or `.node-version` file to pin Node.js version

### Architecture Completeness Checklist

**Requirements Analysis:**
- [x] Project context thoroughly analyzed (49 FRs, 23 NFRs)
- [x] Scale and complexity assessed (Medium)
- [x] Technical constraints identified (stateless, solo dev, LLM dependency)
- [x] Cross-cutting concerns mapped (6 concerns)

**Architectural Decisions:**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined (LLMProvider interface, API contract, data flow)
- [x] Performance considerations addressed (batching, parallel requests, progress UX)

**Implementation Patterns:**
- [x] Naming conventions established (API, code, files, schemas)
- [x] Structure patterns defined (by-feature frontend, by-concern backend)
- [x] Communication patterns specified (HTTP boundary, in-process function calls)
- [x] Process patterns documented (error handling by layer, discriminated union state)

**Project Structure:**
- [x] Complete directory structure defined (~70 files mapped)
- [x] Component boundaries established (5 boundaries documented)
- [x] Integration points mapped (Client↔Server, Server↔OpenAI)
- [x] Requirements to structure mapping complete (13 FR categories → specific files)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- 100% requirement coverage — every FR and NFR has an architectural home
- Right-sized — no over-engineering, no unnecessary abstractions
- Clear data flow — single pipeline, obvious from file upload to dashboard render
- LLM provider abstraction — swappable without architectural changes
- Extensible bank support — config-driven, adding banks doesn't require code changes
- Consistent patterns — AI agents have unambiguous guidance on naming, structure, and error handling

**Areas for Future Enhancement (Post-MVP):**
- Shared type package if client/server types diverge
- Multi-month data comparison (requires state beyond single request)
- PDF parsing pipeline (OCR layer not yet architected)
- Custom category support (requires user preference storage)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**

```bash
# 1. Create project root
mkdir expense-intelligence && cd expense-intelligence

# 2. Frontend (Vite + React + TypeScript)
npm create vite@latest client -- --template react-ts
cd client
npm install recharts
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
cd ..

# 3. Backend (Express + TypeScript)
mkdir server && cd server
npm init -y
npm install express cors dotenv multer @google/generative-ai openai papaparse xlsx officecrypto-tool zod
npm install -D typescript @types/express @types/cors @types/node @types/multer @types/papaparse tsx vitest
npx tsc --init
cd ..

# 4. Root (workspace scripts)
npm init -y
npm install -D concurrently
```
