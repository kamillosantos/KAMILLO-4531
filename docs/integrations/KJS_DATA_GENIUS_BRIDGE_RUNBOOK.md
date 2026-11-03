# KJS Data Genius Bridge — Activation Runbook

## Scope
Connect the IMPRRSDOR durable event outbox to the KAMILLO-4531 Data Genius ledger. This bridge transports observed operational events only. It does not make uninstrumented services appear connected.

## Receiver (KAMILLO-4531)
1. Apply the standalone SQL file `packages/web/migrations/0001_data_genius.sql` to the configured Turso/libSQL database through the approved SQL migration process.
2. Confirm that table `ecosystem_events` and its indexes exist.
3. Configure `DATA_GENIUS_INGEST_TOKEN` in the server secret manager. Use a unique random secret with at least 32 characters.
4. Build and start the Bun application. The server entrypoint imports the default Hono app from `src/api/index.ts`.
5. Open `/painel`, authenticate to CRM, then select **Data Genius · Events**.

## Sender (IMPRRSDOR)
1. Configure `DATA_GENIUS_INGEST_URL` as the HTTPS URL ending in `/api/observability/ingest`.
2. Configure `DATA_GENIUS_INGEST_TOKEN` with exactly the same secret as the receiver.
3. Restart the IMPRRSDOR service. Startup reports whether the forwarder is enabled; it never prints the secret.
4. Generate one legitimate consented tracking event or lead through the application.
5. Verify the source outbox status and the corresponding row in the Data Genius panel.

## Delivery semantics
- The source outbox persists events before forwarding.
- Event IDs are stable across retries; the receiver has a unique event ID constraint.
- Successful receiver responses create a delivery receipt at the sender.
- Transient failures use exponential retry backoff, capped at one hour.
- The sender does not retry already delivered events.
- A missing URL/token leaves the forwarder `NOT_CONFIGURED`; no external delivery is claimed.

## Acceptance checks
- [ ] Migration applied and ledger table exists.
- [ ] Receiver token configured server-side; no secret committed to Git.
- [ ] Sender URL and same token configured server-side.
- [ ] Both applications pass their branch CI.
- [ ] A real consented lead or tracking event appears in the ledger with source `IMPRRSDOR`.
- [ ] Duplicate delivery does not create a second ledger row.
- [ ] CRM session is required to query the ledger.

## Rollback
Remove `DATA_GENIUS_INGEST_URL` and `DATA_GENIUS_INGEST_TOKEN` from the IMPRRSDOR runtime and restart it. Local event capture and the durable outbox continue; external forwarding stops. Do not drop the receiver table as part of a routine rollback.

## Release boundary
This runbook does not apply the migration, set production secrets, restart production services, or deploy either repository. Those are explicit operational activation steps and require the account/environment owner.
