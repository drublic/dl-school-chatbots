## Context

See proposal.md. Session 4 composes a **product** around one knowledge path: the handbook MCP shipped inside this repo. Specs: `specs/handbook-assistant/spec.md`.

## Goals / Non-Goals

**Goals:**
- Five-step build: scaffold → UI → wire → MCP → query.
- Short conceptual surface for streaming + error states.
- Handbook MCP runs autonomously from this package (local corpus, stdio).

**Non-Goals:**
- Re-teaching embeddings / Pinecone ingest.
- A second RAG wiring step over the same handbook.
- Deploy/auth/eval harness (homework).
- Browser-side MCP.

## Decisions

1. **MCP-only knowledge path**
   - Early: empty chat that streams with no tools.
   - Mid: attach in-repo MCP (`createMCPClient` → `tools()` → `streamText`).
   - Late: golden queries + refusal.
   - Rejected: MCP + separate Pinecone RAG; duplicate search over the same facts.

2. **In-repo MCP, local corpus**
   - Server: `mcp/handbook-server.ts` (MCP SDK stdio).
   - Store: `mcp/handbook-store.ts` + `data/handbook-corpus.json` (lexical search).
   - Client: `lib/mcp.ts` spawns `node_modules/.bin/tsx` + server path; `cwd` defaults to `process.cwd()`.
   - Opt out with `HANDBOOK_MCP=0`.
   - Rejected: depending on `dl-agentic` checkout + Pinecone keys for the room.

3. **Streaming + error recognition in the product shell**
   - `useChat` status: `ready` | `submitted` | `streaming` | `error`.
   - Spinner / disable send; generic error + retry; optional `stop()`.
   - No keys with `NEXT_PUBLIC_`.

4. **App location**
   - Companion: [drublic/dl-school-chatbots](https://github.com/drublic/dl-school-chatbots).
   - Deck: `dl-ai-chatbots`.

## Risks / Trade-offs

- **[Stdio MCP in Next.js]** Process spawn quirks on serverless → Mitigation: local `next dev` for the workshop; note HTTP MCP for deploy homework.
- **[Lexical search quality]** Not vector RAG → Mitigation: small curated corpus; golden questions match distinctive terms; Session 3 remains the RAG deep-dive.
- **[SDK API churn]** → Mitigation: pin versions; follow current `@ai-sdk/mcp` docs.

## Migration Plan

1. Scaffold + UI + streaming (no tools).
2. Enable in-repo MCP (default on); verify remote-days → **3**.
3. Run golden set + refusal.
4. Optional catch-up tags between steps.

Rollback: remove MCP wiring; corpus stays as data.
