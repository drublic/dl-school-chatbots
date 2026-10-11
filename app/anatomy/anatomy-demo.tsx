"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const LEGEND = [
  {
    n: 1,
    title: "Interface shell",
    desc: "App chrome: title and layout you scaffold first",
  },
  {
    n: 2,
    title: "Assistant message",
    desc: "Bot reply · streamed tokens · message.parts text",
  },
  {
    n: 3,
    title: "User message",
    desc: "What you typed · sendMessage({ text })",
  },
  {
    n: 4,
    title: "Decisions → query",
    desc: "experimental_decide (choice) then season SQL",
  },
  {
    n: 5,
    title: "Grounded answer",
    desc: "Facts from Postgres query JSON injected into the reply",
  },
  {
    n: 6,
    title: "Streaming / loading",
    desc: "submitted / streaming: system is alive",
  },
  {
    n: 7,
    title: "Error state",
    desc: "Recognizable failure · no raw keys or stacks",
  },
  {
    n: 8,
    title: "Composer",
    desc: "Input + Send · disabled while busy",
  },
  {
    n: 9,
    title: "Stop",
    desc: "Abort in-flight stream · stop()",
  },
] as const;

const DEMO_SEED: UIMessage[] = [
  {
    id: "demo-assistant-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi, I’m the race-season assistant. Ask me about the club calendar or start lists.",
      },
    ],
  },
  {
    id: "demo-user-1",
    role: "user",
    parts: [
      {
        type: "text",
        text: "How many riders on Rund um Merken for Amateure?",
      },
    ],
  },
  {
    id: "demo-assistant-2",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Amateure · Rund um Merken has 6 riders on the start list.",
      },
    ],
  },
];

function Pin({
  n,
  active,
  side = "left",
}: {
  n: number;
  active?: boolean;
  side?: "left" | "right";
}) {
  return (
    <span
      className={[
        "absolute z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white shadow",
        side === "left" ? "-top-2 -left-2" : "-top-2 -right-2",
        active ? "bg-blue-600 ring-2 ring-blue-300" : "bg-blue-500",
      ].join(" ")}
    >
      {n}
    </span>
  );
}

