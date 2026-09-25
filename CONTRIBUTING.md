# Contributing to Expense Tracker AI

Thank you for your interest in contributing to **Expense Tracker AI**! We welcome bug fixes, documentation improvements, architectural proposals, and new feature suggestions.

---

## Code of Conduct

All contributors are expected to uphold the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---

## Development Workflow

### 1. Prerequisites

- **Node.js**: v20 or v22 (LTS recommended)
- **npm**: v10+
- **PostgreSQL**: Neon Serverless Postgres or a local PostgreSQL instance
- **Accounts / Keys**:
  - [Clerk](https://clerk.com) (Authentication)
  - [Google AI Studio](https://aistudio.google.com) (Gemini API)

### 2. Fork and Clone

```bash
git clone https://github.com/<your-username>/nextjs-expense-tracker-website.git
cd nextjs-expense-tracker-website
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Copy the example file and populate your keys:
```bash
cp .env.example .env
```

Apply database migrations:
```bash
npx prisma generate
npx prisma db push
```

### 5. Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Testing & Quality Assurance

Before submitting any code, ensure all automated tests, linting, and production builds pass:

```bash
# Run unit and integration tests (35 test cases)
npm test

# Run ESLint
npm run lint

# Verify production Next.js standalone build
npm run build
```

---

## Pull Request Guidelines

1. **Branch Naming**:
   - `feat/feature-name`
   - `fix/bug-description`
   - `docs/documentation-update`
   - `refactor/component-cleanup`
2. **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add spending export to CSV`
   - `fix: resolve rate limiter sliding window edge case`
   - `test: add unit coverage for health probe`
3. **Atomic Changes**: Keep PRs focused on a single change.
4. **CI Green**: All GitHub Actions CI checks must pass before merging.
