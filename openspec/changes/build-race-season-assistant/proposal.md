## Why

Session 4 should ship a browser chatbot on familiar raceplanner data: classify the user question, query a shared Postgres season database, then stream a grounded answer. Handbook MCP duplicated Session 3; OpenAI structured classification + SQL matches “AI features” better.

## What Changes

- Companion becomes a **race-season assistant** (not handbook).
- Shared **Postgres** schema + seed from raceplanner `season.json` (Supabase-friendly).
- Chat API: **classify** with OpenAI Decisions API (`experimental_decide` + `choice` intents; heuristics for race/category), then **branch** to SQL helpers, then **streamText** with query context.
- Golden questions for list / start list / count / refuse.
- MCP wrapping of the same query helpers is **optional homework**.

## Non-goals

- TypeSafe/Jev or Vercel AI Gateway.
- Vector RAG / Pinecone.
- Rebuilding the raceplanner calendar UI.
- Live MCP on the critical path.

## Capabilities

### New Capabilities

- `race-season-assistant`: Streaming chat UI that classifies club race questions and answers from Postgres season data.

### Modified Capabilities

- (none)

## Impact

- Deps: `postgres` (or equivalent), keep `ai` / `@ai-sdk/openai` / `@ai-sdk/react` / `zod`.
- Env: `OPENAI_API_KEY`, `DATABASE_URL` (optional `OPENAI_MODEL`).
- Deck + WORKSHOP reframe to classify → query → answer.
