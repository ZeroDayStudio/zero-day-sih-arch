"use client";

import Link from "next/link";
import { ArrowLeft, Globe2, LogOut, Settings2 } from "lucide-react";
import { PortalShell } from "../../components/site-shell";
import { useAuth, roleHome, roleLabel } from "../../components/auth-context";
import { useLanguage } from "../../components/language-context";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { locale, toggleLocale, dictionary } = useLanguage();
  const copy = dictionary.settings;
  if (!user) return null;
  return <PortalShell><div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12"><Link href={roleHome(user.role)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55 hover:text-leaf"><ArrowLeft size={16} />{copy.back}</Link><header className="mt-8"><p className="eyebrow">{copy.eyebrow}</p><h1 className="mt-2 font-serif text-4xl tracking-[-.04em] sm:text-5xl">{copy.title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">{copy.description}</p></header><div className="mt-8 grid max-w-3xl gap-4"><section className="border border-ink/10 bg-paper p-6"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-moss text-lg font-bold text-ink">{user.name.charAt(0).toUpperCase()}</span><div><h2 className="font-semibold">{user.name}</h2><p className="text-sm text-ink/50">{user.email}</p></div></div><dl className="mt-6 grid gap-4 border-t border-ink/10 pt-5 text-sm sm:grid-cols-2"><div><dt className="text-ink/50">{copy.role}</dt><dd className="mt-1 font-semibold">{roleLabel(user.role)}</dd></div><div><dt className="text-ink/50">{copy.institutionCode}</dt><dd className="mt-1 font-semibold">{user.institutionCode || copy.notLinked}</dd></div></dl></section><section className="border border-ink/10 bg-paper p-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Globe2 size={19} className="text-leaf" /><div><h2 className="font-semibold">{copy.interfaceLanguage}</h2><p className="text-sm text-ink/50">{copy.currentLanguage}: {locale === "en" ? copy.english : copy.hindi}</p></div></div><button onClick={toggleLocale} className="border border-ink/15 px-4 py-2 text-sm font-semibold hover:border-leaf">{copy.switchTo} {locale === "en" ? copy.hindi : copy.english}</button></div></section><section className="border border-coral/20 bg-coral/5 p-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Settings2 size={19} className="text-coral" /><div><h2 className="font-semibold">{copy.session}</h2><p className="text-sm text-ink/50">{copy.signOutDescription}</p></div></div><button onClick={signOut} className="flex items-center gap-2 bg-coral px-4 py-2 text-sm font-semibold text-paper"><LogOut size={16} />{copy.signOut}</button></div></section></div></div></PortalShell>;
}
