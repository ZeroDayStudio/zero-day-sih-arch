/**
 * @fileoverview Shared navigation and role-aware portal layout.
 * Keeps workspace navigation consistent while enforcing the client-side role
 * boundary before protected page content is rendered.
 *
 * @author Yash Vardhan
 * @see https://github.com/Yash-pluto/zero-day-sih-arch
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ChevronRight,
  CircleUserRound,
  FileBadge,
  LayoutDashboard,
  LogOut,
  Search,
  Settings2,
  Sprout,
} from "lucide-react";
import { Brand } from "./brand";
import { roleHome, roleLabel, roleNavigation, useAuth } from "./auth-context";
import { useLanguage } from "./language-context";

export function SiteHeader() {
  const path = usePathname();
  const { dictionary } = useLanguage();
  const copy = dictionary.nav;
  return (
    <header className="absolute left-0 right-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
      <Link href="/">
        <Brand />
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-medium text-ink/60 md:flex">
        <Link href="/" className="hover:text-ink">
          {copy.home}
        </Link>
        <Link href="/match" className="hover:text-ink">
          {copy.opportunities}
        </Link>
        <Link href="/dashboard" className="hover:text-ink">
          {copy.dashboard}
        </Link>
      </nav>
      <Link
        href={path === "/" ? "/login" : "/"}
        className="flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-2 text-sm font-semibold hover:bg-white"
      >
        {path === "/" ? copy.signIn : copy.home}
        <ChevronRight size={15} />
      </Link>
    </header>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { user, ready, signOut } = useAuth();
  const { dictionary } = useLanguage();
  const copy = dictionary.nav;
  const requiredRole =
    path.startsWith("/dashboard/student") ||
    path.startsWith("/match/") ||
    path.startsWith("/passport")
      ? "student"
      : path.startsWith("/dashboard/institution")
        ? "institution"
        : path.startsWith("/dashboard/employer")
          ? "employer"
          : path.startsWith("/dashboard/mentor")
            ? "mentor"
            : path.startsWith("/dashboard/admin")
              ? "admin"
              : undefined;
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (requiredRole && user.role !== requiredRole)
      router.replace(roleHome(user.role));
  }, [ready, requiredRole, router, user]);
  if (!ready || !user || (requiredRole && user.role !== requiredRole))
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <p className="eyebrow">{dictionary.auth.loading}</p>
      </div>
    );
  const iconFor = (href: string) =>
    href.includes("opportunities/new")
      ? FileBadge
      : href === "/taxonomy"
        ? Sprout
        : href === "/match"
          ? Search
          : LayoutDashboard;
  const links = roleNavigation(user.role, copy).map(
    (item) => [item.href, item.label, iconFor(item.href)] as const,
  );
  const labels = {
    student: copy.roleStudent,
    institution: copy.roleInstitution,
    employer: copy.roleEmployer,
    mentor: copy.roleMentor,
    admin: copy.roleAdmin,
  };
  return (
    <div className="min-h-screen bg-paper text-ink lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/10 bg-[#eef1ea] p-5 lg:flex">
        <Link href="/" className="mb-12 px-2">
          <Brand />
        </Link>
        <div className="eyebrow mb-4 px-3">{`${roleLabel(user.role, labels)} workspace`}</div>
        <nav className="space-y-1">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={`portal-link ${path === href ? "active" : ""}`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-ink/10 pt-4">
          <Link
            href="/settings"
            className="portal-link"
            aria-label={copy.settings}
          >
            <CircleUserRound size={17} />
            <span className="flex-1">
              {user.name}
              <small className="block text-[11px] text-ink/40">
                {roleLabel(user.role, labels)} account
              </small>
            </span>
            <Settings2 size={15} />
          </Link>
          <button
            onClick={signOut}
            className="portal-link w-full text-left text-ink/40"
          >
            <LogOut size={16} />
            {copy.signOut}
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
