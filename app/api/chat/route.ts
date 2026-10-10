import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { createHandbookMcpClient } from "@/lib/mcp";

export const maxDuration = 60;

const INSTRUCTIONS = `You are the Northstar Labs handbook assistant.
Answer helpfully. When handbook/policy tools are available, use them for policy questions.
If the tools do not support an answer, say you don't know based on the handbook — never invent policy facts (including stock tickers).`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "Missing OPENAI_API_KEY in .env.local" },
      { status: 500 },
    );
  }

  const modelId = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const mcpClient = await createHandbookMcpClient();
  const tools = mcpClient ? await mcpClient.tools() : undefined;

  try {
    const result = streamText({
      model: openai(modelId),
      instructions: INSTRUCTIONS,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: tools ? stepCountIs(5) : undefined,
      onEnd: async () => {
        await mcpClient?.close();
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    await mcpClient?.close();
    console.error("[api/chat]", error);
    return Response.json(
      { error: "Something went wrong. Check the server logs." },
      { status: 500 },
    );
  }
}
