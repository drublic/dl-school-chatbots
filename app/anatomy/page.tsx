import { Suspense } from "react";
import AnatomyDemo from "./anatomy-demo";

export default function AnatomyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-zinc-50 text-sm text-zinc-500">
          Loading anatomy demo…
        </div>
      }
    >
      <AnatomyDemo />
    </Suspense>
  );
}
