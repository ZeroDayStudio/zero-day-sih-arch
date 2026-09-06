"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { roleHome, useAuth } from "../../components/auth-context";

export default function DashboardRedirect() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => { router.replace(user ? roleHome(user.role) : "/login"); }, [router, user]);
  return <main className="grid min-h-screen place-items-center bg-paper"><p className="eyebrow">Opening your workspace...</p></main>;
}
