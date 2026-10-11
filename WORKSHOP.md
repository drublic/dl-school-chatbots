# Session 4 · Build path

Teaching point: **classify the question, then query the season DB**.  
Success: a race-season chatbot **you wired**, open in the browser.

**Routes**

| URL | Role |
|---|---|
| `/` | Workshop hub + these five steps |
| `/anatomy` | Numbered UI tour |
| `/chat` | **Your build** — blank shell; implement from OpenSpec |
| `/reference` | Finished chat — peek when stuck |

Shared finished backend (for `/reference` and once you wire `/chat`): `/api/chat` + `lib/classify.ts` + `lib/queries.ts`.

**OpenSpec is the map.** Implement tasks from:

`openspec/changes/build-race-season-assistant/`

| Artifact | Use it for |
|---|---|
| `proposal.md` | Why classify + Postgres |
| `specs/race-season-assistant/spec.md` | What “done” means |
| `design.md` | Wire order: UI → stream → classify → SQL → query |
| `tasks.md` | Checklist |

```bash
openspec show build-race-season-assistant
openspec status --change build-race-season-assistant
# In Cursor: /opsx-apply build-race-season-assistant  (against /chat)
```

---

## Step 1: Start development

```bash
npm install
cp env.example .env.local
# set OPENAI_API_KEY + DATABASE_URL
DATABASE_URL=... npm run db:seed
npm run dev
```

Checkpoint: hub at `localhost:3000`. Tour: `/anatomy`. Blank workspace: `/chat` (not chatting yet). Peek: `/reference`.

Docs: [Next.js App Router](https://nextjs.org/docs/app/getting-started)

## Step 2: Initial interface

File: `app/chat/chat-starter.tsx` — **starts empty**. Add message list, input, Send, `useChat` → `/api/chat`.

Maps to UI anatomy **#1–3, #8**.

Docs: [Chatbot guide](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot) · [useChat](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat)

## Step 3: Wire streaming

In **your** UI: busy state, Stop, errors.  
Study `app/api/chat/route.ts` (`streamText` + UI message stream) — already shipped for `/reference`; re-read the OpenSpec design if you re-implement pieces.

Maps to anatomy **#2, #6, #7, #9**.

Docs: [Decisions](https://ai-sdk.dev/docs/ai-sdk-core/decisions) · [UI stream protocol](https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol)

## Step 4: Classify + query Postgres

Follow the OpenSpec spec/design. Reference implementations:

- `lib/classify.ts` — OpenAI **Decisions API** (`experimental_decide` + `choice` for intent); heuristics for `raceHint` / `categoryHint`  
- `lib/queries.ts` — `listRaces` / `getStartList` / `countRiders`  
- Route switches on intent and injects JSON grounding into `streamText`

Teaching split: **Decisions** pick the SQL branch; **heuristics** (or a later Responses extract) fill free-text filters.

Ask (in **your** `/chat` once wired): “How many riders on Rund um Merken for Amateure?” → **6**.

Maps to anatomy **#4–5**.

Schema: `supabase/migrations/20261011120000_race_season.sql`  
Seed: `data/seed/season.json` via `npm run db:seed`

## Step 5: Query

Run `data/golden-questions.md` in `/chat`. Compare with `/reference` if needed. Tick live-verify when refusal works.

## Homework (optional)

Wrap `lib/queries.ts` as MCP tools; see `mcp/README.md`.
