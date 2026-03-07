# HydraSkript: E-Book & Content Generation Platform

HydraSkript is a high-performance platform for AI-assisted writing, story continuity management, and automated content generation. It leverages local and cloud LLMs to provide authors with a seamless, voice-aware creative experience.

## Core Features

- **Style Training**: Analyze your unique writing style using local LLMs (Ollama) to create a digital "voice fingerprint."
- **Continuity Guard**: Automated scanning for narrative inconsistencies across chapters (locations, character states, timeline).
- **Style-Aware Generation**: Generate new chapters or expand existing ones while maintaining your exact prose style.
- **Audiobook Generation**: Convert your completed manuscripts into high-quality audiobooks with AI voice synthesis.
- **Credit-Based Economy**: Integrated credit system for AI operations, including earning credits through daily writing goals.

## Tech Stack

- **Frontend/Backend**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **AI Orchestration**: [Ollama](https://ollama.com/) (Local), [Gemini](https://ai.google.dev/) (Cloud), [LangGraph](https://www.langchain.com/langgraph) (Workflows)
- **Background Jobs**: [BullMQ](https://docs.bullmq.io/) with [Redis](https://redis.io/)
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (Manuscripts, Audiobooks, Style Samples)

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14+ (Required for `pgvector` extension)
- **Redis**: For background job management
- **Ollama**: Installed and running locally for style training and analysis

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and populate it with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hydraskript?schema=public"

# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Redis (BullMQ)
REDIS_HOST="localhost"
REDIS_PORT="6379"

# AI Models
OLLAMA_BASE_URL="http://localhost:11434/api"
GOOGLE_AI_API_KEY="your-google-api-key"

# Storage (Cloudflare R2)
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="hydraskript-assets"
```

### 3. Database Setup

Run the migrations and seed the database with initial prompt templates:

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Running the Application

Start the development server:

```bash
npm run dev
```

In a separate terminal, start the background workers:

```bash
# Ensure Redis is running before starting workers
npm run workers
```

## Deployment Instructions

### Database
Ensure your PostgreSQL instance has the `pgvector` extension enabled for RAG-based context retrieval.

### Workers
For production, it is recommended to run the BullMQ workers as a separate process or service (e.g., on a VPS or containerized via Docker) to ensure generation jobs don't block the main web server.

### AI Models
HydraSkript is designed to be "model-agnostic." For high-volume deployments, consider using a hosted LLM provider like OpenRouter or Google Gemini Pro for the main generation tasks, while keeping style training local for privacy.

## Project Structure

- `/src/app/api`: Next.js Route Handlers (API endpoints)
- `/src/lib/ai`: LLM clients and configuration
- `/src/lib/bullmq`: Background job workers and queue logic
- `/src/lib/langgraph`: Complex AI workflow definitions
- `/src/lib/services`: Core business logic (Credits, Style, Continuity)
- `/prisma`: Database schema and migrations
