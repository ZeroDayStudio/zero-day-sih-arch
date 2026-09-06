"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center bg-paper px-5 text-center text-ink"><div><p className="eyebrow">Something went wrong</p><h1 className="mt-3 font-serif text-4xl">This workspace could not load.</h1><p className="mt-4 max-w-md text-sm leading-6 text-ink/55">The request failed before the page could finish rendering. Try again or return to the home page.</p><div className="mt-6 flex justify-center gap-3"><button onClick={reset} className="bg-ink px-4 py-3 text-sm font-semibold text-paper">Try again</button><a href="/" className="border border-ink/15 px-4 py-3 text-sm font-semibold">Home</a></div></div></main>;
}
