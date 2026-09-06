"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Search, Sprout } from "lucide-react";
import { PortalShell } from "../../components/site-shell";
import { getTaxonomy } from "../../lib/api";

type TaxonomyNode = { _id: string; discipline: string; skillNode: string; parent?: string | null };

export default function TaxonomyPage() {
  const [discipline, setDiscipline] = useState("All disciplines");
  const [query, setQuery] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [skills, setSkills] = useState<TaxonomyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getTaxonomy(discipline === "All disciplines" ? undefined : discipline).then((data) => {
      if (!active) return;
      setDisciplines(data.disciplines || []);
      setSkills(data.skills || []);
    }).catch(() => { if (active) setError("Taxonomy could not be loaded. Check that the API is running."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [discipline]);

  const filtered = useMemo(() => skills.filter((skill) => skill.skillNode.toLowerCase().includes(query.toLowerCase())), [query, skills]);
  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><header><p className="eyebrow">Reference system</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">AYUSH Taxonomy</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">A shared vocabulary for competency mapping across Ayurveda, Yoga, Unani, Siddha, Homoeopathy, Sowa-Rigpa, and allied programmes.</p></header><div className="mt-8 flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><span className="sr-only">Search skills</span><Search size={17} className="absolute left-4 top-3.5 text-ink/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search competency nodes" className="w-full border border-ink/10 bg-paper py-3 pl-11 pr-4 text-sm outline-none focus:border-leaf" /></label><select value={discipline} onChange={(event) => setDiscipline(event.target.value)} className="border border-ink/10 bg-paper px-4 py-3 text-sm outline-none focus:border-leaf"><option>All disciplines</option>{disciplines.map((item) => <option key={item}>{item}</option>)}</select></div>{error && <div role="alert" className="mt-6 flex items-center gap-2 border border-coral/30 bg-coral/10 p-4 text-sm text-coral"><AlertCircle size={17} />{error}</div>}{loading ? <div className="mt-8 border border-ink/10 bg-paper p-8 text-sm text-ink/50">Loading taxonomy nodes...</div> : <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((skill) => <article key={skill._id} className="border border-ink/10 bg-paper p-5"><div className="flex items-start justify-between gap-4"><Sprout size={19} className="text-leaf" /><span className="text-[10px] font-bold uppercase tracking-[.16em] text-ink/40">{skill.discipline}</span></div><h2 className="mt-7 text-lg font-semibold">{skill.skillNode}</h2><p className="mt-2 text-xs text-ink/50">Mapped competency node</p></article>)}{!filtered.length && <div className="border border-ink/10 bg-paper p-8 text-sm text-ink/50 sm:col-span-2 lg:col-span-3">No taxonomy nodes match this search.</div>}</div>}</div></PortalShell>;
}
