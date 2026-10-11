## 1. Start development

- [x] 1.1 Companion repo `dl-school-chatbots` scaffolds Next.js (App Router, TypeScript, Tailwind); verify `npm run dev` opens `http://localhost:3000`
- [x] 1.2 AI SDK + MCP deps installed (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`, `@ai-sdk/mcp`, `@modelcontextprotocol/sdk`, `tsx`, `zod`)
- [x] 1.3 `env.example` documents OpenAI + optional MCP overrides (no Pinecone; no `NEXT_PUBLIC_` secrets)

## 2. Initial interface

- [x] 2.1 Chat shell on `app/page.tsx` (message list, input, send, empty state)
- [x] 2.2 `useChat` + `DefaultChatTransport` → `/api/chat`; render `message.parts`
- [x] 2.3 Interactive `/anatomy` demo page with numbered pins

## 3. Wire streaming

- [x] 3.1 `app/api/chat/route.ts` with `streamText` + UI message stream + Northstar instructions
- [x] 3.2 UI surfaces status (disable send while busy, error banner, retry by sending again)
- [x] 3.3 `stop()` while streaming

## 4. Ask via MCP (in-repo)

- [x] 4.1 `mcp/handbook-server.ts` + `mcp/handbook-store.ts` + `data/handbook-corpus.json` (local search)
- [x] 4.2 `lib/mcp.ts` + route: stdio MCP client defaults to this repo; tools passed to `streamText`; client closed on stream end
- [ ] 4.3 Live verify: remote-days question → MCP search → answer **3**
- [x] 4.4 UI shows “Searching handbook…” for tool parts
- [x] 4.5 `npm run mcp:smoke` finds the remote-work chunk without external services

## 5. Query

- [x] 5.1 Golden question list in `data/golden-questions.md` / WORKSHOP.md
- [ ] 5.2 Live verify stock-ticker refusal in the UI
- [x] 5.3 Companion README documents clone/run; MCP on by default; secrets stay server-side
