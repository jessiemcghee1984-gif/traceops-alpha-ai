# TraceOps Public Site — Project Index

**Initial audit:** 2026-08-06  
**Provider re-verification:** 2026-08-12  
**Repository:** `jessiemcghee1984-gif/traceops-alpha-ai`  
**Visibility:** Public  
**Default branch:** `main`

## Role

This repository is the public TraceOps marketing, acquisition, non-confidential lead-intake and synthetic-preview layer. It is **not** the canonical private TraceOps application and must never be treated as a production case-data/evidence authority.

Canonical private TraceOps source:

`jessiemcghee1984-gif/traceops-alpha-ai-2027`

## Current provider readback — 2026-08-12

- Repository remains **public**.
- Default branch remains `main` at `54c6a9954faa238c42870b46ab66db1b0abc0ba4`.
- `main` is **unprotected** and required status checks are off in direct branch readback.
- Repository rulesets endpoint returns **none**.
- GitHub Environments remain `Preview` and `Production`.
- Both returned environments have `protection_rules: []`.
- Both returned environments allow admin bypass.
- No deployment branch policy was returned for either environment.
- Project-index PR #10 remains Draft/open.
- Issue #4 — legacy `.html` navigation cleanup — was **verified complete and closed** on 2026-08-12.
- Dependabot alerts were returned as disabled in the August 6 portfolio audit; they were not separately re-read in this August 12 public-site pass and must not be assumed changed.

## Verified production navigation cleanup

Issue #4 is closed based on direct source and deployment evidence:

- `main/demo.html` uses brand `/`, Home `/`, Pricing `/pricing`, and Demo `/demo`;
- Vercel production deployment `dpl_CurJjmurfAcGBQ5Ad4snw29SbgXr` for exact main commit `54c6a9954faa238c42870b46ab66db1b0abc0ba4` is `READY`;
- direct Vercel fetch of `https://traceops-alpha-ai.vercel.app/demo` returned HTTP 200 and those same canonical navigation routes.

No extra source mutation or production deployment was required to close the stale issue.

## Important files

- `README.md`
- `PROJECT_INDEX.md` on the controlled audit branch
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

## Required maintenance

1. Add an appropriate `main` ruleset/branch-protection policy for public-site source changes.
2. Add appropriate Preview/Production environment restrictions and re-read them directly after configuration.
3. Keep real case data, evidence, credentials, protected identity records and private infrastructure configuration out of this repository.
4. Keep public pricing/payment claims synchronized to actually approved commercial status and fail closed on unverified payment destinations.
5. Keep the canonical-private repository link visible in governance records.
6. Preserve the public/private boundary if new marketing, lead intake or synthetic product-preview features are added.
7. Re-run production verification after future production-facing source changes; the Issue #4 closure is evidence for the current main baseline only.

## Production boundary

A public Vercel deployment of this repository does not authorize:

- private TraceOps production;
- protected-data use;
- private evidence handling;
- unrestricted AI access to operational data;
- investigative or legal adverse decisions;
- private infrastructure exposure;
- automatic payment/client acceptance beyond separately approved public flows.

## Audit rule

This repository should remain easy to publish and easy to inspect, but publication status is not equivalent to private-system readiness. Provider settings and public claims should be re-verified whenever production-facing behavior changes.
