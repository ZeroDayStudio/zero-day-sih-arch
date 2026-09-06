"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Menu, Settings2, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";
import { useLanguage } from "./language-context";
import { roleHome, roleLabel, roleNavigation, useAuth } from "./auth-context";

export function GlobalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, dictionary, toggleLocale } = useLanguage();
  const { user, signOut } = useAuth();
  const copy = dictionary.nav;
  const workspace = user ? roleHome(user.role) : "/login";
  const links = user ? [["/", copy.home], ...roleNavigation(user.role).map((item) => [item.href, item.label])] : [["/", copy.home], ["/match", copy.opportunities], ["/login", copy.signIn]];

  return <>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper">Skip to content</a>
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur" role="banner">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        <Link href="/" aria-label="AYUSH SkillSync home"><Brand /></Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-ink/5 ${pathname === href ? "text-leaf" : "text-ink/65"}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleLocale} aria-label={`${copy.language}: switch to ${locale === "en" ? "Hindi" : "English"}`} className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-2.5 py-2 text-xs font-bold hover:bg-ink/5"><Globe2 size={15} aria-hidden="true" /><span className={locale === "en" ? "text-leaf" : "text-ink/40"}>En</span><span className="text-ink/25">/</span><span className={locale === "hi" ? "text-leaf" : "text-ink/40"}>हि</span></button>
          {user ? <div className="hidden items-center gap-2 sm:flex"><Link href="/settings" aria-label="Open account settings" className="flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 text-left hover:bg-ink/5"><span className="grid h-7 w-7 place-items-center rounded-full bg-moss text-xs font-bold text-ink">{user.name.charAt(0).toUpperCase()}</span><span><strong className="block max-w-28 truncate text-xs">{user.name}</strong><small className="block text-[10px] text-ink/50">{roleLabel(user.role)}</small></span></Link><Link href="/settings" aria-label="Settings" className="rounded-lg border border-ink/15 p-2 text-ink/60 hover:bg-ink/5"><Settings2 size={16} /></Link><button type="button" onClick={signOut} className="rounded-lg border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/60 hover:bg-ink/5">Sign out</button></div> : <Link href="/login" className="hidden rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-leaf sm:block">{copy.signIn}</Link>}
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} className="rounded-lg border border-ink/15 p-2 md:hidden">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      {mobileOpen && <nav className="border-t border-ink/10 bg-paper px-5 py-3 md:hidden" aria-label="Mobile navigation">
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block border-b border-ink/10 px-2 py-3 text-sm font-medium">{label}</Link>)}
        {user ? <><Link href={workspace} onClick={() => setMobileOpen(false)} className="block px-2 py-3 text-sm font-semibold text-leaf">{user.name} · {roleLabel(user.role)}</Link><button type="button" onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full px-2 py-3 text-left text-sm text-ink/55">Sign out</button></> : <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-2 py-3 text-sm font-semibold text-leaf">{copy.signIn}</Link>}
      </nav>}
    </header>
  </>;
}

export function GlobalFooter() {
  const { dictionary } = useLanguage();
  const copy = dictionary.footer;
  return <footer className="border-t border-ink/10 bg-[#edf2f4]" role="contentinfo"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-10"><div><Brand /><p className="mt-2 max-w-xs text-xs leading-5 text-ink/50">{copy.description}</p><p className="mt-3 text-xs font-medium text-ink/60">Developed by Yash Vardhan | Team Zero Day | Smart India Hackathon 2026 | SIH26044</p></div><div className="flex items-center gap-5 text-xs text-ink/50"><Link href="/" className="hover:text-ink">{copy.privacy}</Link><Link href="/" className="hover:text-ink">{copy.accessibility}</Link></div></div></footer>;
}
