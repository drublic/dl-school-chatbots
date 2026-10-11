import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { classifyQuestion } from "@/lib/classify";
import { countRiders, getStartList, listRaces } from "@/lib/queries";

export const maxDuration = 60;

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "user") continue;
    const text = message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("\n")
      .trim();
    if (text) return text;
  }
  return "";
}

async function buildGrounding(userText: string): Promise<{
  intent: string;
  context: string;
}> {
  // Greetings / identity: skip DB
  if (/^(hi|hello|hey|hallo|who are you)\b/i.test(userText.trim())) {
    return {
      intent: "chitchat",
      context:
        "The user is greeting you. Introduce yourself briefly as the club race-season assistant. Do not invent race facts.",
    };
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return {
      intent: "no_db",
      context:
        "DATABASE_URL is not configured. Tell the user the season database is not connected yet; do not invent race results.",
    };
  }

  const classified = await classifyQuestion(userText);
  const { intent, raceHint, categoryHint } = classified;

  if (intent === "refuse") {
    return {
      intent,
      context:
        "Classification: refuse. Say you can only answer from the club race-season database. Do not invent facts (including stock tickers).",
    };
  }

  if (intent === "list_races") {
    const races = await listRaces({ categoryHint });
    return {
      intent,
      context: `Classification: list_races.\nQuery result JSON:\n${JSON.stringify(races, null, 2)}\nAnswer from this data only.`,
    };
  }

  if (intent === "start_list") {
    if (!raceHint?.trim()) {
      return {
        intent,
        context:
          "Classification: start_list, but no race name was extracted. Ask which race (and category if needed).",
      };
    }
    const start = await getStartList({ raceHint, categoryHint });
    return {
      intent,
      context: `Classification: start_list.\nQuery result JSON:\n${JSON.stringify(start, null, 2)}\nAnswer from this data only. If null, say the race was not found.`,
    };
  }

  if (intent === "count_riders") {
    if (!raceHint?.trim()) {
      return {
        intent,
        context:
          "Classification: count_riders, but no race name was extracted. Ask which race (and category if needed).",
      };
    }
    const count = await countRiders({ raceHint, categoryHint });
    return {
      intent,
      context: `Classification: count_riders.\nQuery result JSON:\n${JSON.stringify(count, null, 2)}\nAnswer from this data only. If null, say the race was not found.`,
    };
  }

  return {
    intent: "refuse",
    context: "Unknown intent. Refuse politely.",
  };
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "Missing OPENAI_API_KEY in .env.local" },
      { status: 500 },
    );
  }

  const modelId = process.env.OPENAI_MODEL || "gpt-5-mini";
  const userText = lastUserText(messages);

  let grounding: { intent: string; context: string };
  try {
    grounding = await buildGrounding(userText);
  } catch (error) {
    console.error("[api/chat] classify/query", error);
    return Response.json(
      {
        error:
          "Classify/query failed. Check OPENAI_API_KEY, DATABASE_URL, and that the season DB is seeded.",
      },
      { status: 500 },
    );
  }

  const instructions = `You are the club race-season assistant for a German cycling club.
Answer helpfully in the user's language when possible.
Use ONLY the grounding context below for calendar / start-list facts. Never invent riders or counts.
If grounding says refuse or data is missing, say so clearly.

Intent: ${grounding.intent}

Grounding:
${grounding.context}`;

  try {
    const result = streamText({
      model: openai(modelId),
      instructions,
      messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("[api/chat]", error);
    return Response.json(
      { error: "Something went wrong. Check the server logs." },
      { status: 500 },
    );
  }
}
