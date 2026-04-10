import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Newspaper,
  Stethoscope,
  Briefcase,
  Sun,
  HelpCircle,
  Crown,
  Medal,
  HeartHandshake,
  UserCog,
  ArrowRight,
  Calendar,
  Bell,
  FileText,
  Users,
  Shield,
} from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { db } from "@/db";
import { newsArticles, heroSlides } from "@/db/schema";
import { desc, eq, and, asc } from "drizzle-orm";

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
    coverImageUrlKk: string | null;
    coverImageUrlRu: string | null;
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
        coverImageUrlKk: newsArticles.coverImageUrlKk,
        coverImageUrlRu: newsArticles.coverImageUrlRu,
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

  let slideUrls: string[] = [];
  try {
    const slides = await db.select({ imageUrl: heroSlides.imageUrl }).from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(asc(heroSlides.sortOrder));
    slideUrls = slides.map(s => s.imageUrl);
  } catch {}

  return <HomeContent locale={locale} latestNews={latestNews} slideUrls={slideUrls} />;
}

function HomeContent({
  locale,
  latestNews,
  slideUrls,
}: {
  slideUrls: string[];
  locale: string;
  latestNews: Array<{
    id: string;
    slug: string;
    titleKk: string;
    titleRu: string;
    excerptKk: string | null;
    excerptRu: string | null;
    coverImageUrl: string | null;
    coverImageUrlKk: string | null;
    coverImageUrlRu: string | null;
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
    { key: "sanatorium", href: "/sanatorium", icon: Stethoscope, iconBg: "bg-teal-50", iconColor: "text-teal-600" },
    { key: "vacancies", href: "/vacancies", icon: Briefcase, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { key: "summerCamp", href: "/summer-camp", icon: Sun, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { key: "faq", href: "/reorganization-faq", icon: HelpCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { key: "beautyContest", href: "/beauty-contest", icon: Crown, iconBg: "bg-pink-50", iconColor: "text-pink-600" },
    { key: "sports", href: "/sports", icon: Medal, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { key: "zhylyZhurekpen", href: "/zhyly-zhurekpen", icon: HeartHandshake, iconBg: "bg-orange-50", iconColor: "text-orange-600" },
    { key: "leadership", href: "/leadership", icon: UserCog, iconBg: "bg-violet-50", iconColor: "text-violet-600" },
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
      ? "Байқаулар мен конкурстар туралы ақпарат"
      : "Информация о конкурсах и соревнованиях",
    sports: isKk
      ? "Спорттық іс-шаралар мен жарыстар"
      : "Спортивные мероприятия и соревнования",
    zhylyZhurekpen: isKk
      ? "«Жылы жүрекпен» әлеуметтік жобасы"
      : "Социальный проект «Жылы Жүрекпен»",
    leadership: isKk
      ? "Компания басшылығының құрылымы"
      : "Структура руководства компании",
  };

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <HeroCarousel slides={slideUrls} />

        {/* Stats Bar */}
        <div className="bg-primary">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 divide-y divide-primary-foreground/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
                      {(isKk ? featured.coverImageUrlKk : featured.coverImageUrlRu) || featured.coverImageUrl ? (
                        <img
                          alt={isKk ? featured.titleKk : featured.titleRu}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={((isKk ? featured.coverImageUrlKk : featured.coverImageUrlRu) || featured.coverImageUrl)!}
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
                        {(isKk ? article.coverImageUrlKk : article.coverImageUrlRu) || article.coverImageUrl ? (
                          <img
                            alt={isKk ? article.titleKk : article.titleRu}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={((isKk ? article.coverImageUrlKk : article.coverImageUrlRu) || article.coverImageUrl)!}
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

      {/* Employee Portal CTA — temporarily hidden */}

      {/* Instagram */}
      <section className="py-10">
        <div className="container mx-auto flex justify-center px-4">
          <a
            href="https://www.instagram.com/czhs_KTZ_OFFICIAL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-8 py-4 transition-all hover:border-pink-300 hover:shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-pink-500" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-foreground">@czhs_KTZ_OFFICIAL</p>
              <p className="text-xs text-muted-foreground">
                {isKk ? "Бізді Instagram-да жазылыңыз" : "Подписывайтесь на нас в Instagram"}
              </p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
