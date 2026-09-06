"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, CircleUserRound, FileBadge, LayoutDashboard, LogOut, Search, Settings2, Sprout, UsersRound } from "lucide-react";
import { Brand } from "./brand";

const links = [["/dashboard", "Overview", LayoutDashboard], ["/match", "Find your fit", Search], ["/passport", "Skill passport", FileBadge]] as const;

export function SiteHeader() {
  const path = usePathname();
  return <header className="absolute left-0 right-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
    <Link href="/"><Brand /></Link>
    <nav className="hidden items-center gap-7 text-sm font-medium text-ink/60 md:flex"><Link href="/" className="hover:text-ink">The initiative</Link><Link href="/match" className="hover:text-ink">Explore opportunities</Link><Link href="/dashboard" className="hover:text-ink">For organisations</Link></nav>
    <Link href={path === "/" ? "/login" : "/"} className="flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-2 text-sm font-semibold hover:bg-white">{path === "/" ? "Enter platform" : "Return home"}<ChevronRight size={15} /></Link>
  </header>;
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <div className="min-h-screen bg-paper text-ink lg:flex"><aside className="hidden w-64 shrink-0 flex-col border-r border-ink/10 bg-[#eef1ea] p-5 lg:flex"><Link href="/" className="mb-12 px-2"><Brand /></Link><div className="eyebrow mb-4 px-3">Your workspace</div><nav className="space-y-1">{links.map(([href, label, Icon]) => <Link key={href} href={href} className={`portal-link ${path === href ? "active" : ""}`}><Icon size={17} />{label}</Link>)}</nav><div className="mt-10 eyebrow mb-4 px-3">Community</div><nav className="space-y-1"><Link href="/dashboard" className="portal-link"><UsersRound size={17} />Mentor network</Link><Link href="/dashboard" className="portal-link"><Sprout size={17} />AYUSH taxonomy</Link></nav><div className="mt-auto border-t border-ink/10 pt-4"><div className="portal-link"><CircleUserRound size={17} /><span className="flex-1">Arjun Mehta<small className="block text-[11px] text-ink/40">Student account</small></span><Settings2 size={15} /></div><Link href="/" className="portal-link text-ink/40"><LogOut size={16} />Sign out</Link></div></aside><main className="min-w-0 flex-1">{children}</main></div>;
}