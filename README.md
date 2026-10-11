# DL School · Session 4: Race Season Assistant

Companion repo for **B07/26 Module 4 · Implementing AI Features & Chatbots**.

Build a Next.js chatbot that **classifies** club race questions with OpenAI structured output, then **queries** a shared Postgres season database (raceplanner data). **OpenSpec** holds the intent next to the code.

## Setup

```bash
git clone git@github.com:drublic/dl-school-chatbots.git
cd dl-school-chatbots
npm install
cp env.example .env.local
# OPENAI_API_KEY + DATABASE_URL (Supabase Postgres connection string)
DATABASE_URL=... npm run db:seed
npm run dev
```

| URL | Role |
|---|---|
| [localhost:3000](http://localhost:3000) | Workshop hub + five steps |
| [/anatomy](http://localhost:3000/anatomy) | Chat UI tour |
| [/chat](http://localhost:3000/chat) | **Your build** — blank shell; implement via OpenSpec |
| [/reference](http://localhost:3000/reference) | Finished reference chat |

## Season database

| Path | Role |
|---|---|
| `supabase/migrations/20261011120000_race_season.sql` | Schema |
| `data/seed/season.json` | Season seed (raceplanner + rad-net.de NRW Straße 2026) |
| `scripts/seed-season.ts` | `npm run db:seed` |
| `lib/queries.ts` | Parameterized read queries |
| `lib/classify.ts` | OpenAI Decisions API intent (`choice`) + hint heuristics |

Trainer: create one Supabase (or other Postgres) project, share a **read-only** `DATABASE_URL` when possible, run the seed once.

## OpenSpec

```bash
openspec show build-race-season-assistant
openspec status --change build-race-season-assistant
```

Change folder: `openspec/changes/build-race-season-assistant/`  
Follow **[WORKSHOP.md](./WORKSHOP.md)**.

## Workshop steps

1. Start development  
2. Initial interface — from scratch in `app/chat/chat-starter.tsx` (OpenSpec change)  
3. Wire streaming (UI states; study `app/api/chat/route.ts`)  
4. Classify + query Postgres (Decisions `choice`)  
5. Query (golden questions in `/chat`)

Optional homework: MCP over the same queries (`mcp/README.md`).

## Docs

| Topic | Link |
|---|---|
| AI SDK · Chatbot | [sdk.vercel.ai/docs/ai-sdk-ui/chatbot](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot) |
| AI SDK · Decisions | [ai-sdk.dev/docs/ai-sdk-core/decisions](https://ai-sdk.dev/docs/ai-sdk-core/decisions) |
| OpenAI provider | [@ai-sdk/openai](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) |
| OpenAI API keys | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Next.js App Router | [nextjs.org/docs/app](https://nextjs.org/docs/app/getting-started) |

## Related

| Repo | Role |
|---|---|
| [raceplanner](https://github.com/drublic) / local `raceplanner` | Prior MVP; season Excel → SQLite calendar |
| Workshop slides (`dl-ai-chatbots`) | Reveal deck |

## Stack

Next.js · TypeScript · Tailwind · Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`) · Zod · Postgres (`postgres`)
