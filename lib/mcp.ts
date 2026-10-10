import { createMCPClient } from "@ai-sdk/mcp";
import { Experimental_StdioMCPTransport } from "@ai-sdk/mcp/mcp-stdio";

/**
 * Step 4 — connect to the Session 3 handbook MCP server over stdio.
 * Set HANDBOOK_MCP_CWD to your local dl-school-agentic checkout.
 * Returns null when MCP is not configured (Steps 1–3 still work).
 */
export async function createHandbookMcpClient() {
  const cwd = process.env.HANDBOOK_MCP_CWD?.trim();
  if (!cwd) return null;

  const command = process.env.HANDBOOK_MCP_COMMAND?.trim() || "npx";
  const args = (
    process.env.HANDBOOK_MCP_ARGS?.trim() ||
    "tsx,example/mcp/handbook-server.ts"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const transport = new Experimental_StdioMCPTransport({
    command,
    args,
    cwd,
    env: {
      ...process.env,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
      PINECONE_API_KEY: process.env.PINECONE_API_KEY ?? "",
    },
  });

  return createMCPClient({ transport });
}
