"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState } from "react";
import {
  Menu,
  Globe,
  Search,
  User,
  ChevronDown,
  LogIn,
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
  { key: "home", href: "/" },
  { key: "news", href: "/news" },
  { key: "services", href: "/#services" },
  { key: "contacts", href: "#footer" },
] as const;

const mobileNavItems = [
  { key: "news", href: "/news" },
  { key: "sanatorium", href: "/sanatorium" },
  { key: "vacancies", href: "/vacancies" },
  { key: "summerCamp", href: "/summer-camp" },
  { key: "faq", href: "/reorganization-faq" },
  { key: "beautyContest", href: "/beauty-contest" },
  { key: "sports", href: "/sports" },
  { key: "zhylyZhurekpen", href: "/zhyly-zhurekpen" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const isKk = locale === "kk";

  const otherLocale = locale === "kk" ? "ru" : "kk";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <img
              src={isKk ? "/czhs-logo-kk.png" : "/czhs-logo-ru.png"}
              alt={isKk ? "Қазақстан Темір Жолы — Магистральдық желі дирекциясы" : "Қазақстан Темір Жолы — Дирекция магистральной сети"}
              className="h-[73px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const label =
                item.key === "home"
                  ? tc("home")
                  : item.key === "news"
                    ? t("news")
                    : item.key === "services"
                      ? isKk ? "Сервистер" : "Сервисы"
                      : isKk ? "Байланыс" : "Контакты";

              const cls = `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`;

              // Anchor links need native <a> with locale prefix
              if (item.href.includes("#")) {
                return (
                  <a
                    key={item.key}
                    href={`/${locale}${item.href}`}
                    className={cls}
                  >
                    {label}
                  </a>
                );
              }

              return (
                <Link key={item.key} href={item.href} className={cls}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-muted-foreground hover:text-foreground md:flex"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">{tc("search")}</span>
            </Button>

            {/* Language Switcher */}
            <Link
              href={pathname}
              locale={otherLocale}
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:flex"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs">{locale === "kk" ? "RU" : "ҚАЗ"}</span>
            </Link>

            {/* Auth */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden items-center gap-1.5 md:inline-flex"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate text-xs">
                      {session.user.name}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
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
              <Button
                asChild
                size="sm"
                className="hidden gap-1.5 md:inline-flex"
              >
                <Link href="/login">{tc("login")}</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-80">
                <SheetTitle className="text-foreground">
                  {isKk ? "Магистральдық желі дирекциясы" : "Дирекция магистральной сети"}
                </SheetTitle>
                <nav className="mt-6 flex flex-col gap-1">
                  {mobileNavItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                        pathname === item.href
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                  <Link
                    href={pathname}
                    locale={otherLocale}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground"
                  >
                    <Globe className="h-4 w-4" />
                    {locale === "kk" ? "Русский" : "Қазақша"}
                  </Link>
                  {session ? (
                    <Link
                      href="/portal"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground"
                    >
                      <User className="h-4 w-4" />
                      {tc("portal")}
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary"
                    >
                      <LogIn className="h-4 w-4" />
                      {tc("login")}
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
