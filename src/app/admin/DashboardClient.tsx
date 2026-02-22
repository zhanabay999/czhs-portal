"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, Vote, Trophy, TrendingUp, HelpCircle } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

export function DashboardClient({ stats }: { stats: { newsCount: number; usersCount: number; votesCount: number } }) {
  const { t } = useAdminLocale();

  const statCards = [
    { title: t("dash.news"), value: stats.newsCount, icon: Newspaper, color: "text-blue-600", bg: "bg-blue-50" },
    { title: t("dash.users"), value: stats.usersCount, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: t("dash.votes"), value: stats.votesCount, icon: Vote, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003DA5]">{t("dash.title")}</h1>
        <p className="text-muted-foreground">{t("dash.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#003DA5]" />
              {t("dash.quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <a href="/admin/news/new" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <Newspaper className="h-4 w-4 text-blue-600" />
              {t("dash.addNews")}
            </a>
            <a href="/admin/sports/new" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <Trophy className="h-4 w-4 text-red-600" />
              {t("dash.addSport")}
            </a>
            <a href="/admin/faq/new" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <HelpCircle className="h-4 w-4 text-purple-600" />
              {t("dash.addFaq")}
            </a>
            <a href="https://job.railways.kz/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <Trophy className="h-4 w-4 text-amber-600" />
              job.railways.kz ↗
            </a>
          </CardContent>
        </Card>

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
    </div>
  );
}
