"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { applyToOpportunity, getMatch, getOpportunity, Match, Opportunity } from "../../../lib/api";
import { PortalShell } from "../../../components/site-shell";
import { ScoreBar } from "../../../components/score-bar";

const factors: Array<{ key: keyof Match["breakdown"]; label: string }> = [
  { key: "skillFit", label: "Skill compatibility" },
  { key: "domainFit", label: "Domain alignment" },
  { key: "eligibility", label: "Eligibility" },
  { key: "locationFit", label: "Location fit" },
  { key: "availability", label: "Availability" },
];

export default function OpportunityDetail() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity>();
  const [match, setMatch] = useState<Match>();
  const [error, setError] = useState("");
  const [applicationState, setApplicationState] = useState("");
  useEffect(() => {
    if (!opportunityId) return;
    Promise.all([getOpportunity(opportunityId), getMatch(opportunityId)])
      .then(([opportunityResponse, matchResponse]) => { setOpportunity(opportunityResponse.opportunity); setMatch(matchResponse.match); })
      .catch((reason: Error) => setError(reason.message));
  }, [opportunityId]);
  async function apply() {
    if (!opportunityId) return;
    setApplicationState("Submitting application...");
    try { await applyToOpportunity(opportunityId, ""); setApplicationState("Application submitted"); } catch (reason) { setApplicationState((reason as Error).message); }
  }
  return <PortalShell><main className="mx-auto max-w-5xl px-5 py-12 lg:px-10"><Link href="/match" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55 hover:text-leaf"><ArrowLeft size={16} /> Back to opportunities</Link>{error ? <p role="alert" className="mt-8 border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{error}</p> : !opportunity || !match ? <p className="mt-8 text-sm text-ink/50">Loading opportunity and match explanation...</p> : <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]"><section><div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-xl bg-moss text-xl font-serif text-ink">Ay</span><div><p className="eyebrow">{opportunity.disciplines?.join(" · ")} · {opportunity.type}</p><h1 className="mt-1 font-serif text-4xl tracking-[-.04em]">{opportunity.title}</h1></div></div><p className="mt-8 max-w-2xl text-lg leading-8 text-ink/65">{opportunity.description || "An evidence-led opportunity in the AYUSH ecosystem."}</p><div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-ink/50"><MapPin size={16} className="text-leaf" />{opportunity.remote ? "Remote" : opportunity.location || "Location flexible"}<span className="mx-2">·</span>{opportunity.employerId?.name || "AYUSH employer"}</div><div className="mt-12 border-t border-ink/10 pt-8"><h2 className="text-xl font-semibold">Why you matched</h2><p className="mt-4 border-l-2 border-leaf bg-[#e8eee5] p-4 text-sm leading-6 text-ink/70">{match.explanation || "Your match is based on your verified skills, domain experience, eligibility, location, and availability."}</p><div className="mt-6 space-y-4">{factors.map((factor) => <ScoreBar key={factor.key} label={factor.label} value={match.breakdown[factor.key]} />)}</div></div></section><aside className="paper-panel h-fit rounded-xl p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Your match</p><p className="mt-1 font-serif text-5xl text-leaf">{match.score}<span className="text-base text-ink/40"> / 100</span></p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e6f0eb] text-leaf"><CheckCircle2 size={19} /></span></div><button onClick={apply} className="mt-6 w-full bg-ink px-4 py-3 text-sm font-semibold text-paper hover:bg-leaf">Apply to opportunity</button>{applicationState && <p role="status" className="mt-3 text-xs text-ink/55">{applicationState}</p>}<dl className="mt-7 space-y-3 border-t border-ink/10 pt-5 text-sm"><div className="flex justify-between gap-4"><dt className="text-ink/50">Type</dt><dd className="font-semibold">{opportunity.type}</dd></div><div className="flex justify-between gap-4"><dt className="text-ink/50">Stipend</dt><dd className="font-semibold">{opportunity.stipend ? `INR ${opportunity.stipend.toLocaleString()}` : "As per role"}</dd></div><div className="flex justify-between gap-4"><dt className="text-ink/50">Required skills</dt><dd className="text-right font-semibold">{opportunity.requiredSkills?.length || 0}</dd></div></dl></aside></div>}</main></PortalShell>;
}
