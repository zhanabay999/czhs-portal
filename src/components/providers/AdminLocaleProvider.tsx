"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type AdminLocale, adminT, getAdminLocaleFromCookie, setAdminLocaleCookie } from "@/lib/admin-i18n";

type AdminLocaleContextType = {
  locale: AdminLocale;
  setLocale: (l: AdminLocale) => void;
  t: (key: string) => string;
};

const AdminLocaleContext = createContext<AdminLocaleContextType>({
  locale: "ru",
  setLocale: () => {},
  t: (key) => key,
});

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(() => getAdminLocaleFromCookie());

  const setLocale = useCallback((l: AdminLocale) => {
    setLocaleState(l);
    setAdminLocaleCookie(l);
  }, []);

  const t = useCallback((key: string) => adminT(key, locale), [locale]);

  return (
    <AdminLocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  return useContext(AdminLocaleContext);
}
