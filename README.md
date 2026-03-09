# Expense Intelligence

**AI-Powered Bank Statement Analyzer** — Upload your Indian bank statement and get instant spending insights, smart categorization, and an AI chat assistant.

**[Live Demo](https://expense-intelligence-eight.vercel.app)** · **[GitHub](https://github.com/princelevin/expense-intelligence)**

---

## Features

- **Smart Parsing** — Supports SBI and HDFC Excel/CSV bank statements with automatic bank detection, header discovery, and password-protected file handling
- **AI Categorization** — Google Gemini classifies transactions into 16 categories (Food & Dining, Shopping, Transport, Bills, etc.) with confidence scores
- **Rule-Based Fallback** — Keyword-based categorizer runs in parallel for comparison via the "AI vs Rules" tab
- **Spending Dashboard** — Interactive donut chart, bar chart for top categories, monthly filtering, and summary cards (Money In / Money Out / Net Balance)
- **AI Chat Assistant** — Ask natural language questions about your spending ("How much did I spend on food?", "What are my top merchants?")
- **Privacy First** — Files are processed in memory only; nothing is stored on disk, in databases, or cookies

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, Recharts 3 |
| Backend | Express 5, TypeScript, Node.js |
| AI | Google Gemini 2.5 Flash |
| Parsing | SheetJS (xlsx), PapaParse (CSV), officecrypto-tool (decryption) |
| Validation | Zod 4 |
| Testing | Vitest, React Testing Library |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
┌─────────────────────────┐     ┌─────────────────────────────────┐
│   React SPA (Vercel)    │     │   Express API (Render)          │
│                         │     │                                 │
│  UploadArea             │────▶│  POST /api/analyze              │
│  ├─ Password input      │     │  ├─ Parse (Excel/CSV)           │
│  └─ Drag & drop         │     │  ├─ Detect bank format          │
│                         │     │  ├─ AI categorize (Gemini)      │
│  Dashboard              │◀────│  ├─ Rule categorize             │
│  ├─ Summary cards       │     │  ├─ Aggregate                   │
│  ├─ SpendingChart       │     │  └─ Generate insights           │
│  ├─ CategoryBar         │     │                                 │
│  ├─ TransactionTable    │     │  POST /api/chat                 │
│  └─ ComparisonView      │     │  └─ Gemini chat with context    │
│                         │     │                                 │
│  ChatBox ───────────────│────▶│  GET /api/health                │
└─────────────────────────┘     └─────────────────────────────────┘
```

## Project Structure

```
expense-intelligence/
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── upload/        # UploadArea (drag-drop, password)
│       │   ├── dashboard/     # Charts, tables, chat, comparison
│       │   └── common/        # Header, ErrorBoundary
│       ├── hooks/             # useAnalysis (state management)
│       ├── services/          # API client
│       └── types/             # TypeScript interfaces
├── server/                    # Express backend
│   └── src/
│       ├── parsers/           # Excel/CSV parsing, bank format detection
│       ├── categorizers/      # Rule-based keyword categorizer
│       ├── services/
│       │   └── llm/           # Gemini & OpenAI providers
│       ├── schemas/           # Zod validation schemas
│       ├── middleware/        # File upload, error handling
│       └── utils/             # Logger
├── render.yaml                # Render deployment blueprint
└── vercel.json                # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

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
# Edit server/.env and add your GEMINI_API_KEY

# Start development servers
npm run dev
```

The app will be available at http://localhost:5173 with the API at http://localhost:3001.

### Environment Variables

**Server** (`server/.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | *required* |
| `LLM_PROVIDER` | `gemini` or `openai` | `gemini` |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.5-flash` |
| `PORT` | Server port | `3001` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

**Client** (Vercel env or `.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend URL (production only) | *uses proxy in dev* |

## Supported Banks

| Bank | Formats | Notes |
|------|---------|-------|
| SBI (State Bank of India) | `.xls`, `.xlsx` | Often password-protected (DOB in DDMMYYYY) |
| HDFC Bank | `.csv`, `.xls`, `.xlsx` | Standard format |

The parser auto-detects bank format by matching column headers. New bank formats can be added in `server/src/parsers/bankFormats.ts`.

## Deployment

The app is deployed as two services:

- **Frontend** → [Vercel](https://vercel.com) — Set root directory to `client`, add `VITE_API_URL` env var pointing to backend
- **Backend** → [Render](https://render.com) — Uses `render.yaml` blueprint, add `GEMINI_API_KEY` and `CORS_ORIGIN` env vars

## License

MIT
