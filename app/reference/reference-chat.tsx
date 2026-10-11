"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ReferenceChat() {
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4 py-6">
      <header className="mb-4 shrink-0 border-b border-zinc-200 pb-4">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          Reference implementation · Session 4
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Race Season Assistant
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Finished product — peek when stuck. Build in{" "}
          <Link href="/chat" className="font-medium text-blue-600 underline">
            /chat
          </Link>
          {" · "}
          <Link href="/" className="font-medium text-blue-600 underline">
            hub
          </Link>
          {" · "}
          <Link href="/anatomy" className="font-medium text-blue-600 underline">
            anatomy
          </Link>
          .
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
            Try: “Hi, who are you?” — then “How many riders on Rund um Merken for
            Amateure?”
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ml-8 rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white"
                : "mr-8 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-900"
            }
          >
            <div className="mb-1 text-[10px] font-semibold tracking-wide uppercase opacity-60">
              {message.role === "user" ? "You" : "Assistant"}
            </div>
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <p key={index} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mb-3 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Something went wrong. Check <code>.env.local</code> and the terminal,
          then try again.
        </p>
      )}

      <form
        className="flex shrink-0 gap-2 border-t border-zinc-200 bg-white pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          const text = input.trim();
          if (!text || busy) return;
          sendMessage({ text });
          setInput("");
        }}
      >
        <input
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          placeholder={busy ? "Streaming…" : "Ask about the race season…"}
        />
        {busy ? (
          <button
            type="button"
            onClick={() => stop()}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
          >
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
  );
}
