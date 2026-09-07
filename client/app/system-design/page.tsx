import { Activity, ArrowDown, ArrowRight, Cloud, Database, FileCheck2, Globe2, LockKeyhole, Server, UsersRound } from "lucide-react";

const actors = ["Students", "Institutions", "Employers", "Mentors"];
const services = [
  { icon: LockKeyhole, title: "Identity & access", text: "JWT sessions, roles, permissions" },
  { icon: UsersRound, title: "Profiles & taxonomy", text: "Competencies, curricula, evidence" },
  { icon: Activity, title: "Matching engine", text: "Explainable fit and skill gaps" },
  { icon: FileCheck2, title: "Verification", text: "Reviews, QR passports, audit trail" },
];
const dataStores = [
  { icon: Database, title: "MongoDB", text: "Users, profiles, taxonomy, opportunities" },
  { icon: Server, title: "Redis", text: "Match cache and session state" },
  { icon: Cloud, title: "Object storage", text: "Certificates, resumes, media" },
];

type NodeIcon = typeof Globe2;
function Node({ icon: Icon, title, text }: { icon: NodeIcon; title: string; text: string }) {
  return (
    <article className="border border-ink/15 bg-white p-4 shadow-[0_8px_20px_rgba(16,42,67,.05)]">
      <div className="flex items-center justify-between gap-3"><Icon size={18} className="text-leaf" /><span className="font-mono text-[9px] uppercase tracking-[.16em] text-ink/35">node</span></div>
      <h3 className="mt-4 text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-ink/55">{text}</p>
    </article>
  );
}

export default function SystemDesignPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
      <header className="max-w-3xl"><p className="eyebrow">Architecture / v1</p><h1 className="mt-4 font-serif text-5xl leading-[.98] tracking-[-.05em] sm:text-6xl">The system behind the signal.</h1><p className="mt-6 text-lg leading-8 text-ink/65">A practical map of how verified competency evidence moves through SkillSync and becomes an explainable pathway.</p></header>
      <section aria-labelledby="map-title" className="relative mt-12 overflow-hidden border border-ink/15 bg-[#f5f7f6] p-5 sm:p-8">
        <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "linear-gradient(#0f202708 1px, transparent 1px), linear-gradient(90deg, #0f202708 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4"><div><p className="eyebrow">System map</p><h2 id="map-title" className="mt-1 text-xl font-semibold">Evidence to opportunity</h2></div><span className="hidden items-center gap-2 text-xs font-semibold text-ink/45 sm:flex"></span></div>
          <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[.7fr_32px_1.7fr_32px_1.15fr]">
            <div className="flex flex-col gap-3"><p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-ink/45">01 / people</p><div className="flex flex-1 flex-col justify-center gap-2 border border-leaf/25 bg-[#e8f0ea] p-4">{actors.map((actor) => <div key={actor} className="flex items-center gap-2 text-sm font-semibold"><Globe2 size={15} className="text-leaf" />{actor}</div>)}<div className="mt-3 border-t border-leaf/20 pt-3 text-xs leading-5 text-ink/55">Browser clients<br />Next.js / React / mobile web</div></div></div>
            <div className="hidden items-center justify-center lg:flex"><ArrowRight className="text-leaf" /></div>
            <div className="flex flex-col gap-3"><p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-ink/45">02 / application layer</p><div className="grid flex-1 gap-3 sm:grid-cols-2">{services.map((service) => <Node key={service.title} {...service} />)}</div><div className="flex items-center justify-center gap-2 text-xs font-semibold text-leaf lg:hidden"><ArrowDown size={15} /> HTTPS / REST / WebSockets</div></div>
            <div className="hidden items-center justify-center lg:flex"><ArrowRight className="text-leaf" /></div>
            <div className="flex flex-col gap-3"><p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-ink/45">03 / persistence</p><div className="flex flex-1 flex-col justify-center gap-3">{dataStores.map((store) => <Node key={store.title} {...store} />)}</div></div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-2 border-t border-dashed border-ink/20 pt-6 text-center"><ArrowDown size={16} className="text-leaf" /><p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-ink/45">04 / operations</p><div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3"><div className="border border-ink/10 bg-ink p-3 text-xs font-semibold text-paper">Docker + CI/CD</div><div className="border border-ink/10 bg-ink p-3 text-xs font-semibold text-paper">AWS / Render / Vercel</div><div className="border border-ink/10 bg-ink p-3 text-xs font-semibold text-paper">Logs + backups</div></div></div>
        </div>
      </section>
      <section className="mt-12 grid gap-6 border-t border-ink/10 pt-8 md:grid-cols-3"><div><p className="eyebrow">Trust</p><h2 className="mt-2 text-lg font-semibold">Clear boundaries</h2><p className="mt-2 text-sm leading-6 text-ink/55">Authentication, uploads, verification, and permissions are explicit service responsibilities.</p></div><div><p className="eyebrow">Reasoning</p><h2 className="mt-2 text-lg font-semibold">Explainable matches</h2><p className="mt-2 text-sm leading-6 text-ink/55">Skill fit, domain fit, eligibility, location, and availability remain visible as separate signals.</p></div><div><p className="eyebrow">Scale</p><h2 className="mt-2 text-lg font-semibold">Ready to evolve</h2><p className="mt-2 text-sm leading-6 text-ink/55">The monolith can split along these service boundaries as usage, integrations, and governance mature.</p></div></section>
    </main>
  );
}
