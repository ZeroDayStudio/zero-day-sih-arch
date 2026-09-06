"use client";

import { ShieldCheck } from "lucide-react";
import { PortalShell } from "../../../components/site-shell";
import { VerificationQueue } from "../../../components/verification-queue";
import { useAuth } from "../../../components/auth-context";

export default function MentorDashboard() { const { user } = useAuth(); return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><p className="eyebrow">Mentor workspace</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Mentor evaluations</h1><p className="mt-3 text-sm text-ink/55">Welcome, {user?.name || "mentor"}. Review evidence and keep learning outcomes legible.</p><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.7fr]"><VerificationQueue /><div className="bg-ink p-6 text-paper"><ShieldCheck className="text-saffron" /><h2 className="mt-8 font-serif text-3xl">Evidence is a conversation.</h2><p className="mt-4 text-sm leading-6 text-paper/60">Use the queue to validate submitted work against observable practice.</p></div></div></div></PortalShell>; }
