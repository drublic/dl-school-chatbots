# DL School · Session 4 — Northstar Handbook Assistant

Companion repo for **B07/26 Module 4 · Implementing AI Features & Chatbots**.

You compose pieces from earlier sessions (especially the [Session 3 MCP handbook server](https://github.com/drublic/dl-school-agentic)) into a Next.js chatbot you run in the browser.

## Setup

```bash
git clone git@github.com:drublic/dl-school-chatbots.git
cd dl-school-chatbots
npm install
cp env.example .env.local
# fill OPENAI_API_KEY + OPENAI_MODEL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Workshop steps

See **[WORKSHOP.md](./WORKSHOP.md)** for the six-step build path:

1. Start development  
2. Initial interface  
3. Wire streaming  
4. Ask via MCP (Session 3 handbook server)  
5. Bring in RAG  
6. Query (golden questions)

This repo already includes a working streaming chat (steps 1–3). Step 4 turns on when you set `HANDBOOK_MCP_CWD` to your local `dl-school-agentic` clone. Step 5 is stubbed in `lib/retrieval.ts`.

## Related repos

| Repo | Role |
|---|---|
| [dl-school-agentic](https://github.com/drublic/dl-school-agentic) | Session 3 — MCP + RAG examples, handbook server |
| Workshop slides (`dl-ai-chatbots`) | Reveal deck for the live session |

## Stack

- Next.js (App Router) · TypeScript · Tailwind  
- Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`, `@ai-sdk/mcp`)  
- Pinecone (optional, Step 5)
