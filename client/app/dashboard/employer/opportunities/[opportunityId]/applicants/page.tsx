"use client";

import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Application, getApplicationsForOpportunity, updateApplicationStatus } from "../../../../../../lib/api";
import { PortalShell } from "../../../../../../components/site-shell";

export default function ApplicantsPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { getApplicationsForOpportunity(opportunityId).then((data) => setApplicants(data.applications)).catch((reason: Error) => setError(reason.message)); }, [opportunityId]);
  async function changeStatus(id: string, status: string) { try { await updateApplicationStatus(id, status); setApplicants((items) => items.map((item) => item._id === id ? { ...item, status } : item)); } catch (reason) { setError((reason as Error).message); } }
  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><Link href="/dashboard/employer" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55 hover:text-leaf"><ArrowLeft size={16} />Back to employer workspace</Link><header className="mt-8"><p className="eyebrow">Applicant review</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Review applications</h1><p className="mt-3 text-sm text-ink/55">Compare applicant evidence and Explainable Match Scores before changing status.</p></header>{error && <p role="alert" className="mt-6 border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{error}</p>}<section className="mt-8 space-y-4">{!applicants.length && !error ? <p className="border border-ink/10 bg-paper p-8 text-sm text-ink/50">Loading applications...</p> : applicants.map((applicant) => <article key={applicant._id} className="border border-ink/10 bg-paper p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">{applicant.studentId?.name || "Applicant"}</h2><p className="mt-1 text-sm text-ink/50">{applicant.profile?.disciplines?.join(", ") || "AYUSH learner"} · {applicant.profile?.location || "Location not provided"}</p></div><div className="text-right"><p className="eyebrow">Match score</p><p className="font-serif text-4xl text-leaf">{applicant.match?.score ?? "-"}</p></div></div><p className="mt-5 text-sm text-ink/55">{applicant.match?.explanation || "Match explanation will appear after the student views this opportunity."}</p><div className="mt-6 flex flex-wrap items-center justify-between gap-3"><span className="border border-ink/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.12em]">{applicant.status.replace("_", " ")}</span><div className="flex gap-2"><button type="button" onClick={() => changeStatus(applicant._id, "shortlisted")} className="flex items-center gap-2 bg-leaf px-3 py-2 text-xs font-bold text-paper"><Check size={14} />Shortlist</button><button type="button" onClick={() => changeStatus(applicant._id, "rejected")} className="flex items-center gap-2 border border-coral/30 px-3 py-2 text-xs font-bold text-coral"><X size={14} />Reject</button></div></div></article>)}</section></div></PortalShell>;
}
