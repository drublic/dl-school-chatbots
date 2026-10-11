import Link from "next/link";

const STEPS = [
  {
    n: 1,
    title: "Start development",
    body: "Install, set OPENAI_API_KEY + DATABASE_URL, seed the season DB, run the app.",
    files: "npm run db:seed · npm run dev",
  },
  {
    n: 2,
    title: "Initial interface",
    body: "From scratch in /chat: message list, input, Send, useChat → /api/chat. Follow the OpenSpec change.",
    files: "app/chat/chat-starter.tsx · openspec/changes/build-race-season-assistant/",
  },
  {
    n: 3,
    title: "Wire streaming",
    body: "Connect status, Stop, and error in your UI. Study streamText in the reference route when stuck.",
    files: "app/chat/chat-starter.tsx · app/api/chat/route.ts",
  },
  {
    n: 4,
    title: "Classify + query Postgres",
    body: "Decisions API choice for intent; heuristics for race/category; then listRaces / getStartList / countRiders.",
    files: "lib/classify.ts · lib/queries.ts · route grounding",
  },
  {
    n: 5,
    title: "Query",
    body: "Run golden questions in your /chat build; use /reference only to compare.",
    files: "data/golden-questions.md",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-8">
      <header className="mb-8 border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          DL School · Session 4
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Race Season Assistant
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Classify the question, then query the season database. Full write-up in{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            WORKSHOP.md
          </code>
          .
        </p>
        <nav className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link
            href="/anatomy"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-800 hover:border-zinc-400"
          >
            Anatomy tour
          </Link>
          <Link
            href="/chat"
            className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-800"
          >
            Your chat
          </Link>
          <Link
            href="/reference"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-800 hover:border-zinc-400"
          >
            Reference
          </Link>
        </nav>
      </header>

      <ol className="flex flex-col gap-3">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="flex gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
              {step.n}
            </span>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">{step.body}</p>
              <p className="mt-2 text-xs text-zinc-500">
                <code className="rounded bg-zinc-100 px-1.5 py-0.5">
                  {step.files}
                </code>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-xs text-zinc-500">
        Stuck? Peek at{" "}
        <Link href="/reference" className="font-medium text-blue-600 underline">
          /reference
        </Link>
        . Extend{" "}
        <Link href="/chat" className="font-medium text-blue-600 underline">
          /chat
        </Link>
        . Optional homework:{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5">mcp/README.md</code>.
      </p>
    </div>
  );
}
