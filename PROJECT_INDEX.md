# TraceOps Public Site — Project Index

**Audit date:** 2026-08-06  
**Repository:** `jessiemcghee1984-gif/traceops-alpha-ai`  
**Visibility:** Public  
**Default branch:** `main`  
**Audit head:** `54c6a9954faa238c42870b46ab66db1b0abc0ba4`

## Role

This repository is the public TraceOps marketing, acquisition, non-confidential lead-intake and synthetic-preview layer. It is **not** the canonical private TraceOps application and must never be treated as a production case-data/evidence authority.

Canonical private TraceOps source:

`jessiemcghee1984-gif/traceops-alpha-ai-2027`

## Important files

- `README.md`
- `DATA_PROCESSORS.md`
- `NOTICE.md`
- `PROPRIETARY_LICENSE.md`
- `SECURITY.md`
- `THIRD_PARTY_NOTICES.md`
- `.well-known/security.txt`
- `api/lead.js`
- `index.html`
- `demo.html`
- `platform.html`
- `pricing.html`
- `pricing-v2.html`
- `privacy.html`
- `terms.html`
- `trust.html`
- `scripts/verify-lead-contract.mjs`
- `scripts/verify-payment-source.mjs`
- `scripts/verify-production.mjs`
- `.github/workflows/vercel-production-smoke.yml`
- `vercel.json`

## GitHub control status

- Repository ruleset: none returned at audit.
- GitHub Environments: `Preview`, `Production`.
- Environment protection rules: none returned.
- Admin bypass: allowed by provider readback.
- Dependabot alerts: disabled.
- Open PRs: none at audit.
- Open issue #4: legacy `.html` navigation cleanup.

## Required maintenance

1. Add `main` ruleset/branch protection.
2. Add appropriate Production/Preview environment restrictions.
3. Keep real case data, evidence, secrets and private infrastructure out of this repo.
4. Reconcile public pricing/payment claims with current approved commercial status.
5. Resolve issue #4 and smoke-test production.
6. Keep the canonical-private repository link visible in governance records.

## Production boundary

A public Vercel deployment of this repository does not authorize private TraceOps production, protected-data use, unrestricted AI, investigative decisions or private evidence handling.
