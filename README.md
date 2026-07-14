# TraceOps Alpha AI

Premium public website and synthetic operator-console preview for an investigation and legal-support operations platform developed under Project Genesis.

- **Owner:** Jessie McGhee
- **Operating company:** Alpha Dog P.I. & Security LLC
- **Production:** https://traceops-alpha-ai.vercel.app
- **Status:** public acquisition and product-preview layer; private production application remains under development

## Public production capabilities

- premium responsive homepage
- synthetic operator-console preview
- commercial pricing and owner-reviewed access flow
- secure non-confidential demonstration request
- server-side lead forwarding to the production 3Min API endpoint
- request validation, restricted-data checks, same-origin protection, honeypot, size limits, and upstream timeout
- continuous Vercel production smoke verification
- public privacy, terms, AI trust, and responsible-disclosure pages
- payment safeguards that prohibit unverified public checkout destinations

## Important system boundary

This repository is the public marketing and demonstration surface. It must not contain real case data, evidence, protected identity records, production credentials, payment secrets, private infrastructure configuration, or unrestricted AI access to operational data.

The `/platform` route uses synthetic data and illustrates product direction. It is not the authenticated private production application.

## Payment status

Public checkout remains disabled until the owner verifies:

1. Stripe legal account ownership
2. charges and payout capabilities
3. payout bank destination
4. product and price configuration
5. refund, cancellation, receipt, and onboarding terms
6. controlled payment and confirmed payout testing

No payment destination should be committed to this repository until those gates are satisfied and the source/payment verification scripts are deliberately updated.

## Local verification

```bash
node scripts/verify-payment-source.mjs
node scripts/verify-lead-contract.mjs
node scripts/verify-production.mjs
```

The production verifier defaults to `https://traceops-alpha-ai.vercel.app`. Override it with `PRODUCTION_URL` when validating another environment.

## Deployment

The `main` branch is connected to Vercel. Pull requests receive preview deployments. Pushes to `main` deploy to production and trigger production smoke verification.

Required encrypted Vercel variable:

```text
THREE_MIN_API_KEY=<production create-only key>
```

Never place the key in HTML, browser JavaScript, repository files, screenshots, or public logs.

## Project documentation

- [Revenue intelligence roadmap](docs/REVENUE_INTELLIGENCE_ROADMAP.md)
- [Founder ownership notice](NOTICE.md)
- [Proprietary license notice](PROPRIETARY_LICENSE.md)
- [Security policy](SECURITY.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)

## Governance

AI may assist with analysis, drafting, categorization, testing proposals, and workflow recommendations. Production publication, pricing, client acceptance, legal conclusions, field authorization, sensitive access, evidence release, and infrastructure-ownership changes remain subject to the applicable human and owner approval gates.
