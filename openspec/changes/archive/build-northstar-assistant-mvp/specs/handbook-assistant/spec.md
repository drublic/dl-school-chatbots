## Purpose

Lets attendees assemble a browser chatbot (streaming UI plus an in-repo handbook MCP) and verify it with real questions they ask themselves.

## ADDED Requirements

### Requirement: Stepwise product attendees can run
The system MUST be buildable as a local Next.js app that a participant runs in the browser. After the full build path, a user MUST be able to open the app, send a handbook question, and see an assistant reply without a second repository or a terminal RAG script.

#### Scenario: Chatbot opens in the browser
- **WHEN** a participant finishes the wired app and opens the local URL
- **THEN** they see a chat interface they can type into
- **AND** sending a message produces an assistant reply in that UI

### Requirement: Streaming chat with recognizable states
The chat UI MUST stream assistant tokens as they arrive. The UI MUST expose recognizable states for at least: ready to send, in-progress (submitted/streaming), and error. While a reply is in progress, the user MUST be able to tell the system is working (and optionally stop). API keys MUST NOT appear in the browser.

#### Scenario: Hello streams with loading state
- **WHEN** a user sends "Hi, who are you?"
- **THEN** the UI shows an in-progress state
- **AND** the assistant identity streams into the message list progressively

#### Scenario: Failed request is visible
- **WHEN** the chat API fails (e.g. missing key or network error)
- **THEN** the UI surfaces an error state the user can recognize
- **AND** the user can attempt another message after recovery

### Requirement: In-repo handbook MCP from the chat API
After the streaming path works, the chat API MUST call the handbook MCP server shipped in this repository so the model can use its tools (at least document search). The MCP server MUST run against a bundled local corpus without requiring Pinecone or an external workshop checkout. The browser MUST NOT speak MCP directly; the server owns the MCP client lifecycle.

#### Scenario: MCP search used for a handbook question
- **WHEN** a user asks how many remote work days are allowed
- **THEN** the server-side chat path uses the handbook MCP tools
- **AND** the assistant answer is consistent with the handbook (3 remote days)

#### Scenario: MCP runs from this package alone
- **WHEN** a participant clones only this repository, installs deps, and sets `OPENAI_API_KEY`
- **THEN** `npm run mcp:smoke` finds the remote-work chunk
- **AND** `npm run dev` can answer handbook questions via MCP without `HANDBOOK_MCP_CWD` pointing elsewhere

### Requirement: Query verification and refusal
Users MUST be able to run a small golden question set in the chat UI. For questions outside the corpus (e.g. stock ticker), the assistant MUST refuse instead of inventing facts.

#### Scenario: Stock ticker refused
- **WHEN** a user asks for the company stock ticker
- **THEN** the assistant does not invent a ticker
- **AND** the reply states the answer is not available from the handbook
