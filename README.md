# Expense Intelligence

**AI-Powered Bank Statement Analyzer** — Upload your Indian bank statement and get instant spending insights, smart categorization, and an AI chat assistant.

**[Live Demo](https://expense-intelligence-eight.vercel.app)** · **[GitHub](https://github.com/princelevin/expense-intelligence)**

---

## Features

- **Smart Parsing** — Supports SBI and HDFC bank statements (Excel and CSV) with automatic bank detection, header discovery, and password-protected file handling with bank-specific password hints
- **AI Categorization** — Azure OpenAI gpt-4o-mini classifies transactions into 16 categories (Food & Dining, Shopping, Transport, Bills, etc.) with confidence scores. Gemini 2.5 Flash serves as an automatic fallback via a FallbackProvider pattern
- **Rule-Based Comparison** — Keyword-based categorizer runs in parallel, with an "AI vs Rules" comparison tab showing match rate, agreements, and disagreements side by side
- **Spending Dashboard** — Interactive donut chart, bar chart for top categories, month filter, summary cards (Money In / Money Out / Net Cash Flow), and a Top Spending merchants section
- **AI Insights** — 3–5 plain-language insights generated from your actual spending data (e.g., "Food delivery was your #1 expense at ₹12,400 — 14% of your income")
- **AI Chat Assistant** — Ask natural language questions about your spending ("How much did I spend on Zomato?", "What's my average daily spending?") with context-aware answers based on your transactions
- **Privacy First** — Stateless architecture: files are processed in memory only, nothing is stored on disk, in databases, or cookies
- **Performance** — Concurrent batch processing (3 batches in parallel) categorizes ~200 transactions in about 15 seconds
- **Reliability** — FallbackProvider automatically switches from Azure OpenAI to Gemini if the primary provider errors out

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, Recharts 3 |
| Backend | Express 5, TypeScript, Node.js |
| AI (Primary) | Azure OpenAI gpt-4o-mini |
| AI (Fallback) | Google Gemini 2.5 Flash |
| Parsing | SheetJS (xlsx), PapaParse (CSV), officecrypto-tool (encrypted Excel decryption) |
| Validation | Zod 4 |
| Testing | Vitest, React Testing Library |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
┌─────────────────────────┐     ┌──────────────────────────────────────┐
│   React SPA (Vercel)    │     │   Express API (Render)               │
│                         │     │                                      │
│  UploadArea             │────▶│  POST /api/analyze                   │
│  ├─ Drag & drop         │     │  ├─ Parse (Excel/CSV + decryption)   │
│  ├─ Password input      │     │  ├─ Detect bank format (SBI/HDFC)    │
│  │  └─ 👁️ toggle + hints│     │  ├─ AI categorize (FallbackProvider) │
│  └─ Bank auto-detection │     │  │   ├─ Primary: Azure OpenAI        │
│                         │     │  │   └─ Fallback: Gemini              │
│  Dashboard              │◀────│  ├─ Rule categorize (keywords)       │
│  ├─ Money In/Out/Flow   │     │  ├─ Aggregate & compare              │
│  ├─ SpendingChart        │     │  └─ Generate AI insights             │
│  ├─ Top Spending         │     │                                      │
│  ├─ Month Filter         │     │  POST /api/chat                      │
│  ├─ TransactionTable     │     │  └─ Context-aware AI chat            │
│  ├─ AI vs Rules Compare  │     │                                      │
│  └─ AI Insights          │     │  GET /api/health                     │
│                         │     │                                      │
│  ChatBox ───────────────│────▶│  FallbackProvider                    │
│                         │     │  ├─ Azure OpenAI (primary)           │
│                         │     │  └─ Gemini (automatic fallback)      │
└─────────────────────────┘     └──────────────────────────────────────┘
```

## Project Structure

```
expense-intelligence/
├── _bmad/                     # BMAD planning framework (agents, workflows)
├── _bmad-output/              # Planning artifacts
│   └── planning-artifacts/
│       ├── product-brief.md   # Problem, personas, MVP scope
│       ├── prd.md             # 44 FRs, 23 NFRs, 4 user journeys
│       └── architecture.md    # Tech decisions, 70+ files mapped
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── upload/        # UploadArea (drag-drop, password, hints)
│       │   ├── dashboard/     # Charts, tables, chat, comparison, insights
│       │   └── common/        # Header, Disclaimer, PrivacyNotice
│       ├── hooks/             # useAnalysis (state management)
│       ├── services/          # API client
│       └── types/             # TypeScript interfaces
├── server/                    # Express backend
│   └── src/
│       ├── parsers/           # Excel/CSV parsing, bank format detection
│       ├── categorizers/      # Rule-based keyword categorizer
│       ├── services/
│       │   └── llm/           # Azure OpenAI, Gemini, FallbackProvider
│       ├── schemas/           # Zod validation schemas
│       ├── middleware/        # File upload (multer), error handling
│       └── utils/             # Logger
├── render.yaml                # Render deployment blueprint
└── vercel.json                # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 18+
- An [Azure OpenAI resource](https://portal.azure.com) with a gpt-4o-mini deployment, **or** a [Google Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
# Clone the repo
git clone https://github.com/princelevin/expense-intelligence.git
cd expense-intelligence

# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Configure environment
cp server/.env.example server/.env
# Edit server/.env — see Environment Variables below

# Start development servers
npm run dev
```

The app will be available at http://localhost:5173 with the API at http://localhost:3001.

### Environment Variables

**Server** (`server/.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_PROVIDER` | `azure-openai`, `openai`, or `gemini` | `gemini` |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource endpoint | — |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | — |
| `AZURE_OPENAI_DEPLOYMENT` | Azure OpenAI deployment name | `gpt-4o-mini` |
| `AZURE_OPENAI_API_VERSION` | Azure OpenAI API version | `2024-08-01-preview` |
| `GEMINI_API_KEY` | Google Gemini API key (primary or fallback) | — |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.5-flash` |
| `OPENAI_API_KEY` | OpenAI API key (if using `openai` provider) | — |
| `PORT` | Server port | `3001` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

> **Recommended setup:** Set `LLM_PROVIDER=azure-openai` with Azure credentials, and also set `GEMINI_API_KEY` for automatic fallback.

**Client** (Vercel env or `.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend URL (production only) | *uses proxy in dev* |

## Supported Banks

| Bank | Formats | Notes |
|------|---------|-------|
| SBI (State Bank of India) | `.xls`, `.xlsx` | Password-protected (first 5 letters of name uppercase + DOB in DDMMYYYY) |
| HDFC Bank | `.csv`, `.xls`, `.xlsx` | Standard format (Customer ID as password if protected) |

The parser auto-detects bank format by matching column headers. New bank formats can be added in `server/src/parsers/bankFormats.ts`.

## Categories

The AI categorizes transactions into 16 categories:

| Category | Examples |
|----------|---------|
| Food & Dining | Swiggy, Zomato, Zepto, BigBasket, Blinkit, restaurants |
| Shopping | Amazon, Flipkart, Myntra, Nykaa, Meesho, Decathlon |
| Transport | Uber, Ola, Rapido, IRCTC, RedBus, petrol |
| Bills & Utilities | Jio, Airtel, electricity, broadband, recharge |
| Entertainment | Netflix, Spotify, Disney+ Hotstar, BookMyShow |
| Health & Medical | Apollo, PharmEasy, hospitals, diagnostics |
| Education | Udemy, Coursera, college fees, books |
| Rent & Housing | Rent, maintenance, housing society |
| Insurance | LIC, HDFC Life, policy premiums |
| Investments | Zerodha, Groww, mutual funds, SIP |
| Transfer | UPI to individuals, NEFT, IMPS, fund transfers |
| ATM Withdrawal | Cash withdrawals |
| EMI & Loans | EMI payments, Bajaj Finserv, personal loans |
| Salary | Salary credits, payroll |
| Refund | Transaction refunds |
| Uncategorized | Unrecognized transactions (last resort) |

## Planning Artifacts

This project was built using the BMAD method — a structured AI-assisted SDLC workflow. The planning documents are included in the repo:

- **Product Brief** (`_bmad-output/planning-artifacts/`) — Problem statement, 3 user personas, MVP scope
- **PRD** — 44 functional requirements, 23 non-functional requirements, 4 user journeys
- **Architecture Document** — Tech stack decisions, 70+ files mapped, data flow, requirement traceability (44/44 FRs, 23/23 NFRs covered)

## Deployment

The app is deployed as two services:

- **Frontend** → [Vercel](https://vercel.com) — Root directory: `client`, add `VITE_API_URL` env var pointing to backend
- **Backend** → [Render](https://render.com) — Uses `render.yaml` blueprint, configure Azure OpenAI and Gemini env vars in Render dashboard

## License

MIT
