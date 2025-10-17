"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { en } from "@/i18n/en";
import { ar } from "@/i18n/ar";

export type Locale = "en" | "ar";

type Messages = typeof en;

type LangContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

const STORAGE_KEY = "trip-planner-locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with 'en' to avoid hydration mismatch
  const [locale, setLocale] = useState<Locale>("en");

  // After mount, update locale from localStorage or browser
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved !== locale) {
      setLocale(saved);
      return;
    }
    if (!saved) {
      // Default to English instead of detecting browser language
      setLocale("en");
    }
  }, []);

  const t = useMemo(() => (locale === "ar" ? ar : en), [locale]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {}

    // Apply document attributes for i18n
    const html = document.documentElement;
    html.lang = locale;
    const isRTL = locale === "ar";
    html.dir = isRTL ? "rtl" : "ltr";

    // Toggle a css class to help Tailwind handle RTL if needed
    html.classList.toggle("rtl", isRTL);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}
