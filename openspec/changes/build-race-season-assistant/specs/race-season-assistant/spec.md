## Purpose

Lets attendees build a browser chatbot that classifies club race-season questions with the OpenAI Decisions API, answers from a shared Postgres database, and verifies with golden questions.

## ADDED Requirements

### Requirement: Stepwise product attendees can run
The system MUST be buildable as a local Next.js app. After the full build path, a user MUST be able to open the app, ask a season question, and see an assistant reply grounded in database rows (not invented calendar facts).

#### Scenario: Chatbot opens in the browser
- **WHEN** a participant runs the wired app and opens the local URL
- **THEN** they see a chat interface they can type into
- **AND** sending a message produces an assistant reply in that UI

### Requirement: Streaming chat with recognizable states
The chat UI MUST stream assistant tokens. The UI MUST expose recognizable states for ready, in-progress, and error. API keys MUST NOT appear in the browser.

#### Scenario: Hello streams with loading state
- **WHEN** a user sends "Hi, who are you?"
- **THEN** the UI shows an in-progress state
- **AND** the assistant identity streams into the message list

### Requirement: OpenAI intent classification before data access
For season questions, the chat API MUST classify the latest user message into a typed intent (`list_races`, `start_list`, `count_riders`, or `refuse`) using the OpenAI Decisions API (`choice`) before running SQL. Free-text filters such as race or category MAY use heuristics. Classification MUST use `OPENAI_API_KEY` directly (no AI Gateway requirement).

#### Scenario: Start-list question is classified
- **WHEN** a user asks who rides "Rund um Merken" for Amateure
- **THEN** the server classifies intent as `start_list` (with a race hint when possible)
- **AND** proceeds to query the database for that race

### Requirement: Postgres season queries
The system MUST read season data from Postgres tables for categories, races, and start-list entries seeded from the raceplanner season dataset. Query helpers MUST be parameterized. The chatbot path is read-only.

#### Scenario: Count riders for Rund um Merken (Amateure)
- **WHEN** classification yields `count_riders` for Amateur "Rund um Merken"
- **THEN** the assistant answer states **6** participants
- **AND** the count matches `start_list_entries` for that race

#### Scenario: Cancelled race stays visible
- **WHEN** a user asks about "Rund in Rheinbach" for Amateure
- **THEN** the system can report that the race is cancelled
- **AND** does not invent a start list

### Requirement: Query verification and refusal
Users MUST be able to run a small golden question set. For off-domain questions, the assistant MUST refuse instead of inventing season facts.

#### Scenario: Off-domain refused
- **WHEN** a user asks for the company stock ticker (or similar off-domain)
- **THEN** classification yields `refuse` (or the reply refuses)
- **AND** the assistant does not invent a ticker or race result
