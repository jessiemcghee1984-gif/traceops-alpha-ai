# TraceOps Public Website Data Processor Register

**Owner:** Jessie McGhee  
**Operating entity:** Alpha Dog P.I. & Security LLC  
**Scope:** Public marketing and demonstration-request website only  
**Last reviewed:** 2026-07-14

This register does not authorize private case, evidence, identity, child-welfare, medical, criminal-history, financial, credential, or other restricted data to be submitted through the public website.

| Processor | Purpose | Data received | Current controls | Material limitation | Required next action |
|---|---|---|---|---|---|
| Vercel | Public hosting and serverless execution | Public page requests, ordinary technical/security metadata, and temporary lead-request processing | Same-origin server route, request-size limit, rate limiting, security headers, no public secret exposure | Final account recovery, analytics configuration and provider-contract review remain open | Verify team roles, recovery, analytics, logs, retention and DPA/terms |
| 3Min API | Store approved public demonstration-request records | Name, contact method/value, requested service, general city/county/state, brief non-confidential summary, source URL, consent and privacy acknowledgment | Server-to-server request; endpoint description prohibits restricted data; a dedicated create-only key exists; form blocks obvious SSN/card patterns and warns users | Production records may be preserved without automatic expiration and archived after 30 days. The immutable default key retains CRUD permissions and the connected tools do not reveal which key Vercel currently uses. This endpoint is not approved for broader intake or private-system data. | Verify Vercel uses the create-only key without exposing it; obtain contractual retention/deletion terms or replace the processor; implement tested deletion/subject-request workflow; review privacy notice with counsel |

## Public intake boundary

The public lead route must reject or warn against Social Security numbers, dates of birth, payment-card data, passwords, evidence, criminal-history records, medical information, protected child information, confidential case notes, detailed allegations, private residence addresses, sealed or privileged records, and information the sender is not authorized to disclose.

## Data-use boundary

Public lead content is used to respond to the inquiry and assess high-level workflow fit. It is not approved for product training, model training, fine-tuning, research, performance benchmarking, advertising, resale, or cross-customer enrichment under ordinary website terms.

## Activation rule

No additional data field, analytics provider, AI processor, webhook, CRM, email automation, or advertising-conversion destination may receive public lead information until it is added to this register, disclosed where required, minimized, secured, tested, and owner-approved.

> **DRAFT — ATTORNEY, PRIVACY, SECURITY AND OWNER REVIEW REQUIRED.**
