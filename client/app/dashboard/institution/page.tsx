"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, GraduationCap, TrendingUp } from "lucide-react";
import { useAuth } from "../../../components/auth-context";
import { PortalShell } from "../../../components/site-shell";
import { getInstitutionReport, InstitutionReport } from "../../../lib/api";

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const [report, setReport] = useState<InstitutionReport>();
  const [error, setError] = useState("");
  useEffect(() => { if (!user?.institutionCode) { setError("Your account is not linked to an institution code."); return; } getInstitutionReport(user.institutionCode).then((data) => setReport(data.report)).catch((reason: Error) => setError(reason.message)); }, [user?.institutionCode]);
  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><header><p className="eyebrow">Institution workspace</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">{user?.name || "Institution"} programme intelligence</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">Translate student evidence into curriculum action with cohort-level skill-gap analysis and placement reporting.</p></header>{error && <p role="alert" className="mt-6 border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{error}</p>}<div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric icon={<GraduationCap size={18} />} label="Active learners" value={String(report?.studentCount ?? "-")} detail="Linked student accounts" /><Metric icon={<TrendingUp size={18} />} label="Profile completeness" value={`${report?.profileCompleteness ?? "-"}%`} detail="Learners with profiles" /><Metric icon={<BookOpenCheck size={18} />} label="Placement rate" value={`${report?.placementRate ?? "-"}%`} detail="Accepted applications" /></div><section className="mt-6 border border-ink/10 bg-paper p-5 sm:p-7"><p className="eyebrow">Cohort diagnostics</p><h2 className="mt-2 text-xl font-semibold">Learners by AYUSH discipline</h2><div className="mt-7 space-y-5">{Object.entries(report?.disciplineCoverage || {}).map(([discipline, count]) => <div key={discipline}><div className="flex justify-between gap-4 text-sm"><span className="font-semibold">{discipline}</span><span className="text-ink/50">{count} learners</span></div><div className="mt-2 h-3 bg-ink/10"><div className="h-full bg-saffron" style={{ width: `${report?.studentCount ? Math.min(100, (count / report.studentCount) * 100) : 0}%` }} /></div></div>)}{report && !Object.keys(report.disciplineCoverage).length && <p className="text-sm text-ink/50">No discipline data is available yet.</p>}{!report && !error && <p className="text-sm text-ink/50">Loading institution report...</p>}</div></section></div></PortalShell>;
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) { return <div className="border border-ink/10 bg-paper p-5"><span className="grid h-9 w-9 place-items-center bg-[#e6f0eb] text-leaf">{icon}</span><p className="mt-6 text-sm text-ink/50">{label}</p><p className="mt-1 font-serif text-4xl">{value}</p><p className="mt-1 text-xs text-leaf">{detail}</p></div>; }
