# 🐍 HydraSkript — AI-Powered Novel Writing Platform

> **Write with your voice. Amplified by AI.**

HydraSkript is a full-stack AI writing platform that lets authors train a personal AI writing style, generate chapters with continuity awareness, and produce audiobook (M4B) exports — all powered by open-source and affordable AI models (OpenRouter, Google AI Studio, Ollama). No OpenAI or Anthropic keys required.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Style Training** | Upload 3-10 writing samples → the system extracts your voice DNA (sentence patterns, vocabulary, pacing) and stores it as a reusable style profile |
| **Chapter Generation** | AI drafts chapters that match your trained style, respecting your universe's characters, timeline, and lore |
| **Continuity Guard** | Automatic cross-chapter consistency checks — catches timeline contradictions, character trait drift, and plot holes |
| **Audiobook Export** | Generate TTS audio per chapter (Google Gemini TTS) and bundle into M4B audiobook format |
| **Credit System** | Fair usage credits — only deducted on successful job completion, auto-refunded on failure |
| **Universe Bible** | Maintain characters, locations, timeline events, and lore entries that the AI references during generation |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, React 19) |
| **Styling** | Tailwind CSS 4 (dark theme — black bg, purple-cyan gradients) |
| **Database** | Supabase PostgreSQL + pgvector (embeddings) |
| **Auth** | Supabase Auth (email/magic link) |
| **AI Models** | OpenRouter (Qwen, Llama, etc.) · Google AI Studio (Gemini) · Ollama (local) |
| **Embeddings** | Google AI `text-embedding-004` API |
| **Queue/Workers** | BullMQ + Redis (for long-running generation jobs) |
| **Storage** | Cloudflare R2 (S3-compatible, for audiobook files & assets) |
| **Payments** | Stripe Connect |
| **State Mgmt** | Zustand (client stores for jobs, credits, universes, styles) |
| **ORM** | Prisma |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (hero + features + CTA)
│   ├── layout.tsx                # Root layout with nav
│   ├── globals.css               # Brand colors & Tailwind config
│   ├── dashboard/page.tsx        # Author dashboard
│   ├── books/page.tsx            # Book/chapter management
│   ├── styles/page.tsx           # Style profiles list
│   ├── styles/new/page.tsx       # Upload samples → train new style
│   ├── credits/page.tsx          # Credit balance & transactions
│   ├── onboarding/page.tsx       # First-time setup wizard
│   └── api/                      # API routes
│       ├── auth/                 # Supabase auth callback
│       ├── chapters/             # CRUD + AI generation + revisions
│       ├── styles/               # Style CRUD + training + validation
│       ├── universes/            # Universe CRUD + timeline
│       ├── jobs/                 # Background job status polling
│       ├── me/                   # User profile, credits, metrics
│       ├── onboarding/           # Onboarding flow endpoints
│       └── continuity-issues/    # Continuity fix application
├── lib/
│   ├── ai/
│   │   ├── openRouterClient.ts   # OpenRouter API (chat, streaming, structured output)
│   │   └── googleAiStudioClient.ts # Google AI (chat, TTS audio generation)
│   ├── database/
│   │   └── rlsHelpers.ts         # Supabase admin/user clients + RLS policy SQL
│   ├── services/
│   │   ├── styleTrainingService.ts
│   │   ├── chapterGenerationService.ts
│   │   ├── continuityService.ts
│   │   ├── audiobookService.ts
│   │   └── vectorUtils.ts        # Re-export of embedding utils
│   ├── utils/
│   │   └── vectorUtils.ts        # Google AI embeddings + pgvector search
│   └── auth/
│       └── getUser.ts            # Supabase auth helper for route handlers
├── stores/                       # Zustand client-side stores
│   ├── jobStore.ts
│   ├── creditStore.ts
│   ├── universeStore.ts
│   └── styleStore.ts
prisma/
├── schema.prisma                 # Database schema (14 models)
└── seed.ts                       # Seed data (GenerationPrompt templates)
```

---

## 🚀 Deployment Guide (Step-by-Step)

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **A Supabase project** (free tier works) — [supabase.com](https://supabase.com)
- **A Google AI Studio API key** (free) — [aistudio.google.com](https://aistudio.google.com/apikey)
- **An OpenRouter API key** (pay-per-use, cheap) — [openrouter.ai](https://openrouter.ai)
- **A Vercel account** (free hobby tier works) — [vercel.com](https://vercel.com)

Optional (for full feature set):
- **Redis** (for BullMQ job queues) — [Upstash](https://upstash.com) free tier or Railway
- **Cloudflare R2** (for audiobook file storage) — [cloudflare.com/r2](https://www.cloudflare.com/developer-platform/r2/)
- **Stripe account** (for credit purchases) — [stripe.com](https://stripe.com)

---

### Step 1: Clone & Install

```bash
git clone https://github.com/C-Jay69/HYDRA-SKRIPT_TRAE_2.0_LATEST_QWEN_430b_060326.git hydraskript
cd hydraskript
npm install
```

---

### Step 2: Set Up Supabase

1. **Create a new Supabase project** at [app.supabase.com](https://app.supabase.com)
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → Database** and copy the connection string → `DATABASE_URL`
   - Use the **Session Mode** pooler URI for Prisma (port 5432)
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
4. **Enable the pgvector extension** — go to **Database → Extensions**, search for `vector`, and enable it. Or run in the SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
5. **Enable Row Level Security** on all tables after migration (optional but recommended for production)

---

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# REQUIRED
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
GOOGLE_AI_API_KEY="AIza..."
OPENROUTER_API_KEY="sk-or-v1-..."

# OPTIONAL (features degrade gracefully without these)
REDIS_HOST="localhost"
REDIS_PORT="6379"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="hydraskript-assets"
R2_ENDPOINT="https://<accountid>.r2.cloudflarestorage.com"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### Step 4: Initialize the Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to your Supabase database
npx prisma db push

# Seed default data (generation prompt templates)
npx prisma db seed
```

