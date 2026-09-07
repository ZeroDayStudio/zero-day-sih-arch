"use client";

import { useEffect, useState } from "react";
import {
  Download,
  ExternalLink,
  Fingerprint,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { apiOrigin, getMyProfile, SkillProfile } from "../../lib/api";
import { useAuth } from "../../components/auth-context";
import { PortalShell } from "../../components/site-shell";

export default function PassportPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getMyProfile()
      .then((data) => setProfile(data.profile))
      .catch((reason: Error) => setError(reason.message));
  }, []);
  const passportId = profile?.publicSlug || "";
  const publicSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const publicUrl =
    passportId && publicSiteUrl
      ? `${publicSiteUrl.replace(/\/$/, "")}/passport/${passportId}`
      : "";
  const skills = profile?.skills || [];
  const evidence = profile?.evidence || [];
  async function share() {
    if (publicUrl && navigator.share)
      await navigator.share({
        title: `${user?.name || "AYUSH"} Skill Passport`,
        url: publicUrl,
      });
    else if (publicUrl) await navigator.clipboard.writeText(publicUrl);
  }
  return (
    <PortalShell>
      <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow">Your verified identity</p>
            <h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">
              Skill passport
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">
              A portable record of what you can do, where you learned it, and
              who has verified the signal.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 border border-ink/10 px-4 py-2.5 text-sm font-semibold"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={share}
              disabled={!publicUrl}
              className="flex items-center gap-2 bg-leaf px-4 py-2.5 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Share2 size={16} />
              Share passport
            </button>
          </div>
        </header>
        {error && (
          <p
            role="alert"
            className="mt-6 border border-coral/30 bg-coral/10 p-4 text-sm text-coral"
          >
            {error}
          </p>
        )}
        <section className="mt-10 overflow-hidden border border-ink/10 bg-paper">
          <div className="grid gap-8 bg-ink p-6 text-paper sm:grid-cols-[1fr_auto] sm:p-9">
            <div>
              <div className="flex items-center gap-2">
                <Fingerprint className="text-saffron" size={22} />
                <span className="text-sm font-bold">
                  AYUSH SkillSync passport
                </span>
              </div>
              <p className="mt-12 text-xs font-bold uppercase tracking-[.16em] text-moss">
                {user?.name || "Verified learner"}
              </p>
              <h2 className="mt-2 font-serif text-5xl tracking-[-.05em]">
                AYUSH
                <br />
                <em className="font-normal text-saffron">practitioner</em>
              </h2>
              <p className="mt-5 text-sm text-paper/55">
                {profile?.disciplines?.join(" & ") || "AYUSH ecosystem"} ·
                Passport ID {passportId || "Creating profile..."}
              </p>
            </div>
            {publicUrl && (
              <div className="h-fit rounded-lg bg-paper p-3">
                <QRCodeSVG value={publicUrl} size={132} fgColor="#0F2027" />
              </div>
            )}
          </div>
          <div className="p-6 sm:p-9">
            <div className="flex items-center justify-between border-b border-ink/10 pb-5">
              <div>
                <p className="eyebrow">Verified capabilities</p>
                <p className="mt-1 text-sm text-ink/50">
                  Evidence record for {user?.name || "this learner"}
                </p>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold text-leaf">
                <ShieldCheck size={16} />
                {evidence.length} VERIFIED
              </span>
            </div>
            {!profile && !error ? (
              <p className="mt-6 text-sm text-ink/50">
                Loading your verified profile...
              </p>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {skills.map((skill) => {
                    const taxonomy =
                      typeof skill.skillId === "string" ? null : skill.skillId;
                    return (
                      <div
                        key={`${taxonomy?._id || skill.skillId}`}
                        className="border border-ink/10 p-4 text-sm"
                      >
                        <p className="font-semibold">
                          {taxonomy?.skillNode || "Skill"}
                        </p>
                        <p className="mt-1 text-xs text-ink/50">
                          {taxonomy?.discipline || "AYUSH"} · Proficiency{" "}
                          {skill.proficiency}%
                        </p>
                      </div>
                    );
                  })}
                  {!skills.length && (
                    <p className="text-sm text-ink/50">
                      No skills have been added yet.
                    </p>
                  )}
                </div>
                <div className="mt-8 border-t border-ink/10 pt-6">
                  <p className="eyebrow">Evidence links</p>
                  <div className="mt-3 space-y-3">
                    {evidence.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3 text-sm"
                      >
                        <span>
                          {item.title}
                          <small className="block text-xs text-ink/45">
                            {item.issuer || "Verified submission"}
                          </small>
                        </span>
                        {item.fileUrl && (
                          <a
                            className="text-leaf"
                            href={`${apiOrigin}${item.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open evidence for ${item.title}`}
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    ))}
                    {!evidence.length && (
                      <p className="text-sm text-ink/50">
                        No verified evidence is available yet.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