export default function AnatomyDemo() {
  const [input, setInput] = useState("");
  const [hover, setHover] = useState<number | null>(null);
  const [showDemoTool, setShowDemoTool] = useState(true);
  const [showDemoCite, setShowDemoCite] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop, setMessages, clearError } =
    useChat({
      messages: DEMO_SEED,
      transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  const active = useMemo(() => {
    if (hover != null) return hover;
    if (error) return 7;
    if (busy) return 6;
    return null;
  }, [hover, error, busy]);

  const hasToolPart = messages.some((m) =>
    m.parts.some((p) => p.type.startsWith("tool-")),
  );
  const showToolLine = showDemoTool || hasToolPart || busy;

  return (
    <div className="h-dvh bg-white">
      <div className="mx-auto grid h-full w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex min-h-0 flex-col">
          <div className="mb-4 shrink-0">
            <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              Before we build · Interactive demo
            </p>
            <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">
              Anatomy of the chat interface
            </h1>
            <p className="text-sm text-zinc-600">
              Hover a number in the legend, then send a real season question.{" "}
              <Link href="/" className="font-medium text-blue-600 underline">
                Hub
              </Link>
              {" · "}
              <Link href="/chat" className="font-medium text-blue-600 underline">
                Your chat
              </Link>
              {" · "}
              <Link
                href="/reference"
                className="font-medium text-blue-600 underline"
              >
                Reference
              </Link>
            </p>
          </div>

          <div
            className={[
              "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-white",
              active === 1
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-zinc-200",
            ].join(" ")}
            onMouseEnter={() => setHover(1)}
            onMouseLeave={() => setHover(null)}
          >
            <Pin n={1} active={active === 1} />

            <header className="shrink-0 border-b border-zinc-200 px-4 py-3">
              <div className="text-sm font-semibold text-zinc-900">
                Race Season Assistant
              </div>
              <div className="text-xs text-zinc-500">
                Product shell · localhost:3000/anatomy
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
              {messages.map((message, messageIndex) => {
                const isUser = message.role === "user";
                const isFirstAssistant =
                  !isUser &&
                  messages.findIndex((m) => m.role === "assistant") ===
                    messageIndex;
                const isFirstUser =
                  isUser &&
                  messages.findIndex((m) => m.role === "user") === messageIndex;
                const isGroundedDemo = message.id === "demo-assistant-2";
                const pin = isFirstAssistant
                  ? 2
                  : isFirstUser
                    ? 3
                    : isGroundedDemo
                      ? 5
                      : null;

                return (
                  <div key={message.id} className="contents">
                    {showToolLine &&
                      message.id === "demo-assistant-2" &&
                      showDemoTool && (
                        <div
                          className={[
                            "relative w-fit px-1 text-xs text-zinc-500 italic",
                            active === 4
                              ? "rounded bg-blue-50 text-blue-700"
                              : "",
                          ].join(" ")}
                          onMouseEnter={() => setHover(4)}
                          onMouseLeave={() => setHover(null)}
                        >
                          <Pin n={4} active={active === 4} />
                          Decisions… querying season DB…
                        </div>
                      )}

                    <div
                      className={[
                        "relative rounded-lg px-3 py-2 text-sm",
                        isUser
                          ? "ml-8 bg-zinc-900 text-white"
                          : "mr-8 bg-zinc-100 text-zinc-900",
                        pin != null && active === pin
                          ? "ring-2 ring-blue-300"
                          : "",
                      ].join(" ")}
                      onMouseEnter={() => pin != null && setHover(pin)}
                      onMouseLeave={() => setHover(null)}
                    >
                      {pin != null && (
                        <Pin
                          n={pin}
                          active={active === pin}
                          side={isUser ? "right" : "left"}
                        />
                      )}
                      <div className="mb-1 text-[10px] font-semibold tracking-wide uppercase opacity-60">
                        {isUser ? "You" : "Assistant"}
                      </div>
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <p key={index} className="whitespace-pre-wrap">
                              {part.text}
                            </p>
                          );
                        }
                        if (part.type.startsWith("tool-")) {
                          return (
                            <p
                              key={index}
                              className="mt-1 text-xs text-zinc-500 italic"
                            >
                              Decisions… querying season DB…
                            </p>
                          );
                        }
                        return null;
                      })}
                      {isGroundedDemo && showDemoCite && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                            races · Amateure · Rund um Merken
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {busy && (
                <div
                  className={[
                    "relative flex w-fit items-center gap-2 text-xs text-zinc-500",
                    active === 6
                      ? "rounded bg-blue-50 px-2 py-1 text-blue-700"
                      : "",
                  ].join(" ")}
                  onMouseEnter={() => setHover(6)}
                  onMouseLeave={() => setHover(null)}
                >
                  <Pin n={6} active={active === 6} />
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:240ms]" />
                  </span>
                  Streaming… ({status})
                </div>
              )}

              {hasToolPart && !showDemoTool && (
                <div className="relative w-fit text-xs text-zinc-500 italic">
                  <Pin n={4} active={active === 4} />
                  Tool activity visible in message parts above
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {error && (
              <div
                className={[
                  "relative mx-4 mb-3 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800",
                  active === 7 ? "ring-2 ring-red-300" : "",
                ].join(" ")}
                onMouseEnter={() => setHover(7)}
                onMouseLeave={() => setHover(null)}
              >
                <Pin n={7} active={active === 7} />
                Something went wrong. Check <code>.env.local</code> and try
                again.{" "}
                <button
                  type="button"
                  className="font-semibold underline"
                  onClick={() => clearError()}
                >
                  Dismiss
                </button>
              </div>
            )}

            <form
              className={[
                "relative flex shrink-0 gap-2 border-t border-zinc-200 p-3",
                active === 8 ? "bg-blue-50/50" : "bg-white",
              ].join(" ")}
              onMouseEnter={() => setHover(8)}
              onMouseLeave={() => setHover(null)}
              onSubmit={(e) => {
                e.preventDefault();
                const text = input.trim();
                if (!text || busy) return;
                setShowDemoTool(false);
                setShowDemoCite(false);
                sendMessage({ text });
                setInput("");
              }}
            >
              <Pin n={8} active={active === 8} />
              <input
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
                placeholder={
                  busy ? "Streaming…" : "Ask about the race season…"
                }
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className={[
                    "relative rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium",
                    active === 9 ? "ring-2 ring-blue-300" : "",
                  ].join(" ")}
                  onMouseEnter={() => setHover(9)}
                  onMouseLeave={() => setHover(null)}
                >
                  <Pin n={9} active={active === 9} side="right" />
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  Send
                </button>
              )}
            </form>
          </div>

          <div className="mt-3 flex shrink-0 flex-wrap gap-2 text-xs">
            <button
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700"
              onClick={() => {
                setMessages(DEMO_SEED);
                setShowDemoTool(true);
                setShowDemoCite(true);
                clearError();
                setInput("");
              }}
            >
              Reset demo seed
            </button>
            <button
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700"
              onClick={() => {
                setMessages([]);
                setShowDemoTool(false);
                setShowDemoCite(false);
                clearError();
              }}
            >
              Clear · chat from scratch
            </button>
          </div>
        </div>

        <aside className="min-h-0 overflow-y-auto lg:self-stretch">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Components
          </h2>
          <ol className="flex flex-col gap-1.5">
            {LEGEND.map((item) => {
              const isActive = active === item.n;
              return (
                <li key={item.n}>
                  <button
                    type="button"
                    className={[
                      "flex w-full gap-3 rounded-lg border px-3 py-2 text-left transition",
                      isActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300",
                    ].join(" ")}
                    onMouseEnter={() => setHover(item.n)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(item.n)}
                    onBlur={() => setHover(null)}
                  >
                    <span
                      className={[
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white",
                        isActive ? "bg-blue-600" : "bg-blue-500",
                      ].join(" ")}
                    >
                      {item.n}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-zinc-900">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-zinc-500">
                        {item.desc}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            Seeded messages show #2–5 before you chat. Send a live message to see
            #6 (streaming) and #9 (stop). Season facts come from Postgres after
            Decisions intent routing. Break <code>.env.local</code> briefly to
            surface #7.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">
            Docs:{" "}
            <a
              className="font-medium text-blue-600 underline"
              href="https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot"
              target="_blank"
              rel="noopener noreferrer"
            >
              AI SDK Chatbot
            </a>
            {" · "}
            <a
              className="font-medium text-blue-600 underline"
              href="https://ai-sdk.dev/docs/ai-sdk-core/decisions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Decisions
            </a>
            {" · "}
            <a
              className="font-medium text-blue-600 underline"
              href="https://github.com/drublic/dl-school-chatbots/blob/main/WORKSHOP.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              WORKSHOP.md
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}
