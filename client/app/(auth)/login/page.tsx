"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Brand } from "../../../components/brand";
import { roleHome } from "../../../components/auth-context";
import { useLanguage } from "../../../components/language-context";
import { login, register, Role } from "../../../lib/api";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-paper">
          <p className="eyebrow">Loading workspace...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { dictionary } = useLanguage();
  const copy = dictionary.auth;
  const nav = dictionary.nav;
  const roles: { value: Role; label: string; caption: string }[] = [
    {
      value: "student",
      label: nav.roleStudent,
      caption: copy.roleStudentCaption,
    },
    {
      value: "institution",
      label: nav.roleInstitution,
      caption: copy.roleInstitutionCaption,
    },
    {
      value: "employer",
      label: nav.roleEmployer,
      caption: copy.roleEmployerCaption,
    },
    { value: "mentor", label: nav.roleMentor, caption: copy.roleMentorCaption },
    { value: "admin", label: nav.roleAdmin, caption: copy.roleAdminCaption },
  ];
  const params = useSearchParams();
  const router = useRouter();
  const requestedRole = params.get("role") as Role;
  const [role, setRole] = useState<Role>(
    roles.some((item) => item.value === requestedRole)
      ? requestedRole
      : "student",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const selectedRole = roles.find((item) => item.value === role) || roles[0];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = registering
        ? await register({
            name: String(form.get("name")),
            email: String(form.get("email")),
            password: String(form.get("password")),
            role,
          })
        : await login(String(form.get("email")), String(form.get("password")));
      router.push(roleHome(response.user.role));
    } catch (reason) {
      setError((reason as Error).message || copy.unable);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-paper text-ink lg:grid-cols-[.8fr_1.2fr]">
      <section className="relative hidden overflow-hidden bg-ink p-10 text-paper lg:flex lg:flex-col">
        <Link href="/">
          <Brand light />
        </Link>
        <div className="mt-auto max-w-lg pb-12">
          <p className="eyebrow text-moss">{copy.eyebrow}</p>
          <h1 className="mt-5 font-serif text-6xl leading-[.9] tracking-[-.06em]">
            {copy.oneRecord}
          </h1>
          <p className="mt-7 max-w-sm text-sm leading-6 text-paper/55">
            {copy.recordDescription}
          </p>
          <div className="mt-10 flex items-center gap-3 text-xs text-paper/45">
            <ShieldCheck size={17} className="text-saffron" />{" "}
            {copy.secureAccess}
          </div>
        </div>
      </section>
      <section className="flex flex-col px-5 py-7 sm:px-10 lg:px-24">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden">
            <Brand />
          </Link>
          <Link
            href="/"
            className="ml-auto flex items-center gap-2 text-sm text-ink/50 hover:text-ink"
          >
            <ArrowLeft size={15} />
            {copy.backHome}
          </Link>
        </div>
        <div className="mx-auto my-auto w-full max-w-xl py-12">
          <p className="eyebrow">
            {registering ? copy.createAccount : copy.secureSignIn}
          </p>
          <h2 className="mt-3 font-serif text-5xl tracking-[-.05em]">
            {registering ? copy.givePracticeHome : copy.enterWorkspace}
          </h2>
          <p className="mt-3 text-sm text-ink/55">{copy.selectRole}</p>
          <div className="relative mt-8">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex w-full items-center justify-between border border-ink/15 bg-white px-4 py-3.5 text-left transition hover:border-leaf focus:border-leaf focus:outline-none"
            >
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-ink/40">
                  {copy.roleLabel}
                </span>
                <span className="mt-1 block text-sm font-semibold">
                  {selectedRole.label}
                </span>
                <span className="mt-0.5 block text-xs text-ink/50">
                  {selectedRole.caption}
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`text-ink/45 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16 }}
                  className="absolute z-10 mt-2 w-full border border-ink/10 bg-white p-1 shadow-xl"
                  role="listbox"
                >
                  {roles.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      role="option"
                      aria-selected={role === item.value}
                      onClick={() => {
                        setRole(item.value);
                        setMenuOpen(false);
                      }}
                      className={`flex w-full items-start justify-between px-3 py-2.5 text-left transition hover:bg-[#edf3ed] ${role === item.value ? "bg-[#e8eee5]" : ""}`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink/50">
                          {item.caption}
                        </span>
                      </span>
                      {role === item.value && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-leaf" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {registering && (
              <Field
                label={copy.fullName}
                name="name"
                placeholder={copy.namePlaceholder}
                icon={<UserRound size={18} />}
                required
              />
            )}
            <Field
              label={copy.email}
              name="email"
              placeholder={copy.emailPlaceholder}
              icon={<Mail size={18} />}
              required
            />
            <Field
              label={copy.password}
              name="password"
              placeholder={copy.passwordPlaceholder}
              type={visible ? "text" : "password"}
              icon={<LockKeyhole size={18} />}
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setVisible((current) => !current)}
                  aria-label={visible ? copy.hidePassword : copy.showPassword}
                  className="absolute right-3 top-3.5 text-ink/40 hover:text-ink"
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            {error && (
              <p
                role="alert"
                className="border border-coral/30 bg-coral/10 p-3 text-sm text-coral"
              >
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="flex w-full items-center justify-center gap-3 bg-ink px-4 py-3.5 text-sm font-bold text-paper transition hover:bg-leaf disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? copy.working : registering ? copy.register : copy.login}
              <ArrowRight size={17} />
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setRegistering((current) => !current);
              setError("");
            }}
            className="mx-auto mt-8 block text-sm text-ink/55 hover:text-leaf"
          >
            {registering ? copy.switchToLogin : copy.switchToRegister}
          </button>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  icon,
  required = false,
  trailing,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  required?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-ink/60">
        {label}
      </span>
      <span className="relative block">
        {icon && (
          <span className="absolute left-3 top-3.5 text-ink/35">{icon}</span>
        )}
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full border border-ink/15 bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-leaf"
        />
        {trailing}
      </span>
    </label>
  );
}
