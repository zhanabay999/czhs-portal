"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Newspaper,
  Heart,
  Briefcase,
  Sun,
  HelpCircle,
  Crown,
  Trophy,
  Users,
  Settings,
  LogOut,
  Train,
  ChevronLeft,
  Home,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasPermission, ADMIN_NAV_ITEMS, type UserRole } from "@/lib/permissions";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Newspaper,
  Heart,
  Briefcase,
  Sun,
  HelpCircle,
  Crown,
  Trophy,
  Users,
  Settings,
};

const sidebarKeyMap: Record<string, string> = {
  dashboard: "sidebar.dashboard",
  news: "sidebar.news",
  sanatorium: "sidebar.sanatorium",
  summerCamp: "sidebar.summerCamp",
  faq: "sidebar.faq",
  contest: "sidebar.contest",
  sports: "sidebar.sports",
  users: "sidebar.users",
  settings: "sidebar.settings",
};

export function AdminSidebar({
  userRole,
  userName,
}: {
  userRole: UserRole;
  userName: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { locale, setLocale, t } = useAdminLocale();

  const navItems = ADMIN_NAV_ITEMS.filter((item) => {
    if (item.superAdminOnly && userRole !== "super_admin") return false;
    return hasPermission(userRole, item.permission);
  });

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-sidebar-border bg-[#0A1628] text-sidebar-foreground transition-all ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-sidebar-border p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#003DA5]">
          <Train className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold text-white">{t("sidebar.title")}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-6 w-6 shrink-0 text-gray-400 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Language switcher */}
      <div className="border-b border-sidebar-border px-2 py-2">
        {collapsed ? (
          <button
            onClick={() => setLocale(locale === "kk" ? "ru" : "kk")}
            className="flex w-full items-center justify-center rounded-lg py-1.5 text-xs font-bold text-[#C8A951] transition-colors hover:bg-sidebar-accent/50"
            title={locale === "kk" ? "Русский" : "Қазақша"}
          >
            {locale === "kk" ? "RU" : "ҚАЗ"}
          </button>
        ) : (
          <div className="flex rounded-lg bg-sidebar-accent/30 p-0.5">
            <button
              onClick={() => setLocale("kk")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                locale === "kk"
                  ? "bg-[#003DA5] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Қазақша
            </button>
            <button
              onClick={() => setLocale("ru")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                locale === "ru"
                  ? "bg-[#003DA5] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Русский
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const label = t(sidebarKeyMap[item.title] || item.title);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-gray-400 hover:bg-sidebar-accent/50 hover:text-white"
                  }`}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <p className="mb-2 truncate px-3 text-xs text-gray-500">{userName}</p>
        )}
        <Link
          href="/kk"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-sidebar-accent/50 hover:text-white"
          title={collapsed ? t("sidebar.home") : undefined}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t("sidebar.home")}</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/kk/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-sidebar-accent/50 hover:text-white"
          title={collapsed ? t("sidebar.logout") : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t("sidebar.logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
