"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, Vote, Trophy, TrendingUp, HelpCircle } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { hasPermission, type UserRole } from "@/lib/permissions";

export function DashboardClient({
  stats,
  userRole,
}: {
  stats: { newsCount: number; usersCount: number; votesCount: number };
  userRole: string;
}) {
  const { t, locale } = useAdminLocale();
  const role = userRole as UserRole;
  const isFullAdmin = role === "super_admin" || role === "admin";

  const statCards = [
    { title: t("dash.news"), value: stats.newsCount, icon: Newspaper, color: "text-blue-600", bg: "bg-blue-50", perm: "news:read" },
    { title: t("dash.users"), value: stats.usersCount, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", perm: "admin:access" },
    { title: t("dash.votes"), value: stats.votesCount, icon: Vote, color: "text-purple-600", bg: "bg-purple-50", perm: "contest:read" },
  ].filter((s) => isFullAdmin || hasPermission(role, s.perm));

  // Hide users/votes stat for non-admin roles that don't have those permissions
  const visibleStats = isFullAdmin
    ? statCards
    : statCards.filter((s) => s.perm === "news:read" ? hasPermission(role, "news:read") : isFullAdmin);

  const quickActions = [
    { href: "/admin/news", icon: Newspaper, label: locale === "kk" ? "Барлық жаңалықтар" : "Все новости", color: "text-blue-600", perm: "news:read" },
    { href: "/admin/news/new", icon: Newspaper, label: t("dash.addNews"), color: "text-blue-600", perm: "news:create" },
    { href: "/admin/sports/new", icon: Trophy, label: t("dash.addSport"), color: "text-red-600", perm: "sports:create" },
    { href: "/admin/faq/new", icon: HelpCircle, label: t("dash.addFaq"), color: "text-purple-600", perm: "faq:create" },
  ].filter((a) => isFullAdmin || hasPermission(role, a.perm));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003DA5]">{t("dash.title")}</h1>
        <p className="text-muted-foreground">{t("dash.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quickActions.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#003DA5]" />
                {t("dash.quickActions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                  {action.label}
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {isFullAdmin && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#003DA5]" />
                {t("dash.sysInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("dash.platform")}</span>
                <span className="font-medium">Next.js + Drizzle ORM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("dash.database")}</span>
                <span className="font-medium">Neon PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("dash.hosting")}</span>
                <span className="font-medium">Vercel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("dash.languages")}</span>
                <span className="font-medium">Қазақша / Русский</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
