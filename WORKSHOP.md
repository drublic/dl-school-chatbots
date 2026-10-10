# Session 4 · Build path

Teaching point: **compose what you already built** into a product.  
Success: a chatbot **you wired**, open in the browser.

## Step 1 — Start development

```bash
npm install
cp env.example .env.local
npm run dev
```

Checkpoint: Next.js app at `localhost:3000`.

## Step 2 — Initial interface

Files: `app/page.tsx`

- Message list, input, send  
- `useChat` + `DefaultChatTransport` → `/api/chat`  
- Render `message.parts`

## Step 3 — Wire streaming

Files: `app/api/chat/route.ts`

- `streamText` + UI message stream  
- UI states: ready / streaming / error / optional Stop  
- Ask: “Hi, who are you?”

## Step 4 — Ask via MCP

Reuse Session 3: [dl-school-agentic](https://github.com/drublic/dl-school-agentic) `example/mcp/handbook-server.ts`.

1. Clone/install Session 3 repo and set its `.env` (`OPENAI_API_KEY`, `PINECONE_API_KEY`).  
2. In this repo’s `.env.local`:

```bash
HANDBOOK_MCP_CWD=/absolute/path/to/dl-school-agentic
PINECONE_API_KEY=...   # also needed by the MCP child process
```

3. Restart `npm run dev`.  
4. Ask: “How many remote work days per month?” → expect **3**.

Implementation lives in `lib/mcp.ts` (stdio via `@ai-sdk/mcp/mcp-stdio`).

## Step 5 — Bring in RAG

Implement `lib/retrieval.ts`:

- Embed with `OPENAI_EMBEDDING_MODEL` (must match Session 3 ingest)  
- Query Pinecone `PINECONE_INDEX`  
- Show citation chips (`source` + `page`) in the UI  

MCP already searches the corpus — RAG here is about grounding UX / citations.

## Step 6 — Query

Run in your UI:

| Ask | Expect |
|---|---|
| How many remote work days per month? | 3 days |
| How many PTO days for full-time? | 20 |
| Parental leave for primary caregivers? | 16 weeks |
| What’s our stock ticker? | Refuse — not in handbook |

## Catch-up tags (trainer)

Optional git tags after live milestones: `step-3-streaming`, `step-4-mcp`, `step-6-done`.
