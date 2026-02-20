"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState } from "react";
import {
  Train,
  Menu,
  X,
  ChevronDown,
  Globe,
  LogIn,
  User,
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top bar */}
      <div className="bg-[#003DA5] text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-sm">
          <span className="hidden sm:inline">{tc("companyName")}</span>
          <div className="flex items-center gap-4">
            <Link
              href={pathname}
              locale={otherLocale}
              className="flex items-center gap-1 transition-colors hover:text-[#C8A951]"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase">{otherLocale}</span>
            </Link>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 transition-colors hover:text-[#C8A951]">
                    <User className="h-3.5 w-3.5" />
                    <span>{session.user.name}</span>
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
                className="flex items-center gap-1 transition-colors hover:text-[#C8A951]"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{tc("login")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003DA5]">
              <Train className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-bold leading-tight text-[#003DA5]">
                {tc("appName")}
              </p>
              <p className="text-xs text-muted-foreground">
                {tc("appFullName")}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-[#003DA5] ${
                  pathname === item.href
                    ? "bg-secondary text-[#003DA5]"
                    : "text-foreground"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Mobile nav trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="text-[#003DA5]">
                {tc("appName")}
              </SheetTitle>
              <nav className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                      pathname === item.href
                        ? "bg-secondary text-[#003DA5]"
                        : "text-foreground"
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
    </header>
  );
}
