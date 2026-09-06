"use client";

import { BarChart3, CheckCircle2, Target } from "lucide-react";
import { PortalShell } from "../../../components/site-shell";
import { SkillGapChart } from "../../../components/skill-gap-chart";

export default function StudentDashboard() {
  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><header><p className="eyebrow">Student workspace</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Competency overview</h1><p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">Review Real-Time Competency Metrics and close the highest-value skill gaps for your target AYUSH roles.</p></header><div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric icon={<Target size={18} />} label="Profile strength" value="78%" detail="+12% this month" /><Metric icon={<BarChart3 size={18} />} label="Skill coverage" value="24 / 31" detail="7 skills to develop" /><Metric icon={<CheckCircle2 size={18} />} label="Verified evidence" value="08" detail="Across 4 domains" /></div><section className="mt-6 border border-ink/10 bg-paper p-5 sm:p-7"><p className="eyebrow">Skill-Gap Analysis</p><h2 className="mt-2 text-xl font-semibold">Current capability vs target AYUSH roles</h2><p className="mt-1 text-sm text-ink/50">Target: Clinical Research Fellow · Updated 09 September 2026</p><div className="mt-8"><SkillGapChart /></div></section></div></PortalShell>;
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) { return <div className="border border-ink/10 bg-paper p-5"><span className="grid h-9 w-9 place-items-center bg-[#e6f0eb] text-leaf">{icon}</span><p className="mt-6 text-sm text-ink/50">{label}</p><p className="mt-1 font-serif text-4xl">{value}</p><p className="mt-1 text-xs text-leaf">{detail}</p></div>; }
