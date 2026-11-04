import { db } from "../database";
import * as schema from "../database/schema";
import { createObservedEvent } from "./event-contract";

export async function persistOperationalEvent(input: {
  event_type: string;
  source_component: string;
  status: string;
  actor_id?: string;
  correlation_id?: string;
  payload?: Record<string, unknown>;
}) {
  const event = createObservedEvent({
    event_type: input.event_type,
    source_component: input.source_component,
    correlation_id: input.correlation_id || crypto.randomUUID(),
    status: input.status,
    actor_id: input.actor_id || "kjs-application",
    payload: input.payload,
  });
  await db.insert(schema.ecosystemEvents).values({
    eventId: event.event_id,
    eventType: event.event_type,
    schemaVersion: event.schema_version,
    occurredAt: event.occurred_at,
    sourceSystem: event.source_system,
    sourceComponent: event.source_component,
    sourceVersion: event.source_version,
    environment: event.environment,
    eventClass: event.event_class,
    correlationId: event.correlation_id,
    actorType: event.actor_type,
    actorId: event.actor_id,
    status: event.status,
    payloadJson: JSON.stringify(event.payload || {}),
  });
  return event.event_id;
}
