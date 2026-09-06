"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../messages/en.json";
import hi from "../messages/hi.json";

export type Locale = "en" | "hi";
type Dictionary = typeof en;

type LanguageContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("ayush_skillsync_locale");
    if (saved === "en" || saved === "hi") setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function toggleLocale() {
    setLocale((current) => {
      const next = current === "en" ? "hi" : "en";
      window.localStorage.setItem("ayush_skillsync_locale", next);
      return next;
    });
  }

  const value = useMemo(() => ({ locale, dictionary: locale === "en" ? en : hi, toggleLocale }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}