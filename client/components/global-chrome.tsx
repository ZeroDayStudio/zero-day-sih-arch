"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";
import { useLanguage } from "./language-context";
import { useAuth } from "./auth-context";

export function GlobalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, dictionary, toggleLocale } = useLanguage();
  const { user } = useAuth();
  const copy = dictionary.nav;
  const workspace = user?.role === "institution" ? "/dashboard/institution" : user?.role === "student" ? "/dashboard/student" : user?.role === "employer" ? "/dashboard/employer" : user?.role === "mentor" ? "/dashboard/mentor" : user?.role === "admin" ? "/dashboard/admin" : "/dashboard";
  const links = [["/", copy.home], ["/match", copy.opportunities], [workspace, copy.dashboard], ["/passport", copy.passport]];
  return <><a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper">Skip to content</a><header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur" role="banner"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10"><Link href="/" aria-label="Nadi home"><Brand /></Link><nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-ink/5 ${pathname === href ? "text-leaf" : "text-ink/65"}`}>{label}</Link>)}</nav><div className="flex items-center gap-2"><button type="button" onClick={toggleLocale} aria-label={`${copy.language}: switch to ${locale === "en" ? "Hindi" : "English"}`} className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-2.5 py-2 text-xs font-bold hover:bg-ink/5"><Globe2 size={15} aria-hidden="true" /><span className={locale === "en" ? "text-leaf" : "text-ink/40"}>En</span><span className="text-ink/25">/</span><span className={locale === "hi" ? "text-leaf" : "text-ink/40"}>हि</span></button><Link href="/login" className="hidden rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-leaf sm:block">{copy.signIn}</Link><button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} className="rounded-lg border border-ink/15 p-2 md:hidden">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button></div></div>{mobileOpen && <nav className="border-t border-ink/10 bg-paper px-5 py-3 md:hidden" aria-label="Mobile navigation">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block border-b border-ink/5 py-3 text-sm font-medium last:border-0">{label}</Link>)}</nav>}</header></>;
}

export function GlobalFooter() {
  const { dictionary } = useLanguage();
  const copy = dictionary.footer;
  return <footer className="border-t border-ink/10 bg-[#edf2f4]" role="contentinfo"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-10"><div><Brand /><p className="mt-2 max-w-xs text-xs leading-5 text-ink/50">{copy.description}</p><p className="mt-3 text-xs font-medium text-ink/60">Developed by Yash Vardhan | Team Zero Day | Smart India Hackathon 2026 | SIH26044</p></div><div className="flex items-center gap-5 text-xs text-ink/50"><Link href="/" className="hover:text-ink">{copy.privacy}</Link><Link href="/" className="hover:text-ink">{copy.accessibility}</Link></div></div></footer>;
}