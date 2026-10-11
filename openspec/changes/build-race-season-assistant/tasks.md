## 1. Start development

- [x] 1.1 Companion Next.js app runs with `npm run dev`
- [x] 1.2 AI SDK deps (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`, `zod`)
- [x] 1.3 `env.example` documents `OPENAI_API_KEY` + `DATABASE_URL` (no Gateway / TypeSafe keys)

## 2. Initial interface

- [x] 2.1 `/chat` is a blank shell attendees implement (`app/chat/chat-starter.tsx`); `/reference` is finished
- [x] 2.2 Interactive `/anatomy` demo (race-season framing)
- [x] 2.3 Hub at `/` lists the five workshop steps

## 3. Wire streaming

- [x] 3.1 `/api/chat` streams UI messages
- [x] 3.2 UI status / stop / error states

## 4. Database + classify + query

- [x] 4.1 Postgres migration + season seed (`data/seed/season.json`)
- [x] 4.2 `lib/db.ts` + `lib/queries.ts` (list / start list / count)
- [x] 4.3 `lib/classify.ts` via Decisions API `experimental_decide` + `choice` (hints via heuristics)
- [x] 4.4 Route switches on intent and injects query context into `streamText`
- [ ] 4.5 Live verify: Amateur Merken count → **6**; off-domain refuse

## 5. Query

- [x] 5.1 Golden questions in `data/golden-questions.md`
- [ ] 5.2 Live verify golden set in the UI
- [x] 5.3 README / WORKSHOP document OpenAI + DATABASE_URL; MCP homework optional

## 6. Homework (optional)

- [ ] 6.1 Wrap `lib/queries.ts` as MCP tools (out of critical path)
