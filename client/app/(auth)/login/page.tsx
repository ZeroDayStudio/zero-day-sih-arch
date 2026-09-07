"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Brand } from "../../../components/brand";
import { roleHome } from "../../../components/auth-context";
import { useLanguage } from "../../../components/language-context";
import { login, register, Role } from "../../../lib/api";

export default function LoginPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-paper"><p className="eyebrow">Loading workspace...</p></div>}><LoginForm /></Suspense>;
}

function LoginForm() {
  const { dictionary } = useLanguage();
  const copy = dictionary.auth;
  const nav = dictionary.nav;
  const roles: { value: Role; label: string; caption: string }[] = [
    { value: "student", label: nav.roleStudent, caption: copy.roleStudentCaption },
    { value: "institution", label: nav.roleInstitution, caption: copy.roleInstitutionCaption },
    { value: "employer", label: nav.roleEmployer, caption: copy.roleEmployerCaption },
    { value: "mentor", label: nav.roleMentor, caption: copy.roleMentorCaption },
    { value: "admin", label: nav.roleAdmin, caption: copy.roleAdminCaption },
  ];
  const params = useSearchParams();
  const router = useRouter();
  const requestedRole = params.get("role") as Role;
  const [role, setRole] = useState<Role>(roles.some((item) => item.value === requestedRole) ? requestedRole : "student");
  const [registering, setRegistering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = registering
        ? await register({ name: String(form.get("name")), email: String(form.get("email")), password: String(form.get("password")), role })
        : await login(String(form.get("email")), String(form.get("password")));
      router.push(roleHome(response.user.role));
    } catch (reason) {
      setError((reason as Error).message || "Unable to complete sign in.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="grid min-h-screen bg-paper text-ink lg:grid-cols-[.8fr_1.2fr]"><section className="relative hidden overflow-hidden bg-ink p-10 text-paper lg:flex lg:flex-col"><Link href="/"><Brand light /></Link><div className="mt-auto max-w-lg pb-12"><p className="eyebrow text-moss">AYUSH competency exchange</p><h1 className="mt-5 font-serif text-6xl leading-[.9] tracking-[-.06em]">One verified record. Many pathways.</h1><p className="mt-7 max-w-sm text-sm leading-6 text-paper/55">Turn competency evidence into a clear signal for education, industry, and public outcomes.</p><div className="mt-10 flex items-center gap-3 text-xs text-paper/45"><ShieldCheck size={17} className="text-saffron" /> Secure role-based access</div></div></section><section className="flex flex-col px-5 py-7 sm:px-10 lg:px-24"><div className="flex items-center justify-between"><Link href="/" className="lg:hidden"><Brand /></Link><Link href="/" className="ml-auto flex items-center gap-2 text-sm text-ink/50 hover:text-ink"><ArrowLeft size={15} />Back home</Link></div><div className="mx-auto my-auto w-full max-w-xl py-12"><p className="eyebrow">{registering ? "Create account" : "Secure sign in"}</p><h2 className="mt-3 font-serif text-5xl tracking-[-.05em]">{registering ? "Give your practice a home." : "Enter your workspace."}</h2><p className="mt-3 text-sm text-ink/55">Select the role that matches your work.</p><div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">{roles.map((item) => <button key={item.value} type="button" onClick={() => setRole(item.value)} className={`border p-3 text-left transition ${role === item.value ? "border-leaf bg-[#e8eee5]" : "border-ink/10 hover:border-ink/30"}`}><span className="block text-sm font-semibold">{item.label}</span><span className="mt-1 block text-[11px] text-ink/50">{item.caption}</span></button>)}</div><form onSubmit={submit} className="mt-8 space-y-4">{registering && <Field label="Full name" name="name" placeholder="Yash Vardhan" icon={<UserRound size={16} />} required />}<Field label="Email address" name="email" type="email" placeholder="name@example.com" icon={<Mail size={16} />} required /><label className="block"><span className="mb-2 block text-xs font-semibold text-ink/60">Password</span><span className="relative block"><LockKeyhole size={16} className="absolute left-3 top-3.5 text-ink/35" /><input name="password" type={visible ? "text" : "password"} minLength={8} required placeholder="Minimum 8 characters" className="w-full border border-ink/15 bg-white py-3 pl-10 pr-11 text-sm outline-none focus:border-leaf" /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)} className="absolute right-3 top-3 text-ink/45">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{error && <p role="alert" className="border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3.5 text-sm font-bold text-paper hover:bg-leaf disabled:opacity-60">{busy ? "Working..." : registering ? "Create account" : "Sign in"}<ArrowRight size={16} /></button></form><p className="mt-6 text-center text-sm text-ink/50">{registering ? "Already registered?" : "New to SkillSync?"} <button type="button" onClick={() => setRegistering((value) => !value)} className="font-bold text-leaf">{registering ? "Sign in" : "Create an account"}</button></p></div></section></main>;
}

function Field({ label, name, placeholder, type = "text", icon, required = false }: { label: string; name: string; placeholder: string; type?: string; icon: React.ReactNode; required?: boolean }) { return <label className="block"><span className="mb-2 block text-xs font-semibold text-ink/60">{label}</span><span className="relative block">{icon && <span className="absolute left-3 top-3.5 text-ink/35">{icon}</span>}<input name={name} type={type} required={required} placeholder={placeholder} className="w-full border border-ink/15 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-leaf" /></span></label>; }
