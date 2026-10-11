## Why

Across Sessions 1–3 attendees already practiced automation, context, MCP tools, and RAG scripts. Session 4’s job is composition: put an MCP-backed chatbot in the browser; not another RAG lecture, and not a second retrieval pipeline over the same handbook.

## What Changes

- Ship the companion lab [dl-school-chatbots](https://github.com/drublic/dl-school-chatbots) in five steps: scaffold → UI → wire streaming → MCP → query.
- Streaming chat UI with clear loading / error / stop states.
- **In-repo handbook MCP** (`mcp/handbook-server.ts`) over a bundled corpus (`data/handbook-corpus.json`); local search, no Pinecone, no second checkout.
- Chat API attaches MCP tools via the AI SDK MCP client (stdio); golden questions + refusal path.
- Secrets stay server-side only (`OPENAI_API_KEY` for the chat model).

## Non-goals

- A separate RAG step in this product (Session 3 already covered retrieval; tonight knowledge comes through MCP).
- Reveal slide-deck edits outside the apply target (deck may link to `/anatomy`).
- Vercel deploy, auth, rate limits (homework).
- Multi-agent orchestration or write-actions beyond handbook search/fetch.

## Capabilities

### New Capabilities

- `handbook-assistant`: Compose a browser chatbot; streaming UI + in-repo handbook MCP tools + golden queries.

### Modified Capabilities

- (none; greenfield)

## Impact

- Companion package with `ai`, `@ai-sdk/openai`, `@ai-sdk/react`, `@ai-sdk/mcp`, `@modelcontextprotocol/sdk`, `tsx`, `zod`.
- MCP runs from this repo (`npm run mcp` / automatic from `/api/chat`).
- Workshop deck stays at `dl-ai-chatbots`; apply implements the companion app.
