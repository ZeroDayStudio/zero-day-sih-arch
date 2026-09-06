"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { getVerificationQueue, reviewEvidence, VerificationItem } from "../lib/api";

export function VerificationQueue() {
  const [queue, setQueue] = useState<VerificationItem[]>([]);
  const [error, setError] = useState("");
  function load() { getVerificationQueue().then((data) => setQueue(data.queue)).catch((reason: Error) => setError(reason.message)); }
  useEffect(load, []);
  async function review(item: typeof queue[number], status: string) { await reviewEvidence(item.studentUserId, item._id, { status }); setQueue((items) => items.filter((current) => current._id !== item._id)); }
  return <section className="border border-ink/10 bg-paper p-5 sm:p-7"><p className="eyebrow">Verification queue</p><h2 className="mt-2 text-xl font-semibold">Evidence awaiting review</h2>{error && <p className="mt-4 text-sm text-coral">{error}</p>}<div className="mt-6 space-y-3">{queue.map((item) => <div key={item._id} className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4"><div><p className="font-semibold">{item.title}</p><p className="text-xs text-ink/50">{item.student?.name || "Student"} · {item.issuer || "Self-submitted"}</p></div><div className="flex gap-2"><button aria-label={`Approve ${item.title}`} onClick={() => review(item, "verified")} className="grid h-9 w-9 place-items-center bg-leaf text-paper"><Check size={16} /></button><button aria-label={`Reject ${item.title}`} onClick={() => review(item, "rejected")} className="grid h-9 w-9 place-items-center border border-coral/30 text-coral"><X size={16} /></button></div></div>)}{!queue.length && <p className="text-sm text-ink/50">No pending evidence.</p>}</div></section>;
}
