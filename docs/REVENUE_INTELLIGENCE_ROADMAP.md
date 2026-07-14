# TraceOps Revenue Intelligence Roadmap

Status: active production plan  
Owner: Jessie McGhee  
Operating company: Alpha Dog P.I. & Security LLC  
Last updated: 2026-07-14

## Objective

Build TraceOps Alpha AI into a premium investigation and legal-support operations platform with a governed growth engine. The system should measure acquisition, identify conversion friction, recommend improvements, run controlled tests, and promote only validated changes after the required human approval.

“Self-improving” does **not** mean unrestricted autonomous production changes. It means a measurable release loop with security, legal, commercial, and owner gates.

## Current production baseline

- Premium public marketing experience
- Synthetic operator-console preview
- Secure non-confidential demo intake
- Server-side 3Min API lead forwarding
- Same-origin enforcement, size limits, honeypot, validation, and restricted-data checks
- Continuous Vercel production smoke verification
- Public checkout disabled until Stripe ownership, payouts, price configuration, terms, and controlled payment testing are verified
- Founder ownership, repository controls, security policy, and third-party inventory
- Public privacy, terms, responsible disclosure, and AI trust boundaries

## Phase 1 — Revenue-safe acquisition

1. Verify Stripe account ownership, payout capability, destination bank, products, prices, refunds, receipts, tax settings, and statement descriptor.
2. Reconcile public pricing with the active Stripe product catalog.
3. Perform a controlled low-value payment and confirmed payout test.
4. Issue written refund, cancellation, subscription, and onboarding terms.
5. Restore checkout only through an owner-approved payment configuration.
6. Connect a dedicated product domain or approved TraceOps subdomain.

**Exit gate:** owner signs off on funds destination and the production smoke gate confirms no unauthorized payment destinations.

## Phase 2 — First-party growth telemetry

Track low-risk events only:

- page viewed
- platform preview opened
- pricing viewed
- demo form started
- demo request submitted
- owner-issued checkout opened
- onboarding started
- customer activated

Required fields:

- event name
- anonymous visitor/session identifier
- page path
- approved campaign parameters
- experiment variant
- timestamp
- consent state where required

Do not place case data, evidence, private addresses, identity records, or sensitive personal information in marketing analytics.

**Exit gate:** events are documented, consent-aware, retained for a defined period, and visible in an owner dashboard.

## Phase 3 — Lead intelligence

Create an owner-reviewed lead pipeline that can:

- classify workflow interest
- estimate urgency and product fit
- identify missing qualification details
- recommend phone, email, text, demo, or nurture as the next action
- draft a follow-up message
- preserve the original lead record and model rationale

AI recommendations cannot accept a client, set price, promise a result, authorize investigative activity, or send a high-risk message without approval.

## Phase 4 — Controlled experimentation

Initial tests:

1. homepage problem statement
2. primary call-to-action language
3. platform-preview entry point
4. pricing presentation
5. demo form length
6. owner-review reassurance
7. industry-specific landing pages

Each experiment requires:

- hypothesis
- primary metric
- minimum sample threshold
- guardrail metrics
- start and stop conditions
- owner-approved winner promotion

## Phase 5 — Market and content intelligence

Scheduled research should produce reviewable drafts for:

- investigator workflow trends
- legal-support operations
- relevant security practices
- product and competitor positioning
- customer objections
- frequently asked questions
- jurisdiction-sensitive compliance updates

Research output must include source dates, citations, uncertainty, and a clear distinction between confirmed fact and recommendation. No legal or regulatory claim publishes automatically.

## Phase 6 — Product intelligence moat

Build governed memory from approved operational outcomes:

- successful onboarding patterns
- common workflow configuration
- recurring objections
- report-template performance
- source-quality findings
- user-requested feature patterns
- support and reliability issues

The moat is the combination of vertical workflow, verified outcomes, provenance, authorization boundaries, and owner-approved learning—not a generic model wrapper.

## Core release gates

A production change must pass applicable gates:

1. source validation
2. automated tests
3. preview deployment
4. security review
5. privacy/data-boundary review
6. legal/compliance review when applicable
7. commercial and payment review
8. owner approval
9. production smoke verification
10. rollback readiness

## Highest-priority unresolved blockers

- Confirm Stripe payout destination and capabilities.
- Confirm the public price architecture: setup deposit, monthly subscriptions, agency tier, and any usage charges.
- Add immediate owner notification for new 3Min lead records.
- Establish first-party analytics and experimentation storage.
- Choose the canonical product domain.
- Build authenticated application infrastructure separate from the public marketing repository.
- Implement private organization/case authorization, audit, evidence, and AI retrieval boundaries.
