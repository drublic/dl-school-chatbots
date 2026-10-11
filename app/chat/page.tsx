import { Suspense } from "react";
import ChatStarter from "./chat-starter";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-zinc-500">
          Loading your chat…
        </div>
      }
    >
      <ChatStarter />
    </Suspense>
  );
}