> **Note:** `prisma db push` creates all tables directly. If you prefer migration files, use `npx prisma migrate dev --name init` instead.

---

### Step 5: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the HydraSkript landing page.

- Sign up via Supabase Auth (email/password or magic link)
- Complete onboarding (create your first universe + style)
- Navigate the dashboard, books, styles, and credits pages

---

### Step 6: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — keep the defaults
4. Add **all environment variables** from your `.env` file in the Vercel dashboard:
   - Go to **Settings → Environment Variables**
   - Add each key-value pair
   - Make sure to set `NEXT_PUBLIC_APP_URL` to your Vercel domain (e.g., `https://hydraskript.vercel.app`)
5. Click **Deploy**

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GOOGLE_AI_API_KEY
vercel env add OPENROUTER_API_KEY
# ... add all other env vars

# Deploy to production
vercel --prod
```

#### Option C: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Create site
netlify init

# Set env vars in Netlify dashboard (Site settings → Environment variables)
# Then deploy:
netlify deploy --prod
```

> **Important for Netlify:** You may need to set the build command to `npx prisma generate && next build` and the publish directory to `.next`.

---

### Step 7: Post-Deployment Checklist

| Task | Details |
|------|---------|
| ✅ Verify landing page loads | Visit your deployed URL |
| ✅ Test Supabase Auth | Sign up, sign in, check Supabase dashboard for new users |
| ✅ Check API routes | Hit `/api/me/credits` (should return auth prompt or user data) |
| ✅ Update Supabase Auth redirect URLs | In Supabase → Auth → URL Configuration, add your production URL |
| ✅ Set up Stripe webhooks (if using Stripe) | Point to `https://your-domain.com/api/webhooks/stripe` |
| ✅ Configure Redis (if using BullMQ workers) | Add `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` env vars |
| ✅ Set up R2 bucket (if using audiobook export) | Create bucket in Cloudflare, add R2 env vars |

---

### Step 8: Set Up Background Workers (Optional)

For long-running AI generation jobs (style training, chapter generation, audiobook export), you need a BullMQ worker process:

```bash
# You need Redis running (locally or via Upstash/Railway)
# Start the worker (in a separate terminal or as a background process):
npx ts-node src/workers/generationWorker.ts
```

For production, run this as a separate process on:
- **Railway** (recommended — easy to deploy a worker process)
- **Fly.io** (great for long-running processes)
- **A VPS** (DigitalOcean, Hetzner, etc.)

> **Without Redis/workers:** The app still works — API routes handle generation synchronously, but long operations may time out on Vercel's 10s serverless function limit. Consider Vercel Pro (60s) or use the worker approach.

---

## 🎨 Brand Guidelines

| Element | Value |
|---------|-------|
| Background | `#000000` (pure black) |
| Card background | `#1a1a2e` / `#2a2a2a` |
| Primary gradient | `from-purple-500 via-violet-500 to-cyan-400` |
| Accent | Cyan `#06b6d4` / Purple `#8b5cf6` |
| Text | White `#ffffff` / Gray `#a0a0a0` |
| Font | System sans-serif |
| ⚠️ FORBIDDEN | The word "error" must NEVER appear in user-facing strings |

---

## 🔧 Development Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npx prisma studio    # Visual database browser
npx prisma db push   # Push schema changes to database
npx prisma db seed   # Seed default data
npx prisma generate  # Regenerate Prisma client
```

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Supabase) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-side only) |
| `GOOGLE_AI_API_KEY` | ✅ | Google AI Studio key (for Gemini + embeddings + TTS) |
| `OPENROUTER_API_KEY` | ✅ | OpenRouter key (for LLM chat completions) |
| `REDIS_HOST` | ❌ | Redis host for BullMQ (default: localhost) |
| `REDIS_PORT` | ❌ | Redis port (default: 6379) |
| `REDIS_PASSWORD` | ❌ | Redis password |
| `R2_ACCESS_KEY_ID` | ❌ | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | ❌ | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | ❌ | R2 bucket name |
| `R2_ENDPOINT` | ❌ | R2 endpoint URL |
| `R2_PUBLIC_DOMAIN` | ❌ | R2 public domain for serving files |
| `STRIPE_SECRET_KEY` | ❌ | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ | Stripe publishable key |
| `NEXT_PUBLIC_APP_URL` | ❌ | App URL (default: http://localhost:3000) |

---

## 🐛 Troubleshooting

### Build fails with "onnxruntime-node" or native module issues
This was fixed by replacing `@xenova/transformers` (local ONNX embeddings) with the Google AI embedding API. If you see this issue, make sure `@xenova/transformers` is NOT in your `package.json`.

### "cookies() can only be used in a Server Component"
All API routes use `createRouteHandlerClient` from `@supabase/auth-helpers-nextjs` which correctly accesses cookies in route handlers. If you see this in a page component, make sure it's a server component (no `'use client'` directive) or fetch via API routes instead.

### Prisma: "Can't reach database server"
- Check your `DATABASE_URL` connection string
- Make sure you're using the **Session Mode** pooler URI from Supabase (port 5432)
- For Vercel, you may need to add `?pgbouncer=true&connection_limit=1` to the URL

### Vercel serverless timeout
Long AI operations (style training, chapter generation) may exceed the 10s limit. Solutions:
- Upgrade to Vercel Pro (60s limit)
- Use background workers with BullMQ + Redis
- Use Vercel Functions `maxDuration` config (Pro plan)

---

## 📄 License

MIT — Build freely, ship boldly. 🚀
