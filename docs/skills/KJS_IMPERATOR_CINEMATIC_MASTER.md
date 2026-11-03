# KJS IMPERATOR Ω — Cinematic Master Skill
## Technical specification for Imperator Movie Ω

**Protocol:** #KamilloSantosProtocol  
**Governance:** #520ATIVADO  
**Status:** SPECIFICATION_ONLY / NOT_CERTIFIED  
**Repository:** kamillosantos/KAMILLO-4531  
**Target branch:** feat/kjs-imperator-movie-agent  
**Existing UI:** packages/web/src/web/components/painel/imperator-movie.tsx

---

## 1. Mission

Turn Imperator Movie Ω into a premium, multimodel audiovisual production workspace for original anime, films, series, trailers, documentaries, illustrated audio, and other authorized productions.

The system is a production orchestrator. It must not represent a brief, prompt, provider response, or queued job as a completed render.

## 2. Image and mastering profiles

The premium delivery target is an **8K master**. A **12K master** is an optional high-resolution target when source quality, processing capacity, storage, and the selected mastering tools support it.

- 4K may be used as an intermediate, proxy, preview, or source stage; it is not the final approved premium delivery profile.
- Validate actual pixel dimensions, frame rate, aspect ratio, bit depth, codec, color space, and file integrity.
- A resolution label in the UI is a requested target, not proof of native generation at that resolution.
- If a generation provider returns lower resolution, the pipeline must explicitly record the source resolution and run a separate, measurable upscale/restoration stage.
- Preserve an untouched source master and record every transformation.
- Reject outputs with unacceptable artifacts, unstable detail, broken frames, flicker, or continuity failures.

Suggested delivery profiles (subject to the actual toolchain):
- **KJS_8K_MASTER**
- **KJS_12K_MASTER**
- **KJS_PREVIEW_4K**
- **KJS_PROXY_REVIEW**

## 3. Immersive audio specification

Support delivery profiles according to the available licensed toolchain and destination:

- Stereo and multichannel surround, including 5.1 and 7.1 where supported.
- Object-based immersive audio only when the production tools, licenses, and delivery platform support it.
- Deep, controlled bass and sub-bass with adequate headroom; never boost bass at the expense of clipping, distortion, dialogue intelligibility, or listener safety.
- Balanced low, mid, and high frequency response, with project-specific EQ rather than a fixed universal curve.
- Dialogue clarity, spatial placement, ambience, Foley, effects, transitions, and original score.
- Loudness, true-peak, phase, channel mapping, and codec checks for the intended distribution target.
- Maintain separate mix/master versions when cinema, streaming, mobile, and home-theater requirements differ.

Do not claim Dolby Atmos certification or a licensed Atmos master unless the actual licensed workflow and validation are documented.

## 4. Premium art direction workflow

Every production must have a creative bible containing:
1. Logline, synopsis, genre, audience, emotional intent, and creative references.
2. Original visual identity, color palette, lighting language, texture, and composition rules.
3. Character sheets, approved likeness/voice permissions, costumes, props, and expression ranges.
4. World-building, environment sheets, architecture, props, and continuity rules.
5. Script, scene breakdown, storyboard, shot list, camera movement, and timing.
6. Animation direction, motion language, VFX, compositing, and finishing.
7. Sound bible, score direction, ambience, Foley, and mix intent.
8. Quality gates and delivery manifest.

Anime and all other productions must be original or properly licensed. Do not imitate a living artist's exact style or use a real person's likeness or voice without appropriate authorization.

## 5. Agent orchestration model

The phrase “100 trillion agents” describes the conceptual scale of the task space and specialization capacity, not a claim that 100 trillion processes run simultaneously.

Use ten bounded departments:
1. Creative direction and showrunning.
2. Script, narrative, and universe design.
3. Anime, character design, and animation.
4. Environments, architecture, and props.
5. Storyboard, camera, and cinematography.
6. Image and video generation.
7. Motion, VFX, compositing, and post-production.
8. Music, sound design, and audio engineering.
9. Upscaling, mastering, and quality assurance.
10. Catalog, distribution, analytics, and rights management.

Each department may spawn short-lived specialist workers per task. The orchestrator must enforce concurrency caps, per-job budgets, retries, timeouts, cancellation, provider quotas, and human approval gates. No unbounded fan-out.

## 6. Provider adapters and xAI

Use provider adapters so that xAI and other providers can be added without coupling the UI to one vendor.

For each provider job, record:
- provider and model identifier;
- requested capability and requested output profile;
- request/job identifier;
- submission and completion timestamps;
- returned dimensions, duration, codec, and other available metadata;
- estimated and actual cost when supplied;
- status, error, retry count, and source asset references.

Treat asynchronous generation as a job lifecycle: QUEUED -> SUBMITTED -> RUNNING -> SUCCEEDED | FAILED | CANCELLED. Poll or receive provider completion using the provider's documented mechanism. Never expose API keys to the browser, source control, logs, or user-visible output. Store secrets only in the deployment environment's secret manager.

A provider's native output limits must be respected. Any resolution enhancement or surround mix beyond provider output must be represented as a separate pipeline stage.

## 7. Data and job governance

Every job and asset must have:
- unique ID;
- tenant/workspace and authorized user;
- creation timestamp and environment;
- input asset references and checksums where feasible;
- provider/model and version;
- requested and actual output properties;
- status and audit trail;
- cost and quota metadata where available;
- QA results and approval state.

Separate development, test, and production records. Do not fabricate telemetry, completed jobs, provider responses, costs, or performance metrics.

## 8. Quality gates

A production cannot be marked APPROVED_MASTER until:
- image dimensions and technical metadata match the approved delivery profile;
- image and animation continuity pass review;
- audio channel layout, frequency balance, loudness, true peak, and clipping checks pass;
- synchronization and captions/subtitles are checked when applicable;
- rights, consent, and licensing are documented;
- output files are readable and checksummed;
- a human reviewer approves the final master.

Use explicit states such as BRIEF_READY, QUEUED, GENERATING, POST_PROCESSING, QA_PENDING, APPROVED_MASTER, FAILED, and CANCELLED.

## 9. Integration sequence

1. Preserve the existing Imperator Movie Ω UI and inspect its current state before edits.
2. Add requested-vs-actual output metadata to the production brief.
3. Add 8K and 12K target profiles without implying native provider support.
4. Expand audio profile selection and validation.
5. Define provider adapters and job lifecycle in the existing backend architecture.
6. Add secure server-side provider configuration and budget controls.
7. Add asset storage references and audit events.
8. Add QA gates and human approval.
9. Run typecheck, lint, tests, and a controlled sandbox job before any production activation.

## 10. Non-negotiable evidence rule

This document is a specification only. The skill is not operational until implementation, tests, provider connectivity, sample outputs, quality checks, and deployment are independently verified.

Never claim a render, xAI integration, 8K/12K master, surround mix, deployment, award, or revenue result without direct evidence.
