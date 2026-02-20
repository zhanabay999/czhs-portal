import { db } from "@/db";
import { newsArticles, users, vacancies, votes, sportsEvents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, Briefcase, Vote, Trophy, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  let stats = { newsCount: 0, usersCount: 0, vacanciesCount: 0, votesCount: 0 };

  try {
    const [nc] = await db.select({ count: sql<number>`count(*)` }).from(newsArticles);
    const [uc] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [vc] = await db.select({ count: sql<number>`count(*)` }).from(vacancies).where(eq(vacancies.status, "published"));
    const [voc] = await db.select({ count: sql<number>`count(*)` }).from(votes);
    stats = {
      newsCount: Number(nc.count),
      usersCount: Number(uc.count),
      vacanciesCount: Number(vc.count),
      votesCount: Number(voc.count),
    };
  } catch {}

  const statCards = [
    { title: "Жаңалықтар", value: stats.newsCount, icon: Newspaper, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Пайдаланушылар", value: stats.usersCount, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Вакансиялар", value: stats.vacanciesCount, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Дауыстар", value: stats.votesCount, icon: Vote, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003DA5]">Dashboard</h1>
        <p className="text-muted-foreground">ЦЖС Порталы басқару панелі</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              Жылдам әрекеттер
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <a href="/admin/news/new" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <Newspaper className="h-4 w-4 text-blue-600" />
              Жаңалық қосу
            </a>
            <a href="/admin/vacancies/new" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <Briefcase className="h-4 w-4 text-amber-600" />
              Вакансия қосу
            </a>
            <a href="/admin/sports/new" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <Trophy className="h-4 w-4 text-red-600" />
              Спорт іс-шара
            </a>
            <a href="/admin/faq/new" className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-secondary">
              <Vote className="h-4 w-4 text-purple-600" />
              FAQ қосу
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#003DA5]" />
              Жүйе ақпараты
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Платформа</span>
              <span className="font-medium">Next.js + Drizzle ORM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Деректер қоры</span>
              <span className="font-medium">Neon PostgreSQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Хостинг</span>
              <span className="font-medium">Vercel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Тілдер</span>
              <span className="font-medium">Қазақша / Русский</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
