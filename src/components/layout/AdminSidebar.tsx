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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasPermission, ADMIN_NAV_ITEMS, type UserRole } from "@/lib/permissions";
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

export function AdminSidebar({
  userRole,
  userName,
}: {
  userRole: UserRole;
  userName: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = ADMIN_NAV_ITEMS.filter((item) => {
    if (item.superAdminOnly && userRole !== "super_admin") return false;
    return hasPermission(userRole, item.permission);
  });

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    news: "Жаңалықтар",
    sanatorium: "Санаторий",
    vacancies: "Вакансиялар",
    summerCamp: "Жазғы лагерь",
    faq: "FAQ",
    contest: "Конкурс",
    sports: "Спорт",
    users: "Пайдаланушылар",
    settings: "Баптаулар",
  };

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
            <p className="truncate text-sm font-bold text-white">ЦЖС Admin</p>
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-gray-400 hover:bg-sidebar-accent/50 hover:text-white"
                  }`}
                  title={collapsed ? labelMap[item.title] : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{labelMap[item.title]}</span>}
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
        <button
          onClick={() => signOut({ callbackUrl: "/kk/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-sidebar-accent/50 hover:text-white"
          title={collapsed ? "Шығу" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Шығу</span>}
        </button>
      </div>
    </aside>
  );
}
