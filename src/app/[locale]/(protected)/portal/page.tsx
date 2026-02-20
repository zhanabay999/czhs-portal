import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Newspaper, Heart, Crown, Trophy, Briefcase, Sun, User, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ locale: string }> };

export default async function PortalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/login`);
  const isKk = locale === "kk";

  const quickCards = [
    { title: isKk ? "Жаңалықтар" : "Новости", href: "/news", icon: Newspaper, color: "bg-blue-500" },
    { title: isKk ? "Ішкі жаңалықтар" : "Внутренние новости", href: "/internal-news", icon: Newspaper, color: "bg-indigo-500" },
    { title: isKk ? "Санаторий" : "Санаторий", href: "/sanatorium", icon: Heart, color: "bg-emerald-500" },
    { title: isKk ? "Вакансиялар" : "Вакансии", href: "/vacancies", icon: Briefcase, color: "bg-amber-500" },
    { title: isKk ? "Жазғы лагерь" : "Летний лагерь", href: "/summer-camp", icon: Sun, color: "bg-orange-500" },
    { title: isKk ? "ЦЖС-Аруы" : "ЦЖС-Аруы", href: "/beauty-contest", icon: Crown, color: "bg-pink-500" },
    { title: isKk ? "Спорт" : "Спорт", href: "/sports", icon: Trophy, color: "bg-red-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <Card className="mb-8 border-[#003DA5] bg-gradient-to-r from-[#003DA5] to-[#0066CC] text-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {isKk ? "Қош келдіңіз" : "Добро пожаловать"}, {session.user.name}!
              </h1>
              <div className="mt-1 flex flex-wrap gap-2 text-sm text-blue-100">
                {session.user.department && <span>{session.user.department}</span>}
                <Badge className="bg-white/20 text-white">
                  <Shield className="mr-1 h-3 w-3" />
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {quickCards.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="group h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div className={`${item.color} flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{item.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
