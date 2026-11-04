# KJS Growth OS — Beta Architecture

Status: BETA / NOT PRODUCTION-CERTIFIED
Branch: beta/kjs-growth-os
Baseline: main
Owner approval: S received for beta architecture proposal.

## 1. Objective

Unify the KJS commercial operation around measurable, consent-based acquisition and product lifecycle workflows. This document defines the beta architecture; it does not claim that integrations, deployments, revenue targets, or production telemetry are already active.

## 2. Operating domains

1. Research & market intelligence: public market signals, search demand, competitor offers, content themes and seasonality.
2. Content & offer studio: offer registry, creative variants, landing pages, VSLs, blog assets and versioned angles.
3. Distribution: channel-specific publishing plans and UTM attribution.
4. Capture & consent: explicit opt-in forms for email and WhatsApp, purpose notice, consent timestamp, source and withdrawal.
5. CRM & lifecycle: lead status, qualification, purchase, onboarding, support, retention and reactivation.
6. Analytics & governance: event validation, dashboards, experiments, audit trail and release gates.

## 3. Reference flow

Research -> Offer/Angle Registry -> Creative & Landing Assets -> Distribution -> Consent Capture -> CRM -> Checkout/Delivery -> Lifecycle -> Analytics -> Experiment Review.

Each transition must emit a traceable event. A planned event is not a production event. Test/sandbox traffic must be isolated from production reporting.

## 4. Data collection rules

Allowed by default:
- First-party events generated on KJS properties, with clear notice and appropriate consent.
- UTM campaign parameters and aggregate channel performance.
- Voluntary email and WhatsApp submissions for stated purposes.
- Essential security logs with restricted access and retention limits.
- Consent-based analytics cookies, with a usable choice mechanism where required.

Not part of this architecture:
- Covert device fingerprinting or cross-site identity stitching.
- Collection of private GPS, satellite, radio, telecom or VPN activity.
- Interception of calls, messages or network traffic.
- Inferring a person's identity or precise location from unrelated signals.
- Treating an IP address or VPN status as proof of identity.

Use IP only when necessary for security/anti-abuse, minimize or truncate where feasible, restrict access, and define retention. Do not use IP as a substitute for consent or identity verification. Apply LGPD principles: purpose, adequacy, necessity, transparency, security, prevention and data-subject rights.

## 5. Canonical event envelope

Every accepted event must include:
- event_id: unique identifier
- event_name: controlled vocabulary
- occurred_at: UTC ISO-8601 timestamp
- environment: development | staging | production
- source: web | mobile | server | import
- anonymous_id: first-party pseudonymous ID where permitted
- subject_id: internal customer/lead ID only when legitimately available
- offer_id and asset_id when relevant
- consent_state and consent_purpose when personal-data processing depends on consent
- attribution: UTM fields and referrer where available
- schema_version

Never place raw email, phone, access tokens, payment details or other secrets in analytics events. Keep contact details in the protected CRM domain.

## 6. Measurement model

Creative: impressions, reach, frequency, clicks, CTR, qualified visits and attributed conversions.
Landing/VSL: sessions, engaged sessions, scroll milestones, video quartiles, CTA clicks, form starts, submissions and conversion rate.
Blog/SEO: impressions, clicks, queries, landing pages, engaged sessions and assisted conversions.
CRM: consented leads, qualification rate, stage velocity, contactability, opportunities and close rate.
Commerce: checkout starts, paid orders, refunds, delivery success, repeat purchase and contribution margin.

Report each metric with source, time window, environment, definition and attribution method. Do not fabricate impression counts or infer ROAS without verified spend and revenue data. ROAS 100x and R$1M/day are aspirations, not forecasts or guarantees.

## 7. Experiment and angle lifecycle

Each angle has angle_id, hypothesis, audience/context, creative variants, channel, start/end dates, minimum observation criteria, outcome metrics, evidence links and status:
draft -> scheduled -> running -> validated | rejected | inconclusive -> archived.

A winning angle must be supported by observed data and adequate sample/context; never label a concept as validated based only on a hypothesis or a single anomalous result.

## 8. Hub governance

Research -> Process -> Execute -> Validate -> Scale -> Learn -> Versioned Skill.

Every Skill must have an owner, version, inputs, outputs, permissions, data classification, test cases, rollback notes and changelog. Replication across repositories requires explicit repository scope and least-privilege access.

## 9. Beta release gates

- Schema validation and event deduplication.
- Environment separation for test and production.
- Consent and withdrawal path verified end-to-end.
- Role-based access and secret management.
- Data retention and deletion workflow documented.
- No raw PII in analytics or application logs.
- Unit/integration tests and CI result attached to the exact commit.
- Rollback plan and monitoring owner documented.

## 10. Current certification state

Architecture documentation only. No claim of live tracking, active prospecting, sales automation, production deployment, revenue, ROAS, mobile release or browser instrumentation is made by this commit. Certification remains NOT_CERTIFIED until evidence for each release gate is attached.

## 11. Beta implementation added to this branch

The beta branch now includes:
- `analytics_events` ledger with unique event IDs for idempotent ingestion.
- `consent_receipts` ledger recording consent state, purposes, notice version and capture time.
- `analytics.recordConsent` procedure to record a decision and issue a server-generated receipt ID; withdrawal updates the referenced receipt.
- `analytics.ingest` procedure that requires an active granted receipt and verifies that submitted purposes are covered by that receipt.
- Strict input schemas that reject unknown properties, reducing the risk of accidentally sending contact details or unrelated device data.

Important limitations:
- The client consent interface is not yet wired to these procedures.
- The new tables require a database schema migration/push before runtime use.
- No authentication/authorization policy for analytics reporting has been added; no public aggregate/reporting endpoint is exposed in this beta.
- Consent receipt validation is a server-side gate, but the production UI, notice text, proof of user action, withdrawal UX, retention schedule and legal review remain release requirements.
- Rate limiting, abuse controls, monitoring and automated integration tests remain pending.
- This code does not collect GPS, telecom, satellite, radio, VPN or covert fingerprinting data.

The branch remains beta and NOT_CERTIFIED until build, migration, automated tests, consent UX and end-to-end verification pass.
