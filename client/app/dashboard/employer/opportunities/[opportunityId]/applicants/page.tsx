"use client";

import Link from "next/link";
import { ArrowLeft, Check, Send, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Application,
  getApplicationsForOpportunity,
  updateApplicationOutcome,
  updateApplicationStatus,
} from "../../../../../../lib/api";
import { PortalShell } from "../../../../../../components/site-shell";

export default function ApplicantsPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [rating, setRating] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    getApplicationsForOpportunity(opportunityId)
      .then((data) => setApplicants(data.applications))
      .catch((reason: Error) => setError(reason.message));
  }, [opportunityId]);
  async function changeStatus(id: string, status: string) {
    try {
      await updateApplicationStatus(id, status);
      setApplicants((items) =>
        items.map((item) => (item._id === id ? { ...item, status } : item)),
      );
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  async function saveOutcome(application: Application) {
    try {
      await updateApplicationOutcome(application._id, {
        rating: rating[application._id]
          ? Number(rating[application._id])
          : undefined,
        feedback: feedback[application._id],
        completedAt:
          application.status === "completed"
            ? new Date().toISOString()
            : undefined,
      });
      setApplicants((items) =>
        items.map((item) =>
          item._id === application._id
            ? {
                ...item,
                outcome: {
                  ...item.outcome,
                  employerRating: rating[application._id]
                    ? Number(rating[application._id])
                    : item.outcome?.employerRating,
                  employerFeedback:
                    feedback[application._id] || item.outcome?.employerFeedback,
                },
              }
            : item,
        ),
      );
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <PortalShell>
      <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
        <Link
          href="/dashboard/employer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55 hover:text-leaf"
        >
          <ArrowLeft size={16} />
          Back to employer workspace
        </Link>
        <header className="mt-8">
          <p className="eyebrow">Applicant review</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">
            Review applications
          </h1>
          <p className="mt-3 text-sm text-ink/55">
            Compare verified evidence and explainable match scores before
            changing status.
          </p>
        </header>
        {error && (
          <p
            role="alert"
            className="mt-6 border border-coral/30 bg-coral/10 p-4 text-sm text-coral"
          >
            {error}
          </p>
        )}
        <section className="mt-8 space-y-4">
          {!applicants.length && !error ? (
            <p className="border border-ink/10 bg-paper p-8 text-sm text-ink/50">
              Loading applications...
            </p>
          ) : (
            applicants.map((applicant) => (
              <article
                key={applicant._id}
                className="border border-ink/10 bg-paper p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {applicant.studentId?.name || "Applicant"}
                    </h2>
                    <p className="mt-1 text-sm text-ink/50">
                      {applicant.profile?.disciplines?.join(", ") ||
                        "AYUSH learner"}{" "}
                      · {applicant.profile?.location || "Location not provided"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="eyebrow">Match score</p>
                    <p className="font-serif text-4xl text-leaf">
                      {applicant.match?.score ?? "-"}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-ink/55">
                  {applicant.match?.explanation ||
                    "Match explanation will appear after the student views this opportunity."}
                </p>
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-ink/45">
                    Verified evidence
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {applicant.profile?.evidence?.map((item) => (
                      <span
                        key={item._id}
                        className="border border-leaf/30 bg-[#edf3ed] px-2.5 py-1.5 text-xs"
                      >
                        {item.title} · {item.type}
                      </span>
                    ))}
                    {!applicant.profile?.evidence?.length && (
                      <span className="text-sm text-ink/45">
                        No verified evidence submitted.
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="border border-ink/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.12em]">
                    {applicant.status.replace("_", " ")}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => changeStatus(applicant._id, "shortlisted")}
                      className="flex items-center gap-2 bg-leaf px-3 py-2 text-xs font-bold text-paper"
                    >
                      <Check size={14} />
                      Shortlist
                    </button>
                    <button
                      type="button"
                      onClick={() => changeStatus(applicant._id, "rejected")}
                      className="flex items-center gap-2 border border-coral/30 px-3 py-2 text-xs font-bold text-coral"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                </div>
                {["accepted", "completed"].includes(applicant.status) && (
                  <div className="mt-5 flex flex-col gap-2 border-t border-ink/10 pt-5 sm:flex-row">
                    <select
                      value={
                        rating[applicant._id] ||
                        applicant.outcome?.employerRating ||
                        ""
                      }
                      onChange={(event) =>
                        setRating((current) => ({
                          ...current,
                          [applicant._id]: event.target.value,
                        }))
                      }
                      className="border border-ink/15 bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="">Employer rating</option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value} / 5
                        </option>
                      ))}
                    </select>
                    <input
                      value={feedback[applicant._id] || ""}
                      onChange={(event) =>
                        setFeedback((current) => ({
                          ...current,
                          [applicant._id]: event.target.value,
                        }))
                      }
                      placeholder="Employer feedback"
                      className="min-w-0 flex-1 border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-leaf"
                    />
                    <button
                      type="button"
                      onClick={() => saveOutcome(applicant)}
                      className="flex items-center justify-center gap-2 bg-ink px-4 py-2.5 text-xs font-bold text-paper hover:bg-leaf"
                    >
                      <Send size={14} />
                      Save outcome
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </PortalShell>
  );
}
