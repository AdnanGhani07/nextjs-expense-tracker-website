<div align="center">

# 💰 Expense Tracker AI

**An enterprise-grade, serverless personal finance application built with Next.js 15, Google Gemini 2.0 Flash, Neon Serverless Postgres, and Clerk Authentication.**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%203.5%20Flash%20Lite-orange?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Google Cloud Run](https://img.shields.io/badge/GCP-Cloud%20Run-4285F4?style=for-the-badge&logo=googlecloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Live Demo](https://expense-tracker-zjrlogga2a-uc.a.run.app) • [Report Bug](https://github.com/AdnanGhani07/nextjs-expense-tracker-website/issues/new?template=bug_report.md) • [Request Feature](https://github.com/AdnanGhani07/nextjs-expense-tracker-website/issues/new?template=feature_request.md)

</div>

---

## 📖 Overview

**Expense Tracker AI** combines modern full-stack web development with generative AI to offer personalized financial intelligence. Designed from day one for zero idle hosting costs, high availability, and airtight security, the app automatically categorizes transactions, computes real-time spending analytics, and generates actionable, AI-driven advisory feedback.

---

## 🚀 Key Features

- **🤖 Autonomous AI Categorization & Insights:** Powered by Google's `gemini-2.0-flash` to automatically categorize transactions and surface personalized financial advice.
- **💬 Interactive AI Financial Advisor:** In-app conversational drawer allowing users to ask questions like *"Where did most of my money go?"* or *"How can I cut bills this month?"*.
- **📊 Real-Time Analytics & SVG Visualizations:**
  - 4 Key Metric Summary Cards (Total Expenses, Month-over-Month Delta, Top Category, Average Expense).
  - Pure SVG Category Donut Chart with interactive slice percentages.
  - 6-Month Rolling Historical Trend Bar Chart.
- **⚡ Instant Transaction Management:** Filter by category pills, search descriptions with debounced query handling, and add/delete records with optimistic UI updates.
- **🛡️ Enterprise Security:**
  - Strict input validation via **Zod** (lengths, boundaries, regex).
  - Per-user sliding-window rate limiting on AI server actions.
  - Security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
  - Safe Clerk-to-Prisma user identity synchronization.
- **🩺 Health & Readiness Probes:** Dedicated `/api/health` and `/api/healthz` endpoints for continuous infrastructure uptime monitoring.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User Browser]) -->|HTTPS| CloudRun[Google Cloud Run<br/>Scale-to-Zero Container]
    
    subgraph Application Stack
        CloudRun --> NextApp[Next.js 15 Standalone App]
        NextApp --> ClerkAuth[Clerk Authentication]
        NextApp --> GeminiAI[Google Gemini 2.0 Flash API]
        NextApp --> PrismaORM[Prisma ORM Client]
    end

    subgraph Data & Secrets
        PrismaORM -->|Pooled TCP/SSL| NeonDB[(Neon Serverless Postgres)]
        CloudRun -.->|Secret Ref| SecretMgr[GCP Secret Manager]
    end

    subgraph CI/CD & DevOps
        GitHub[GitHub Actions] -->|Keyless OIDC WIF| GCPAuth[GCP Workload Identity]
        GCPAuth --> ArtifactReg[GCP Artifact Registry]
        ArtifactReg --> CloudRun
    end
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Server Actions, Standalone Build, React 19 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Custom design system, glassmorphism, responsive |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking and validation |
| **Database** | [Neon Postgres](https://neon.tech/) | Serverless PostgreSQL with connection pooling |
| **ORM** | [Prisma 6](https://www.prisma.io/) | Type-safe query engine and schema migrations |
| **Authentication** | [Clerk](https://clerk.com/) | Multi-factor auth, social logins, secure session JWTs |
| **AI Intelligence** | [Google Generative AI](https://aistudio.google.com/) | `gemini-2.0-flash` for categorization and advisory |
| **Cloud Hosting** | [Google Cloud Run](https://cloud.google.com/run) | Scale-to-zero serverless container execution |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | Keyless Workload Identity Federation (WIF) deployments |
| **Infrastructure** | [Terraform](https://www.terraform.io/) | Infrastructure-as-Code for GCP resources |

---

## 💻 Getting Started Locally

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (v22.21.1+ recommended)
- **npm**: `v10+`
- **PostgreSQL**: Local instance or free [Neon DB](https://neon.tech)
- **API Keys**:
  - [Clerk Account](https://dashboard.clerk.com/)
  - [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/AdnanGhani07/nextjs-expense-tracker-website.git
cd nextjs-expense-tracker-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the template:
```bash
cp .env.example .env
```

Fill in your variables in `.env`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Quality Assurance

The application includes a zero-dependency, ultra-fast test suite running on Node's native test runner (`node:test` and `node:assert/strict`).

```bash
# Run the complete test suite (35 automated tests)
npm test

# Run code linter
npm run lint

# Test production standalone compilation
npm run build
```

### Test Suite Structure

```
tests/
├── validation.test.ts      # Zod input schemas, boundaries, format rules
├── analytics.test.ts       # Aggregations, MoM comparisons, 6mo trends
├── ai.test.ts              # Whitelist enforcement, fallback resiliency
├── security.test.ts        # Sliding-window rate limiter & input caps
├── health.test.ts          # /api/health and /api/healthz probe validation
└── headers.test.ts         # Security headers and standalone build config
```

---

## ☁️ Zero-Cost Production Deployment

This project is configured to run at **$0 monthly hosting cost** within Google Cloud's Always-Free tier and Neon's Serverless Postgres tier.

### 1. Infrastructure via Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Update terraform.tfvars with your GCP project ID and GitHub repository
terraform init
terraform apply
```

This provisions:
- Google Artifact Registry Docker repository
- Google Secret Manager secrets
- Google Cloud Run service (scale-to-zero, 1 vCPU, 512MB RAM)
- Google Cloud Workload Identity Federation pool & provider for keyless GitHub Actions deployments

### 2. Automated Keyless CI/CD

Deployments are fully automated via [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Add these repository secrets to GitHub:

| GitHub Secret | Description | Source |
| :--- | :--- | :--- |
| `GCP_PROJECT_ID` | GCP Project ID | `terraform output project_id` |
| `GCP_WIF_PROVIDER` | Workload Identity Pool Provider | `terraform output wif_provider_name` |
| `GCP_WIF_SERVICE_ACCOUNT` | Deployer Service Account Email | `terraform output wif_service_account` |

Every push to `main` executes linting, runs all 35 tests, builds the standalone Docker container, pushes to Artifact Registry, deploys to Cloud Run, and executes a live `/api/healthz` smoke test.

---

## 🔒 Security & Vulnerability Reporting

Please review our [SECURITY.md](SECURITY.md) for details on our vulnerability reporting procedures, supported versions, and architectural safeguards.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
