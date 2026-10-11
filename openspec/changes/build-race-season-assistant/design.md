## Context

See proposal.md. Specs: `specs/race-season-assistant/spec.md`.

## Goals / Non-Goals

**Goals:**
- Five-step build: scaffold → UI → stream → classify+SQL → golden queries.
- OpenAI-only inference (`OPENAI_API_KEY`).
- Shared Postgres attendees can inspect (Supabase SQL editor).

**Non-Goals:**
- Jev / TypeSafe / AI Gateway.
- Handbook corpus / in-repo MCP as the default knowledge path.
- Write mutations from the chatbot (read-only season queries).

## Decisions

1. **Classify then query (2A)**
   - `lib/classify.ts`: OpenAI Decisions API (`experimental_decide` + `choice`) for intents `list_races | start_list | count_riders | refuse`.
   - `raceHint` / `categoryHint` via lightweight heuristics (Decisions does not extract free text).
   - Rejected: tool-calling as sole router; rejected: Responses `Output.object` for intent-only routing (teach Decisions instead).

2. **Postgres over SQLite**
   - Schema mirrors raceplanner: `categories`, `races`, `start_list_entries`.
   - Seed from `data/seed/season.json`.
   - Client: `postgres` package via `DATABASE_URL`.

3. **MCP is homework**
   - Same `lib/queries.ts` can later be wrapped as MCP tools; not required for “done”.

4. **Streaming product shell unchanged**
   - `useChat` + UI message stream; show classifying / querying status in the UI where useful.

## Risks / Trade-offs

- **[Shared DB credentials]** → Prefer a read-only role; rotate after the workshop.
- **[Classification mistakes]** → Golden set + clear refuse path; optional confidence field later.
- **[Native `postgres` on serverless]** → Workshop uses local `next dev`; note connection pooling for deploy homework.

## Migration Plan

1. Archive handbook OpenSpec change; add `build-race-season-assistant`.
2. Ship migration + seed; wire classify/query/route.
3. Update UI, docs, deck.
