import { Suspense } from "react";
import ReferenceChat from "./reference-chat";

export default function ReferencePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-zinc-500">
          Loading reference chat…
        </div>
      }
    >
      <ReferenceChat />
    </Suspense>
  );
}
