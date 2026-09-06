"use client";

import { Download, Fingerprint, Share2, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../components/auth-context";
import { PortalShell } from "../../components/site-shell";

const skills = ["Clinical reasoning · Advanced", "Dravyaguna Vijnana · Intermediate", "Community facilitation · Intermediate", "Research methods · Emerging"];

export default function PassportPage() {
  const { user } = useAuth();
  const name = user?.name || "Verified learner";
  const passportId = user?.id ? `AYS-${user.id.slice(-8).toUpperCase()}` : "AYS-DEMO-0001";
  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><header className="flex flex-wrap items-start justify-between gap-5"><div><p className="eyebrow">Your verified identity</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Skill passport</h1><p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">A portable record of what you can do, where you learned it, and who has verified the signal.</p></div><div className="flex gap-2"><button className="flex items-center gap-2 border border-ink/10 px-4 py-2.5 text-sm font-semibold"><Download size={16} />Export</button><button className="flex items-center gap-2 bg-leaf px-4 py-2.5 text-sm font-semibold text-paper"><Share2 size={16} />Share passport</button></div></header><section className="mt-10 overflow-hidden border border-ink/10 bg-paper"><div className="grid gap-8 bg-ink p-6 text-paper sm:grid-cols-[1fr_auto] sm:p-9"><div><div className="flex items-center gap-2"><Fingerprint className="text-saffron" size={22} /><span className="text-sm font-bold">AYUSH SkillSync passport</span></div><p className="mt-12 text-xs font-bold uppercase tracking-[.16em] text-moss">{name}</p><h2 className="mt-2 font-serif text-5xl tracking-[-.05em]">AYUSH<br /><em className="font-normal text-saffron">practitioner</em></h2><p className="mt-5 text-sm text-paper/55">{user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} account` : "Verified learner"} · Passport ID {passportId}</p></div><div className="h-fit rounded-lg bg-paper p-3"><QRCodeSVG value={`https://ayush-skillsync.example/passport/${passportId}`} size={132} fgColor="#0F2027" /></div></div><div className="p-6 sm:p-9"><div className="flex items-center justify-between border-b border-ink/10 pb-5"><div><p className="eyebrow">Verified capabilities</p><p className="mt-1 text-sm text-ink/50">Evidence record for {name}</p></div><span className="flex items-center gap-2 text-xs font-bold text-leaf"><ShieldCheck size={16} /> VERIFIED</span></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{skills.map((skill) => <div key={skill} className="border border-ink/10 p-4 text-sm">{skill}</div>)}</div></div></section></div></PortalShell>;
}
