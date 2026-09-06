"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOpportunity, getTaxonomy } from "../../../../../lib/api";
import { PortalShell } from "../../../../../components/site-shell";

type TaxonomyNode = { _id: string; discipline: string; skillNode: string };

export default function NewOpportunityPage() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [skills, setSkills] = useState<TaxonomyNode[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [remote, setRemote] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getTaxonomy().then((data) => { setDisciplines(data.disciplines || []); setSkills(data.skills || []); }).catch((reason: Error) => setError(reason.message)); }, []);

  function toggleSkill(skillId: string) { setSelectedSkills((current) => current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId]); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await createOpportunity({ title: String(form.get("title")), description: String(form.get("description")), type: String(form.get("type")), disciplines: form.getAll("disciplines").map(String), requiredSkills: selectedSkills, location: String(form.get("location")), remote, stipend: Number(form.get("stipend") || 0), eligibility: String(form.get("eligibility")), availability: String(form.get("availability")), status: "open" });
      router.push("/dashboard/employer");
    } catch (reason) { setError((reason as Error).message); } finally { setSaving(false); }
  }

  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><Link href="/dashboard/employer" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55 hover:text-leaf"><ArrowLeft size={16} />Back to employer workspace</Link><header className="mt-8"><p className="eyebrow">Opportunity management</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Post an opportunity</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">Publish a structured opening so students can receive an explainable match.</p></header><form onSubmit={submit} className="mt-8 max-w-4xl space-y-6 border border-ink/10 bg-paper p-5 sm:p-8">{error && <p role="alert" className="border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>}<div className="grid gap-5 md:grid-cols-2"><Field label="Opportunity title" name="title" placeholder="Clinical Research Fellow" required /><label className="block"><span className="mb-2 block text-xs font-semibold text-ink/60">Type</span><select name="type" defaultValue="internship" className="w-full border border-ink/15 bg-paper px-3 py-3 text-sm focus:border-leaf focus:outline-none"><option value="internship">Internship</option><option value="placement">Placement</option><option value="fellowship">Fellowship</option><option value="apprenticeship">Apprenticeship</option></select></label></div><Field label="Description" name="description" placeholder="Describe the work and expected outcomes." required textarea /><div><span className="mb-2 block text-xs font-semibold text-ink/60">Disciplines</span><div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">{disciplines.map((discipline) => <label key={discipline} className="flex items-center gap-2 border border-ink/10 p-3 text-sm"><input type="checkbox" name="disciplines" value={discipline} />{discipline}</label>)}</div></div><div><span className="mb-2 block text-xs font-semibold text-ink/60">Required skills</span><div className="grid max-h-56 gap-2 overflow-y-auto border border-ink/10 p-3 sm:grid-cols-2">{skills.map((skill) => <label key={skill._id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedSkills.includes(skill._id)} onChange={() => toggleSkill(skill._id)} />{skill.skillNode}<span className="text-xs text-ink/40">{skill.discipline}</span></label>)}</div></div><div className="grid gap-5 md:grid-cols-3"><Field label="Location" name="location" placeholder="Pune, Maharashtra" /><Field label="Stipend" name="stipend" type="number" placeholder="18000" /><Field label="Availability" name="availability" placeholder="June to August" /></div><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={remote} onChange={(event) => setRemote(event.target.checked)} />Remote opportunity</label><Field label="Eligibility" name="eligibility" placeholder="BAMS or BNYS students with research evidence." textarea /><button disabled={saving} className="flex items-center gap-2 bg-ink px-5 py-3.5 text-sm font-bold text-paper hover:bg-leaf disabled:opacity-60"><Save size={16} />{saving ? "Publishing..." : "Publish opportunity"}</button></form></div></PortalShell>;
}

function Field({ label, name, placeholder, type = "text", required = false, textarea = false }: { label: string; name: string; placeholder: string; type?: string; required?: boolean; textarea?: boolean }) { return <label className="block"><span className="mb-2 block text-xs font-semibold text-ink/60">{label}</span>{textarea ? <textarea name={name} required={required} placeholder={placeholder} rows={4} className="w-full border border-ink/15 bg-paper px-3 py-3 text-sm focus:border-leaf focus:outline-none" /> : <input name={name} type={type} required={required} placeholder={placeholder} className="w-full border border-ink/15 bg-paper px-3 py-3 text-sm focus:border-leaf focus:outline-none" />}</label>; }
