"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Send, Target } from "lucide-react";
import { useAuth } from "../../../components/auth-context";
import { PortalShell } from "../../../components/site-shell";
import { SkillGapChart } from "../../../components/skill-gap-chart";
import {
  Application,
  getMyApplications,
  getMyProfile,
  getTaxonomy,
  SkillProfile,
  updateApplicationOutcome,
} from "../../../lib/api";

type TaxonomyNode = { _id: string; skillNode: string; discipline: string };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [taxonomy, setTaxonomy] = useState<TaxonomyNode[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  useEffect(() => {
    Promise.all([getMyProfile(), getTaxonomy(), getMyApplications()])
      .then(([profileResponse, taxonomyResponse, applicationResponse]) => {
        setProfile(profileResponse.profile);
        setTaxonomy(taxonomyResponse.skills || []);
        setApplications(applicationResponse.applications);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);
  const chartData = useMemo(
    () =>
      taxonomy.map((node) => {
        const skill = profile?.skills.find(
          (item) =>
            (typeof item.skillId === "string"
              ? item.skillId
              : item.skillId._id) === node._id,
        );
        return {
          skill: node.skillNode,
          current: skill?.proficiency || 0,
          target: 80,
        };
      }),
    [profile, taxonomy],
  );
  const skillCount = profile?.skills.length || 0;
  const verifiedCount =
    profile?.evidence.filter((item) => item.status === "verified").length || 0;
  const average = skillCount
    ? Math.round(
        (profile?.skills.reduce(
          (total, skill) => total + skill.proficiency,
          0,
        ) || 0) / skillCount,
      )
    : 0;
  async function submitFeedback(applicationId: string) {
    try {
      await updateApplicationOutcome(applicationId, {
        feedback: feedback[applicationId],
        curriculumFeedback: feedback[applicationId],
      });
      setSaved(applicationId);
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <PortalShell>
      <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
        <header>
          <p className="eyebrow">Student workspace</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">
            Good morning, {user?.name || "student"}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">
            Review live competency metrics and close the highest-value skill
            gaps for your target AYUSH roles.
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
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric
            icon={<Target size={18} />}
            label="Average proficiency"
            value={`${average}%`}
            detail={`${Math.max(0, 100 - average)} points to full coverage`}
          />
          <Metric
            icon={<BarChart3 size={18} />}
            label="Skills mapped"
            value={`${skillCount} / ${taxonomy.length || 0}`}
            detail={`${Math.max(0, taxonomy.length - skillCount)} taxonomy gaps`}
          />
          <Metric
            icon={<CheckCircle2 size={18} />}
            label="Verified evidence"
            value={String(verifiedCount)}
            detail="Approved evidence items"
          />
        </div>
        <section className="mt-6 border border-ink/10 bg-paper p-5 sm:p-7">
          <p className="eyebrow">Skill-Gap Analysis</p>
          <h2 className="mt-2 text-xl font-semibold">
            Current capability vs taxonomy target
          </h2>
          <p className="mt-1 text-sm text-ink/50">
            Target proficiency is set at 80% for each mapped competency.
          </p>
          {!profile && !error ? (
            <p className="mt-8 text-sm text-ink/50">
              Loading profile and taxonomy...
            </p>
          ) : chartData.length ? (
            <div className="mt-8">
              <SkillGapChart data={chartData} />
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink/50">
              Add skills to your profile to see gaps.
            </p>
          )}
        </section>
        <section className="mt-6 border border-ink/10 bg-paper p-5 sm:p-7">
          <p className="eyebrow">Placement pathway</p>
          <h2 className="mt-2 text-xl font-semibold">Application outcomes</h2>
          <div className="mt-5 space-y-5">
            {applications.map((application) => (
              <div
                key={application._id}
                className="border-b border-ink/10 pb-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {application.opportunityId?.title || "Opportunity"}
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      {application.status.replace("_", " ")}
                    </p>
                  </div>
                  {application.match && (
                    <span className="text-sm font-bold text-leaf">
                      Match {application.match.score}
                    </span>
                  )}
                </div>
                {["accepted", "completed"].includes(application.status) && (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={feedback[application._id] || ""}
                      onChange={(event) =>
                        setFeedback((current) => ({
                          ...current,
                          [application._id]: event.target.value,
                        }))
                      }
                      placeholder="Share your learning and curriculum feedback"
                      className="min-w-0 flex-1 border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-leaf"
                    />
                    <button
                      type="button"
                      onClick={() => submitFeedback(application._id)}
                      className="flex items-center justify-center gap-2 bg-ink px-4 py-2.5 text-xs font-bold text-paper hover:bg-leaf"
                    >
                      <Send size={14} />
                      {saved === application._id ? "Saved" : "Send feedback"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}

function Metric({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border border-ink/10 bg-paper p-5">
      <span className="grid h-9 w-9 place-items-center bg-[#e6f0eb] text-leaf">
        {icon}
      </span>
      <p className="mt-6 text-sm text-ink/50">{label}</p>
      <p className="mt-1 font-serif text-4xl">{value}</p>
      <p className="mt-1 text-xs text-leaf">{detail}</p>
    </div>
  );
}
