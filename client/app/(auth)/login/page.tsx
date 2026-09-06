"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Brand } from "../../../components/brand";
import { login, register, Role } from "../../../lib/api";
import { roleHome } from "../../../components/auth-context";

const roles: { value: Role; label: string; caption: string }[] = [
  { value: "student", label: "Student", caption: "Build your skills" },
  { value: "institution", label: "Institution", caption: "Shape curriculum" },
  { value: "employer", label: "Employer", caption: "Find emerging talent" },
  { value: "mentor", label: "Mentor", caption: "Share your practice" },
  { value: "admin", label: "Administrator", caption: "Govern the portal" },
];


export default function LoginPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-paper text-ink"><div className="eyebrow">Loading your workspace...</div></div>}><LoginPageContent /></Suspense>;
}

function LoginPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const requestedRole = params.get("role") as Role;
  const [role, setRole] = useState<Role>(roles.some((item) => item.value === requestedRole) ? requestedRole : "student");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = isRegistering
        ? await register({ name: String(form.get("name")), email: String(form.get("email")), password: String(form.get("password")), role })
        : await login(String(form.get("email")), String(form.get("password")));
      router.push(roleHome(response.user.role));
    } catch {
      setError("Unable to complete this request. Check the credentials or confirm that the API is running.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="grid min-h-screen bg-paper text-ink lg:grid-cols-[.8fr_1.2fr]"><section className="relative hidden overflow-hidden bg-ink p-10 text-paper lg:flex lg:flex-col"><Link href="/"><Brand light /></Link><div className="relative z-10 mt-auto max-w-lg pb-12"><div className="eyebrow text-moss">Academia-Industry Portal</div><h1 className="mt-5 font-serif text-7xl leading-[.88] tracking-[-.06em]">One verified record. Many pathways.</h1><p className="mt-7 max-w-sm text-sm leading-6 text-paper/55">AYUSH SkillSync turns competency evidence into a clear signal for education, industry, and public outcomes.</p><div className="mt-10 flex items-center gap-3 text-xs text-paper/45"><ShieldCheck size={17} className="text-saffron" /> Real-Time Competency Metrics</div></div></section><section className="flex flex-col px-6 py-7 sm:px-12 lg:px-24"><div className="flex items-center justify-between"><Link href="/" className="lg:hidden"><Brand /></Link><Link href="/" className="ml-auto flex items-center gap-2 text-sm text-ink/50 hover:text-ink"><ArrowLeft size={15} /> Back home</Link></div><div className="mx-auto my-auto w-full max-w-xl py-12"><div className="eyebrow">{isRegistering ? "Create your account" : "Secure sign in"}</div><h2 className="mt-3 font-serif text-5xl tracking-[-.05em]">{isRegistering ? "Give your practice a home." : "Enter your workspace."}</h2><p className="mt-3 text-sm text-ink/55">Select a role to open the right working view.</p><div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">{roles.map((item) => <button type="button" key={item.value} onClick={() => setRole(item.value)} className={`border p-3 text-left transition ${role === item.value ? "border-leaf bg-[#e8eee5]" : "border-ink/10 hover:border-ink/30"}`}><span className="block text-sm font-semibold">{item.label}</span><span className="mt-1 block text-[11px] text-ink/50">{item.caption}</span></button>)}</div><form onSubmit={handleSubmit} className="mt-8 space-y-4">{isRegistering && <label className="block"><span className="mb-2 block text-xs font-semibold text-ink/60">Full name</span><span className="relative block"><UserRound size={16} className="absolute left-3 top-3.5 text-ink/35" /><input name="name" required placeholder="Yash Vardhan" className="w-full border border-ink/15 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-leaf" /></span></label>}<label className="block"><span className="mb-2 block text-xs font-semibold text-ink/60">Email address</span><span className="relative block"><Mail size={16} className="absolute left-3 top-3.5 text-ink/35" /><input name="email" type="email" required placeholder="name@example.com" className="w-full border border-ink/15 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-leaf" /></span></label><label className="block"><span className="mb-2 block text-xs font-semibold text-ink/60">Password</span><span className="relative block"><LockKeyhole size={16} className="absolute left-3 top-3.5 text-ink/35" /><input name="password" type={showPassword ? "text" : "password"} required minLength={8} placeholder="Minimum 8 characters" className="w-full border border-ink/15 bg-white py-3 pl-10 pr-11 text-sm outline-none focus:border-leaf" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-ink/45">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{error && <p role="alert" className="border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3.5 text-sm font-bold text-paper hover:bg-leaf disabled:cursor-wait disabled:opacity-60">{loading ? "Working..." : isRegistering ? "Create account" : "Sign in"}<ArrowRight size={16} /></button></form><p className="mt-6 text-center text-sm text-ink/50">{isRegistering ? "Already registered?" : "New to SkillSync?"} <button type="button" onClick={() => setIsRegistering((value) => !value)} className="font-bold text-leaf hover:text-ink">{isRegistering ? "Sign in" : "Create an account"}</button></p><p className="mt-8 text-center text-xs leading-5 text-ink/40">Demo accounts are available in the project README. Use the role-specific email with the shared demo password.</p></div></section></main>;
}
