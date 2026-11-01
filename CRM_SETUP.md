# KJS CRM & Inbox Ω — setup and deployment notes

## Included in this branch

- Existing B2B Kanban remains the lead pipeline.
- New `/painel → CRM & Inbox Ω` view provides a persistent conversation inbox.
- Conversation messages are stored in `crm_conversations` and `crm_messages`.
- The initial assistant is deterministic/rule-based; it is not an LLM integration.
- Operator login uses a signed, HttpOnly session cookie.
- Creating a conversation requires the operator to confirm that the contact was informed and that a lawful basis for recording exists.
- The WhatsApp link opens the supplied human support destination. It does not import or send WhatsApp messages.

## Required server secrets

Set these only in the hosting provider's secret manager; never expose them in Vite/browser variables:

- `KJS_CRM_ADMIN_PASSWORD`: a strong, unique operator password.
- `KJS_CRM_SESSION_SECRET`: at least 32 random characters.

If either secret is absent, CRM login deliberately returns HTTP 503 and the inbox RPC procedures remain inaccessible.

## Database rollout

The schema now includes `crm_conversations` and `crm_messages`. Before enabling the feature in a deployed environment:

1. Back up the Turso/libSQL database.
2. Run the project's schema sync from the web package: `bun run db:push`.
3. Deploy the application with both server secrets configured.
4. Verify login, conversation creation, message persistence, and logout in the deployed environment.

The database schema sync and production deployment have **not** been run by this change.

## WhatsApp / Meta Cloud API — not connected yet

To receive real WhatsApp messages and send replies from this inbox, configure the official WhatsApp Business Platform integration with:

- Meta Business app and approved WhatsApp Business Account.
- Phone Number ID and permanent access token stored server-side.
- Webhook callback URL, verify token, and signature verification using the Meta app secret.
- Message ID deduplication, retry handling, delivery-status processing, and explicit opt-in / opt-out handling.

Do not paste access tokens or app secrets into source files, browser code, or chat. Until this integration is completed, WhatsApp conversations are not automatically synchronized and the bot only responds to messages entered through the CRM's test interaction.

## Privacy and operations

Store only the minimum contact data needed. Provide a clear notice, document the applicable lawful basis, define a retention period, and support access/deletion requests. Restrict production access to authorized operators. Do not treat the consent confirmation checkbox as legal advice or as a substitute for a documented privacy process.
