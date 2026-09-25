# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

---

## Reporting a Vulnerability

The Expense Tracker AI engineering team takes security and privacy very seriously. If you discover a security vulnerability, we appreciate your help in disclosing it responsibly.

### How to Report

- **Do NOT file a public issue** for potential security vulnerabilities.
- Please report vulnerabilities privately via [GitHub Private Vulnerability Reporting](https://github.com/AdnanGhani07/nextjs-expense-tracker-website/security/advisories/new) or by emailing the project maintainer directly at **agadnanrocks07@gmail.com**.
- Include the following details in your report:
  - Description of the vulnerability.
  - Steps to reproduce or proof-of-concept (PoC).
  - Potential impact of the issue.
  - Any proposed fix or mitigation (if available).

### Response SLA

- **Acknowledgment:** Within 24-48 hours.
- **Assessment & Triage:** Within 5 business days.
- **Fix & Disclosure:** Coordinated release with reasonable notice.

---

## Security Practices in this Project

1. **Authentication & Identity:** User identity is verified via Clerk OAuth / session JWTs. All server actions enforce user authentication before accessing database records.
2. **Keyless CI/CD:** GitHub Actions uses Google Cloud Workload Identity Federation (OIDC) instead of static service account keys.
3. **Secret Management:** Production secrets are injected at runtime via Google Cloud Secret Manager. No plain-text secrets or `.env` files are checked into version control.
4. **Input Validation:** All user inputs are validated against strict Zod schemas with character length limits and regex bounds.
5. **Rate Limiting:** AI endpoints are protected with sliding-window rate limiters to mitigate abuse and denial-of-service.
6. **HTTP Headers:** Production responses enforce security headers including `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and a strict `Referrer-Policy`.
