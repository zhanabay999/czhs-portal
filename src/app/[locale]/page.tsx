import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Newspaper,
  Heart,
  Briefcase,
  Sun,
  RefreshCcw,
  Flower2,
  Trophy,
  ArrowRight,
  Calendar,
  Bell,
  FileText,
  Users,
  Shield,
} from "lucide-react";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

type Props = {
  params: Promise<{ locale: string }>;
};

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
  const gridNews = latestNews.slice(1, 3);
  const sidebarNews = latestNews.slice(3, 7);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(
      locale === "kk" ? "kk-KZ" : "ru-RU",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  const services = [
    { key: "sanatorium", href: "/sanatorium", icon: Heart, iconBg: "bg-red-50", iconColor: "text-red-600" },
    { key: "vacancies", href: "/vacancies", icon: Briefcase, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { key: "summerCamp", href: "/summer-camp", icon: Sun, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { key: "faq", href: "/reorganization-faq", icon: RefreshCcw, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { key: "beautyContest", href: "/beauty-contest", icon: Flower2, iconBg: "bg-pink-50", iconColor: "text-pink-600" },
    { key: "sports", href: "/sports", icon: Trophy, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { key: "zhylyZhurekpen", href: "/zhyly-zhurekpen", icon: Heart, iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  ];

  const serviceDescriptions: Record<string, string> = {
    sanatorium: isKk
      ? "Қызметкерлер мен олардың отбасыларына арналған сауықтыру бағдарламалары"
      : "Программы оздоровления для сотрудников и их семей",
    vacancies: isKk
      ? "Магистральдық желі дирекциясындағы бос жұмыс орындары"
      : "Актуальные вакансии в Дирекции магистральной сети",
    summerCamp: isKk
      ? "Балалар лагерьлері мен жазғы демалыс бағдарламалары"
      : "Детские лагеря и программы летнего отдыха",
    faq: isKk
      ? "Қайта ұйымдастыру процестері туралы ақпарат"
      : "Информация о реорганизационных процессах",
    beautyContest: isKk
      ? "Әлеуметтік қолдау және қайырымдылық"
      : "Социальная поддержка и благотворительность",
    sports: isKk
      ? "Спорттық іс-шаралар мен жарыстар"
      : "Спортивные мероприятия и соревнования",
    zhylyZhurekpen: isKk
      ? "«Жылы жүрекпен» әлеуметтік жобасы"
      : "Социальный проект «Жылы Жүрекпен»",
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] md:h-[580px] lg:h-[620px]">
          {featured?.coverImageUrl ? (
            <img
              alt={isKk ? featured.titleKk : featured.titleRu}
              className="absolute inset-0 h-full w-full object-cover"
              src={featured.coverImageUrl}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#003DA5] via-[#002D7A] to-[#001a4d]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/30" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">
            <div className="max-w-2xl">
              {featured?.isPinned && (
                <span className="mb-4 inline-flex items-center justify-center rounded-md bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  {isKk ? "Маңызды" : "Важное"}
                </span>
              )}
              <h1 className="mb-4 text-balance text-3xl font-bold leading-tight text-primary-foreground md:text-4xl lg:text-5xl">
                {featured
                  ? isKk ? featured.titleKk : featured.titleRu
                  : t("heroTitle")}
              </h1>
              <p className="mb-6 max-w-lg text-base leading-relaxed text-primary-foreground/80 md:text-lg">
                {featured
                  ? (isKk ? featured.excerptKk : featured.excerptRu) || t("heroSubtitle")
                  : t("heroSubtitle")}
              </p>
              {featured && (
                <div className="mb-8 flex items-center gap-3 text-sm text-primary-foreground/60">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(featured.publishedAt)}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {featured ? (
                  <Link
                    href={`/news/${featured.slug}`}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    {tc("readMore")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                ) : null}
                <Link
                  href="/news"
                  className="inline-flex h-10 items-center rounded-md border border-primary-foreground/30 px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  {isKk ? "Барлық жаңалықтар" : "Все новости"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-primary">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-primary-foreground/15">
              {[
                { value: ">55 000", label: isKk ? "Қызметкер" : "Работников" },
                { value: ">21 000", label: isKk ? "Километр — ел теміржолдарының ұзындығы" : "Километров составляет протяжённость железных дорог страны" },
                { value: "19", label: isKk ? "Қазақстан теміржол ұзындығы бойынша әлемде орын алады" : "Место в мире занимает Казахстан по протяжённости железных дорог" },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-5 text-center">
                  <p className="text-xl font-bold text-primary-foreground md:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-primary-foreground/70 md:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                {isKk ? "Жаңалықтар" : "Новости"}
              </p>
              <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
                {isKk ? "Актуалды оқиғалар" : "Актуальные события"}
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:flex"
            >
              {tc("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featured ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left: Featured + 2 smaller */}
              <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
                {/* Featured large article */}
                <Link
                  href={`/news/${featured.slug}`}
                  className="group md:col-span-2"
                >
                  <article>
                    <div className="relative mb-4 h-72 overflow-hidden rounded-xl md:h-80">
                      {featured.coverImageUrl ? (
                        <img
                          alt={isKk ? featured.titleKk : featured.titleRu}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={featured.coverImageUrl}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-[#0066CC]">
                          <Newspaper className="h-16 w-16 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {featured.isPinned && (
                          <span className="mb-3 inline-flex items-center justify-center rounded-md border-0 bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                            {isKk ? "Маңызды" : "Важное"}
                          </span>
                        )}
                        <h3 className="mb-2 text-xl font-bold text-primary-foreground decoration-2 underline-offset-4 group-hover:underline md:text-2xl">
                          {isKk ? featured.titleKk : featured.titleRu}
                        </h3>
                        <p className="line-clamp-2 text-sm text-primary-foreground/75">
                          {isKk ? featured.excerptKk : featured.excerptRu}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>

                {/* Two smaller articles */}
                {gridNews.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group"
                  >
                    <article>
                      <div className="relative mb-3 h-48 overflow-hidden rounded-xl">
                        {article.coverImageUrl ? (
                          <img
                            alt={isKk ? article.titleKk : article.titleRu}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={article.coverImageUrl}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/80 to-[#0066CC]/80">
                            <Newspaper className="h-10 w-10 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <h3 className="mb-1 line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                        {isKk ? article.titleKk : article.titleRu}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {isKk ? article.excerptKk : article.excerptRu}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Right sidebar: Latest news list */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-5 text-lg font-bold text-foreground">
                  {t("latestNews")}
                </h3>
                <div className="flex flex-col gap-0">
                  {sidebarNews.map((article, idx) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="group"
                    >
                      <article
                        className={`py-4 ${
                          idx < sidebarNews.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        <h4 className="mb-1.5 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {isKk ? article.titleKk : article.titleRu}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/news"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-secondary"
                >
                  {isKk ? "Барлық жаңалықтар" : "Все новости"}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>

              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <Newspaper className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">
                {isKk ? "Жаңалықтар жақында жарияланады" : "Новости скоро появятся"}
              </p>
            </div>
          )}

          {/* Mobile "View all" */}
          <div className="mt-6 md:hidden">
            <Link
              href="/news"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-secondary"
            >
              {isKk ? "Барлық жаңалықтарды көру" : "Смотреть все новости"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-secondary/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
              {isKk ? "Сервистер" : "Сервисы"}
            </p>
            <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
              {isKk ? "Қызметкерлерге арналған қызметтер" : "Услуги для сотрудников"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground md:text-base">
              {isKk
                ? "Компанияның негізгі сервистері мен бағдарламаларына жылдам қол жеткізу"
                : "Быстрый доступ к основным сервисам и программам компании"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.key}
                href={service.href}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${service.iconBg} ${service.iconColor}`}
                >
                  <service.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {tn(service.key)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {serviceDescriptions[service.key]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Portal CTA */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-balance text-2xl font-bold text-primary-foreground md:text-3xl lg:text-4xl">
                {isKk ? "Қызметкер порталы" : "Портал сотрудника"}
              </h2>
              <p className="mb-8 max-w-lg text-base leading-relaxed text-primary-foreground/75 md:text-lg">
                {isKk
                  ? "Ішкі жаңалықтар, конкурстар, құжаттар және Магистральдық желі дирекциясының әр қызметкері үшін көбірек мүмкіндіктер."
                  : "Внутренние новости, конкурсы, документы и больше возможностей для каждого сотрудника Дирекции магистральной сети."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  {isKk ? "Порталға кіру" : "Войти в портал"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center rounded-md border border-primary-foreground/30 px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  {isKk ? "Көбірек білу" : "Узнать больше"}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Bell, label: isKk ? "Хабарламалар" : "Уведомления" },
                { icon: FileText, label: isKk ? "Құжаттар" : "Документы" },
                { icon: Users, label: isKk ? "Конкурстар" : "Конкурсы" },
                { icon: Shield, label: isKk ? "Қауіпсіздік" : "Безопасность" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 rounded-xl border border-primary-foreground/10 bg-primary-foreground/10 p-6 backdrop-blur-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/15">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-primary-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
