"use client";

import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, Landmark, ShieldCheck, UserCog } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../components/language-context";

const roleIcons = { student: GraduationCap, institution: Landmark, employer: Building2, admin: UserCog };

export default function Home() {
  const { dictionary } = useLanguage();
  const copy = dictionary.home;
  const roles = [
    { key: "student", href: "/login?role=student", description: "Build a verified Skill Passport and find aligned pathways." },
    { key: "institution", href: "/login?role=institution", description: "Measure curriculum outcomes against sector demand." },
    { key: "employer", href: "/login?role=employer", description: "Review evidence-led candidates for real openings." },
    { key: "admin", href: "/login?role=admin", description: "Govern taxonomy, verification, and system reporting." },
  ] as const;

  return <main className="bg-paper text-ink">
    <section className="border-b border-ink/10 bg-[#edf2f1]">
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">{copy.eyebrow}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="mt-6 max-w-3xl font-serif text-[clamp(3.2rem,6vw,6.6rem)] leading-[.94] tracking-[-.06em]">{copy.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="mt-7 max-w-xl text-lg leading-8 text-ink/65">{copy.description}</motion.p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/login" className="group flex items-center gap-3 rounded-lg bg-ink px-5 py-3.5 text-sm font-bold text-paper hover:bg-leaf">{copy.primary}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link><Link href="/match" className="flex items-center gap-2 rounded-lg border border-ink/20 bg-paper px-5 py-3.5 text-sm font-semibold hover:border-leaf hover:text-leaf">{copy.secondary}</Link></div>
          <div className="mt-9 flex items-center gap-2 text-xs text-ink/50"><ShieldCheck size={16} className="text-leaf" />Verified evidence · Explainable Match Score · Built for India&apos;s AYUSH ecosystem</div>
        </div>
        <div className="relative hidden min-h-[440px] lg:block"><div className="absolute inset-8 border border-ink/10" /><div className="absolute right-0 top-10 w-72 bg-ink p-7 text-paper shadow-2xl"><p className="eyebrow text-moss">{copy.metrics}</p><p className="mt-5 font-serif text-6xl tracking-[-.06em]">80<span className="text-3xl text-saffron">%</span></p><p className="mt-2 text-sm leading-6 text-paper/60">of learners report limited industry exposure. SkillSync makes the gap measurable and actionable.</p><div className="mt-7 h-2 bg-paper/10"><div className="h-full w-[62%] bg-saffron" /></div></div><div className="absolute bottom-8 left-0 w-64 border border-ink/15 bg-paper p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-ink/40">SIH26044</p><p className="mt-3 text-2xl font-semibold">One shared record</p><p className="mt-2 text-sm leading-6 text-ink/55">For learners, institutions, employers, and administrators.</p></div></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Workspace access</p><h2 className="mt-2 font-serif text-4xl tracking-[-.04em]">{copy.roles}</h2></div><p className="max-w-md text-sm leading-6 text-ink/55">One operating language for competency, opportunity, and institutional accountability.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{roles.map(({ key, href, description }, index) => { const Icon = roleIcons[key]; return <motion.div key={key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}><Link href={href} className="group block border border-ink/10 bg-paper p-5 transition-colors hover:border-leaf hover:bg-[#f1f6f2]"><Icon size={21} className="text-leaf" /><h3 className="mt-8 text-lg font-semibold">{copy[key]}</h3><p className="mt-2 min-h-12 text-sm leading-5 text-ink/55">{description}</p><span className="mt-6 flex items-center gap-2 text-xs font-bold text-leaf">Open workspace <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span></Link></motion.div>; })}</div></section>
  </main>;
}
