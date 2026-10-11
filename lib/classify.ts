import { experimental_decide } from "ai";
import { openai } from "@ai-sdk/openai";

export type SeasonIntent =
  | "list_races"
  | "start_list"
  | "count_riders"
  | "refuse";

export type ClassifiedIntent = {
  intent: SeasonIntent;
  /** Race name fragment when heuristics find one; else null */
  raceHint: string | null;
  /** Amateure | Elite-Amateure | Frauen when mentioned; else null */
  categoryHint: string | null;
  confidence: "high" | "medium" | "low";
};

const INTENT_CRITERIA = {
  list_races:
    "Calendar / which races exist / overview of the season or a category",
  start_list: "Who rides / start list / participants names for a named race",
  count_riders: "How many riders / participant count for a named race",
  refuse:
    "Off-domain, pure chitchat, stock tickers, weather, or impossible from season data",
} as const;

const CATEGORY_PATTERNS: { hint: string; re: RegExp }[] = [
  { hint: "Elite-Amateure", re: /\belite[-\s]?amateure\b/i },
  { hint: "Amateure", re: /\bamateure\b/i },
  { hint: "Frauen", re: /\bfrauen\b/i },
];

/** Decisions pick the SQL branch; heuristics extract free-text filters. */
export function extractHints(userText: string): {
  raceHint: string | null;
  categoryHint: string | null;
} {
  let categoryHint: string | null = null;
  for (const { hint, re } of CATEGORY_PATTERNS) {
    if (re.test(userText)) {
      categoryHint = hint;
      break;
    }
  }

  const racePatterns = [
    /\brund\s+um\s+([A-Za-zÄÖÜäöüß][\wÄÖÜäöüß-]*)/i,
    /\brund\s+in\s+([A-Za-zÄÖÜäöüß][\wÄÖÜäöüß-]*)/i,
    /(?:on|für|for)\s+([A-Za-zÄÖÜäöüß][\wÄÖÜäöüß\s-]{2,40}?)(?:\s+for|\s+für|\s*$|[?.!])/i,
  ];

  let raceHint: string | null = null;
  for (const re of racePatterns) {
    const m = userText.match(re);
    if (m?.[1]) {
      const raw = m[0].match(/\brund\s+(?:um|in)\s+/i)
        ? m[0].replace(/\s+/g, " ").trim()
        : m[1].trim();
      const cleaned = raw
        .replace(/\b(elite[-\s]?amateure|amateure|frauen)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned.length >= 3) {
        raceHint = cleaned;
        break;
      }
    }
  }

  return { raceHint, categoryHint };
}

function confidenceFromProbability(
  p: number | undefined,
): ClassifiedIntent["confidence"] {
  if (p == null) return "medium";
  if (p >= 0.85) return "high";
  if (p >= 0.55) return "medium";
  return "low";
}

export async function classifyQuestion(
  userText: string,
): Promise<ClassifiedIntent> {
  const decisionModel =
    process.env.OPENAI_DECISION_MODEL || "gpt-6-luna";
  const { raceHint, categoryHint } = extractHints(userText);

  try {
    const result = await experimental_decide({
      model: openai.decisionModel(decisionModel),
      state: {
        question: userText,
        domain:
          "German club cycling race season: Amateure, Elite-Amateure, Frauen calendar and start lists",
      },
      questions: {
        intent: {
          type: "choice",
          instructions:
            "Pick the SQL branch for this race-season assistant question.",
          criteria: INTENT_CRITERIA,
        },
      },
    });

    const answer = result.answers.intent;
    const intent = answer.choice;
    const selectedProbability = answer.probabilities?.[intent];

    return {
      intent,
      raceHint,
      categoryHint,
      confidence: confidenceFromProbability(selectedProbability),
    };
  } catch (error) {
    console.error("[classify] decisions", error);
    return {
      intent: "refuse",
      raceHint,
      categoryHint,
      confidence: "low",
    };
  }
}
