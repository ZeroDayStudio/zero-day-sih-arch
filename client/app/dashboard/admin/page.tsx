"use client";

import { useEffect, useState } from "react";
import { BarChart3, ShieldCheck } from "lucide-react";
import { AdminReport, getAdminReport } from "../../../lib/api";
import { PortalShell } from "../../../components/site-shell";
import { VerificationQueue } from "../../../components/verification-queue";

export default function AdminDashboard() {
  const [report, setReport] = useState<AdminReport>();
  const [error, setError] = useState("");
  useEffect(() => { getAdminReport().then((data) => setReport(data)).catch((reason: Error) => setError(reason.message)); }, []);
  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><p className="eyebrow">Administrator workspace</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Platform governance</h1><p className="mt-3 text-sm text-ink/55">Monitor system health, verification, and aggregate competency data.</p>{error && <p className="mt-5 text-sm text-coral">{error}</p>}<div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric label="Placement rate" value={`${report?.placementRate ?? "-"}%`} /><Metric label="Pending verification" value={String(report?.pendingVerification ?? "-")} /><Metric label="Role groups" value={String(report?.usersByRole?.length ?? "-")} /></div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.7fr]"><VerificationQueue /><div className="bg-ink p-6 text-paper"><BarChart3 className="text-saffron" /><h2 className="mt-8 font-serif text-3xl">Aggregated planning data</h2><p className="mt-4 text-sm leading-6 text-paper/60">Use role, opportunity, application, and discipline reports to guide programme decisions.</p><ShieldCheck className="mt-10 text-leaf" /></div></div></div></PortalShell>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="border border-ink/10 bg-paper p-5"><p className="text-sm text-ink/50">{label}</p><p className="mt-2 font-serif text-4xl">{value}</p></div>; }
