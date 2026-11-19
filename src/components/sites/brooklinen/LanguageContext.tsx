"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Locale = "en" | "vi";

const STORAGE_KEY = "brooklinen_locale";
const LOCALE_EVENT = "brooklinen:locale-change";

function readClientLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("lang");
    if (fromUrl === "vi" || fromUrl === "en") return fromUrl;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "vi" || saved === "en") return saved;
  } catch {
    // ignore storage access errors
  }
  return "en";
}

function subscribeLocale(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => callback();
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCALE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCALE_EVENT, onChange);
  };
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(
    subscribeLocale,
    readClientLocale,
    () => "en"
  );

  const setLocale = useCallback((next: Locale) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      const url = new URL(window.location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.set("lang", next);
        window.history.replaceState({}, "", url.toString());
      }
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("lang");
      if (fromUrl === "vi" || fromUrl === "en") {
        window.localStorage.setItem(STORAGE_KEY, fromUrl);
      }
    } catch {
      // ignore
    }
    document.title =
      locale === "vi"
        ? "Chăn Ga Gối Đệm & Đồ Tắm Cao Cấp | Brooklinen"
        : "Luxury Bedding, Sheets & Comforters Online | Brooklinen";
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export function LanguageSwitcher({
  variant = "light",
}: {
  variant?: "dark" | "light" | "compact";
}) {
  const { locale, setLocale } = useLanguage();

  const containerClass =
    variant === "dark"
      ? "inline-flex items-center rounded-full border border-white/35 bg-white/10 p-0.5 text-[11.5px] font-bold"
      : variant === "compact"
        ? "inline-flex items-center rounded-full border border-[#283455]/30 bg-white p-0.5 text-[11.5px] font-bold"
        : "inline-flex items-center rounded-full border border-[#283455]/25 bg-white/90 p-0.5 text-[12px] font-bold";

  const activeClass =
    variant === "dark"
      ? "bg-white text-[#283455]"
      : "bg-[#283455] text-white";

  const inactiveClass =
    variant === "dark"
      ? "text-white/85 hover:text-white"
      : "text-[#283455]/75 hover:text-[#283455]";

  return (
    <div
      role="group"
      aria-label={locale === "vi" ? "Chọn ngôn ngữ" : "Choose language"}
      className={containerClass}
    >
      <button
        type="button"
        lang="en"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
        className={`cursor-pointer rounded-full px-2.5 py-1 leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#283455] ${
          locale === "en" ? activeClass : inactiveClass
        }`}
      >
        EN
      </button>
      <button
        type="button"
        lang="vi"
        aria-pressed={locale === "vi"}
        onClick={() => setLocale("vi")}
        className={`cursor-pointer rounded-full px-2.5 py-1 leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#283455] ${
          locale === "vi" ? activeClass : inactiveClass
        }`}
      >
        VI
      </button>
    </div>
  );
}
