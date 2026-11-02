# KJS IMPERATOR Ω — Implementation and Certification Boundaries

## Runtime truth
A source file, UI, task definition, planned integration, or successful GitHub write does not prove runtime execution. Certification requires independently retrievable evidence for the exact claim and environment.

## Data classes
- `production_verified`: provider-originated or system-originated record with source identity, event ID, timestamp, environment, validation result, and integrity digest.
- `manual_reported`: entered by a human; visible only with an explicit manual label.
- `simulation`: synthetic or test-only; never included in production metrics.
- `unverified`: source or integrity not yet established; excluded from certified KPIs.

## Tenant isolation
A tenant header is a selector, never an identity credential. Private reads and writes require a cryptographically verified principal, an explicit active membership lookup, role authorization, and tenant-scoped database predicates. No route may infer membership from the first available membership row. Until the tenant schema, membership lookup, and migration are live, private tenant data must not be certified as isolated.

## External actions
Publishing, messaging, financial actions, and provider mutations require a human approval reference, idempotency, an audit record, and a verified result from the provider. Planning or returning a task contract is not execution.

## Release gate
A release is certified only after migrations are generated and reviewed, tests/typecheck/lint/build pass, CI reports success for the exact commit, and the target deployment reports a healthy release. A Git commit alone is not a deployment.
