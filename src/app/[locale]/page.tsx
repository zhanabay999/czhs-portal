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
  ChevronRight,
  Clock,
} from "lucide-react";
import { NewsCarousel } from "@/components/NewsCarousel";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

type Props = {
  params: Promise<{ locale: string }>;
};

const sectionLinks = [
  { key: "sanatorium", href: "/sanatorium", icon: Heart, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "vacancies", href: "/vacancies", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "summerCamp", href: "/summer-camp", icon: Sun, color: "text-orange-600", bg: "bg-orange-50" },
  { key: "faq", href: "/reorganization-faq", icon: HelpCircle, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "beautyContest", href: "/beauty-contest", icon: Crown, color: "text-pink-600", bg: "bg-pink-50" },
  { key: "sports", href: "/sports", icon: Trophy, color: "text-red-600", bg: "bg-red-50" },
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
    isPinned: boolean;
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
        isPinned: newsArticles.isPinned,
      })
      .from(newsArticles)
      .where(
        and(
          eq(newsArticles.status, "published"),
          eq(newsArticles.isInternal, false)
        )
      )
      .orderBy(desc(newsArticles.isPinned), desc(newsArticles.publishedAt))
      .limit(10);
  } catch {}

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
    isPinned: boolean;
  }>;
}) {
  const t = useTranslations("home");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const isKk = locale === "kk";

  const featured = latestNews[0];
  const restNews = latestNews.slice(1, 7);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(
      locale === "kk" ? "kk-KZ" : "ru-RU",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <div className="bg-white">
      {/* Featured + Latest News */}
      <section className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Section heading */}
          <div className="mb-6 flex items-center justify-between border-b-2 border-[#003DA5] pb-3">
            <h2 className="text-xl font-bold text-[#003DA5]">
              {isKk ? "Актуалды" : "Актуально"}
            </h2>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm font-medium text-[#003DA5] hover:underline"
            >
              {tc("viewAll")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {featured ? (
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Featured article - takes 3 columns */}
              <div className="lg:col-span-3">
                <Link href={`/news/${featured.slug}`} className="group block">
                  <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                    {featured.coverImageUrl ? (
                      <img
                        src={featured.coverImageUrl}
                        alt={isKk ? featured.titleKk : featured.titleRu}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#003DA5] to-[#0066CC]">
                        <Newspaper className="h-16 w-16 text-white/30" />
                      </div>
                    )}
                    {featured.isPinned && (
                      <span className="absolute left-3 top-3 rounded bg-[#C8A951] px-2 py-1 text-xs font-bold text-white">
                        {isKk ? "Маңызды" : "Важное"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <time>{formatDate(featured.publishedAt)}</time>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#003DA5]">
                    {isKk ? featured.titleKk : featured.titleRu}
                  </h3>
                  {(isKk ? featured.excerptKk : featured.excerptRu) && (
                    <p className="mt-3 text-base leading-relaxed text-gray-600">
                      {isKk ? featured.excerptKk : featured.excerptRu}
                    </p>
                  )}
                </Link>
              </div>

              {/* Side news list - takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="divide-y divide-gray-100">
                  {restNews.map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="group block py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <time>{formatDate(article.publishedAt)}</time>
                        {article.isPinned && (
                          <span className="rounded bg-[#C8A951]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#C8A951]">
                            {isKk ? "Маңызды" : "Важное"}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1.5 text-sm font-semibold leading-snug text-gray-800 transition-colors group-hover:text-[#003DA5]">
                        {isKk ? article.titleKk : article.titleRu}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
              <Newspaper className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">
                {isKk ? "Жаңалықтар жақында жарияланады" : "Новости скоро появятся"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section Links Grid */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {sectionLinks.map((item) => (
              <Link key={item.key} href={item.href} className="group">
                <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-5 text-center transition-all hover:border-[#003DA5]/30 hover:shadow-md">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium leading-tight text-gray-700 group-hover:text-[#003DA5]">
                    {tn(item.key)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 border-b-2 border-[#003DA5] pb-3">
            <h2 className="text-xl font-bold text-[#003DA5]">
              {isKk ? "Біздің серіктестер" : "Наши партнёры"}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Bolashak Charity */}
            <Link href="/partners/bolashak" className="group flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center transition-all hover:border-[#003DA5]/30 hover:shadow-md">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#003DA5]/10">
                <Heart className="h-10 w-10 text-[#003DA5]" />
              </div>
              <h3 className="mb-2 text-sm font-bold text-gray-900 group-hover:text-[#003DA5]">
                BOLASHAK CHARITY
              </h3>
              <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#003DA5]">
                {isKk ? "Толығырақ" : "Подробнее"} <ChevronRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Sabi Health */}
            <Link href="/partners/sabi" className="group flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center transition-all hover:border-[#003DA5]/30 hover:shadow-md">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Sun className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-sm font-bold text-gray-900 group-hover:text-[#003DA5]">
                SABI HEALTH
              </h3>
              <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#003DA5]">
                {isKk ? "Толығырақ" : "Подробнее"} <ChevronRight className="h-3 w-3" />
              </span>
            </Link>

            {/* RCLA */}
            <Link href="/partners/rcla" className="group flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center transition-all hover:border-[#003DA5]/30 hover:shadow-md">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                <HelpCircle className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="mb-2 text-sm font-bold text-gray-900 group-hover:text-[#003DA5]">
                {isKk
                  ? "Заң кеңесшілерінің Республикалық алқасы"
                  : "Республиканская Коллегия Юридических Консультантов"}
              </h3>
              <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#003DA5]">
                {isKk ? "Толығырақ" : "Подробнее"} <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      {latestNews.length > 0 && (
        <section>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between border-b-2 border-[#003DA5] pb-3">
              <h2 className="text-xl font-bold text-[#003DA5]">{t("latestNews")}</h2>
              <Link
                href="/news"
                className="flex items-center gap-1 text-sm font-medium text-[#003DA5] hover:underline"
              >
                {tc("viewAll")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <NewsCarousel
              articles={latestNews}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* Employee Portal CTA */}
      <section className="border-t border-gray-200 bg-[#003DA5]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div className="text-white">
            <h3 className="text-lg font-bold">
              {isKk ? "Қызметкер порталы" : "Портал сотрудника"}
            </h3>
            <p className="text-sm text-blue-200">
              {isKk
                ? "Ішкі жаңалықтар, конкурстар және көбірек мүмкіндіктер"
                : "Внутренние новости, конкурсы и больше возможностей"}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-[#003DA5] transition-colors hover:bg-gray-100"
          >
            {tc("login")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
