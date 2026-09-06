"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role, User } from "../lib/api";

type AuthContextValue = { user: User | null; signOut: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    function loadUser() {
      const stored = window.localStorage.getItem("ayush_skillsync_user");
      if (stored) { try { setUser(JSON.parse(stored) as User); } catch { window.localStorage.removeItem("ayush_skillsync_user"); } }
      else setUser(null);
    }
    loadUser();
    window.addEventListener("ayush-auth-changed", loadUser);
    return () => window.removeEventListener("ayush-auth-changed", loadUser);
  }, []);
  function signOut() {
    window.localStorage.removeItem("ayush_skillsync_token");
    window.localStorage.removeItem("ayush_skillsync_user");
    window.dispatchEvent(new Event("ayush-auth-changed"));
    setUser(null);
  }
  return <AuthContext.Provider value={useMemo(() => ({ user, signOut }), [user])}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export function roleLabel(role: Role | undefined) {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest";
}

export function roleHome(role: Role) {
  return { student: "/dashboard/student", institution: "/dashboard/institution", employer: "/dashboard/employer", mentor: "/dashboard/mentor", admin: "/dashboard/admin" }[role];
}