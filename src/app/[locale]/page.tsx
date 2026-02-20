import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Newspaper,
  Heart,
  Briefcase,
  Sun,
  HelpCircle,
  Crown,
  Trophy,
  ArrowRight,
  Train,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { newsArticles, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type Props = {
  params: Promise<{ locale: string }>;
};

const quickLinks = [
  {
    key: "news",
    href: "/news",
    icon: Newspaper,
    color: "bg-blue-500",
  },
  {
    key: "sanatorium",
    href: "/sanatorium",
    icon: Heart,
    color: "bg-emerald-500",
  },
  {
    key: "vacancies",
    href: "/vacancies",
    icon: Briefcase,
    color: "bg-amber-500",
  },
  {
    key: "summerCamp",
    href: "/summer-camp",
    icon: Sun,
    color: "bg-orange-500",
  },
  {
    key: "faq",
    href: "/reorganization-faq",
    icon: HelpCircle,
    color: "bg-purple-500",
  },
  {
    key: "beautyContest",
    href: "/beauty-contest",
    icon: Crown,
    color: "bg-pink-500",
  },
  {
    key: "sports",
    href: "/sports",
    icon: Trophy,
    color: "bg-red-500",
  },
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let latestNews: Array<{
    id: string;
    slug: string;
    titleKk: string;
    titleRu: string;
    excerptKk: string | null;
    excerptRu: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | null;
    categoryId: string | null;
  }> = [];

  try {
    latestNews = await db
      .select({
        id: newsArticles.id,
        slug: newsArticles.slug,
        titleKk: newsArticles.titleKk,
        titleRu: newsArticles.titleRu,
        excerptKk: newsArticles.excerptKk,
        excerptRu: newsArticles.excerptRu,
        coverImageUrl: newsArticles.coverImageUrl,
        publishedAt: newsArticles.publishedAt,
        categoryId: newsArticles.categoryId,
      })
      .from(newsArticles)
      .where(eq(newsArticles.status, "published"))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(6);
  } catch {
    // DB may not be ready yet
  }

  return <HomeContent locale={locale} latestNews={latestNews} />;
}

function HomeContent({
  locale,
  latestNews,
}: {
  locale: string;
  latestNews: Array<{
    id: string;
    slug: string;
    titleKk: string;
    titleRu: string;
    excerptKk: string | null;
    excerptRu: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | null;
  }>;
}) {
  const t = useTranslations("home");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const isKk = locale === "kk";

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003DA5] via-[#0052D4] to-[#0066CC] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2030h60M30%200v60%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')]" />
        </div>
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              <Train className="h-4 w-4" />
              <span>{tc("companyName")}</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mb-8 text-lg text-blue-100 lg:text-xl">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[#C8A951] text-[#1A1A2E] hover:bg-[#D4B862]"
              >
                <Link href="/news">
                  {tn("news")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/login">{tc("login")}</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative train track line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C8A951] to-transparent" />
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#003DA5]">
            {t("quickLinks")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {quickLinks.map((item) => (
              <Link key={item.key} href={item.href}>
                <Card className="group h-full cursor-pointer border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    <div
                      className={`${item.color} flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium leading-tight">
                      {tn(item.key)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#003DA5]">
              {t("latestNews")}
            </h2>
            <Button asChild variant="ghost" className="text-[#003DA5]">
              <Link href="/news">
                {tc("viewAll")}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <Card className="group h-full cursor-pointer overflow-hidden border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#003DA5] to-[#0066CC]">
                      {article.coverImageUrl ? (
                        <img
                          src={article.coverImageUrl}
                          alt={isKk ? article.titleKk : article.titleRu}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Newspaper className="h-12 w-12 text-white/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      {article.publishedAt && (
                        <p className="mb-2 text-xs text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString(
                            locale === "kk" ? "kk-KZ" : "ru-RU",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      )}
                      <h3 className="mb-2 line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-[#003DA5]">
                        {isKk ? article.titleKk : article.titleRu}
                      </h3>
                      {(isKk ? article.excerptKk : article.excerptRu) && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {isKk ? article.excerptKk : article.excerptRu}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
              <Newspaper className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-muted-foreground">
                {isKk
                  ? "Жаңалықтар жақында жарияланады"
                  : "Новости скоро появятся"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#003DA5] to-[#0066CC] py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
            {isKk
              ? "Қызметкер порталына қосылыңыз"
              : "Присоединяйтесь к порталу сотрудника"}
          </h2>
          <p className="mb-8 text-blue-100">
            {isKk
              ? "Ішкі жаңалықтар, конкурстар және көбірек мүмкіндіктер"
              : "Внутренние новости, конкурсы и больше возможностей"}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#C8A951] text-[#1A1A2E] hover:bg-[#D4B862]"
          >
            <Link href="/login">
              {tc("login")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
