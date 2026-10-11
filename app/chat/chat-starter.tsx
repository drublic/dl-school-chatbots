"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * YOUR BUILD — start from scratch here.
 *
 * Implement via OpenSpec:
 *   openspec/changes/build-race-season-assistant/
 *   openspec show build-race-season-assistant
 *   openspec status --change build-race-season-assistant
 *
 * Steps (WORKSHOP.md):
 *   2 — message list, input, Send, useChat → /api/chat
 *   3 — busy / Stop / error while streaming
 *   4–5 — verify classify + Postgres answers (backend lives in lib/* + route)
 *
 * Peek when stuck: /reference · /anatomy · WORKSHOP.md
 */
export default function ChatStarter() {
  const [input, setInput] = useState("");

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4 py-6">
      <header className="mb-4 shrink-0 border-b border-zinc-200 pb-4">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          Your build · Session 4
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Race Season Assistant
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Blank shell — implement from the OpenSpec change.{" "}
          <Link href="/" className="font-medium text-blue-600 underline">
            Hub
          </Link>
          {" · "}
          <Link href="/anatomy" className="font-medium text-blue-600 underline">
            Anatomy
          </Link>
          {" · "}
          <Link
            href="/reference"
            className="font-medium text-blue-600 underline"
          >
            Reference
          </Link>
          .
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-4">
        <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
          TODO (OpenSpec · step 2): wire{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs">useChat</code> +
          render{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs">
            message.parts
          </code>
          . Target API:{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs">/api/chat</code>.
        </p>
      </div>

      {/* TODO (step 3): show error from useChat */}

      <form
        className="flex shrink-0 gap-2 border-t border-zinc-200 bg-white pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO (step 2): sendMessage({ text: input.trim() })
          setInput("");
        }}
      >
        <input
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Implement Send via OpenSpec…"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Send
        </button>
        {/* TODO (step 3): Stop button while status is submitted / streaming */}
      </form>
    </div>
  );
}
