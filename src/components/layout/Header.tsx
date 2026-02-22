"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState } from "react";
import {
  Train,
  Menu,
  X,
  Globe,
  LogIn,
  User,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

const navItems = [
  { key: "news", href: "/news" },
  { key: "sanatorium", href: "/sanatorium" },
  { key: "vacancies", href: "/vacancies" },
  { key: "summerCamp", href: "/summer-camp" },
  { key: "faq", href: "/reorganization-faq" },
  { key: "beautyContest", href: "/beauty-contest" },
  { key: "sports", href: "/sports" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const otherLocale = locale === "kk" ? "ru" : "kk";
  const otherLocaleName = locale === "kk" ? "Русский" : "Қазақша";

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="border-b border-[#002D7A] bg-[#003DA5] text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6 text-sm">
            <span className="hidden text-blue-200 sm:inline">{tc("companyName")}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href={pathname}
              locale={otherLocale}
              className="flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors hover:bg-white/10"
            >
              <Globe className="h-3.5 w-3.5" />
              {otherLocaleName}
            </Link>
            <div className="h-4 w-px bg-white/20" />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors hover:bg-white/10">
                    <User className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{session.user.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/portal">{tc("portal")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{tc("profile")}</Link>
                  </DropdownMenuItem>
                  {session.user.role !== "employee" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href="/admin">{tc("admin")}</a>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    {tc("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors hover:bg-white/10"
              >
                <LogIn className="h-3.5 w-3.5" />
                {tc("login")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Logo + Site Name bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={locale === "kk" ? "/logo-kk.png" : "/logo-ru.png"}
              alt={locale === "kk" ? "ҚТЖ" : "КТЖ"}
              className="h-[80px] w-auto object-contain"
            />
            <div>
              <h1 className="text-sm font-bold leading-tight text-[#003DA5] sm:text-lg">
                {tc("appFullName")}
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                {locale === "kk" ? "Ақпараттық портал" : "Информационный портал"}
              </p>
            </div>
          </Link>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="text-[#003DA5]">
                {tc("appFullName")}
              </SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 ${
                      pathname === item.href
                        ? "bg-[#003DA5]/10 font-semibold text-[#003DA5]"
                        : "text-gray-700"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav className="hidden border-b border-gray-200 bg-gray-50 lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-0">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`relative block px-4 py-3 text-sm font-medium transition-colors hover:text-[#003DA5] ${
                    pathname === item.href
                      ? "text-[#003DA5]"
                      : "text-gray-600"
                  }`}
                >
                  {t(item.key)}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003DA5]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
