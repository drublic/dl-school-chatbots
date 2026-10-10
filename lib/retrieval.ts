/**
 * Step 5 — RAG helper (stub).
 *
 * Implement:
 * 1. embed(query) with OPENAI_EMBEDDING_MODEL (must match Session 3 ingest)
 * 2. Pinecone query against PINECONE_INDEX (workshop-shared)
 * 3. map matches → { text, source, page, score }
 *
 * Until then, MCP tools from Step 4 already search the same corpus.
 */

export type HandbookChunk = {
  text: string;
  source?: string;
  page?: string | number;
  score?: number;
};

export async function retrieveHandbook(
  _query: string,
  _opts?: { topK?: number },
): Promise<HandbookChunk[]> {
  throw new Error(
    "Step 5: implement retrieveHandbook in lib/retrieval.ts (see WORKSHOP.md)",
  );
}
