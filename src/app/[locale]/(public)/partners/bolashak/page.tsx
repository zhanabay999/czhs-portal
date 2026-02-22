import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ExternalLink, Heart, Newspaper, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableSection } from "./expandable-section";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

type Props = { params: Promise<{ locale: string }> };

export default async function BolashakPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  let latestNews: Array<{
    slug: string;
    titleKk: string;
    titleRu: string;
    excerptKk: string | null;
    excerptRu: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | null;
  }> = [];

  try {
    latestNews = await db
      .select({
        slug: newsArticles.slug,
        titleKk: newsArticles.titleKk,
        titleRu: newsArticles.titleRu,
        excerptKk: newsArticles.excerptKk,
        excerptRu: newsArticles.excerptRu,
        coverImageUrl: newsArticles.coverImageUrl,
        publishedAt: newsArticles.publishedAt,
      })
      .from(newsArticles)
      .where(
        and(
          eq(newsArticles.status, "published"),
          eq(newsArticles.isInternal, false)
        )
      )
      .orderBy(desc(newsArticles.publishedAt))
      .limit(4);
  } catch {}

  const clinics = isKk
    ? [
        "Клиника № 1 — Астана",
        "Клиника № 2 — Алматы",
        "Клиника № 3 — Шымкент",
        "Клиника № 4 — Қарағанды",
        "Клиника № 5 — Ақтау",
      ]
    : [
        "Клиника № 1 — Астана",
        "Клиника № 2 — Алматы",
        "Клиника № 3 — Шымкент",
        "Клиника № 4 — Караганда",
        "Клиника № 5 — Актау",
      ];

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(isKk ? "kk-KZ" : "ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isKk ? "Артқа" : "Назад"}
        </Link>
      </Button>

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#003DA5]/10">
          <Heart className="h-12 w-12 text-[#003DA5]" />
        </div>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk
            ? "«Болашақ» қайырымдылық қоры"
            : "Благотворительный фонд «Болашак»"}
        </h1>
      </div>

      {/* Описание */}
      <div className="prose max-w-none space-y-4 text-gray-700">
        {isKk ? (
          <>
            <p>
              «Болашақ» қайырымдылық қоры — «Болашақ» Қауымдастығының
              корпоративтік қоры, ол Қазақстанда білім беру, денсаулық сақтау
              және әлеуметтік саланы дамытуға бағытталған әлеуметтік
              бастамалар мен жобаларды қолдаумен айналысады. Қор жобаларға
              ұйымдастырушылық, ақпараттық және талдамалық қолдау көрсетіп,
              компаниялар, мемлекеттік құрылымдар мен қоғамдық ұйымдардың
              өзара іс-қимыл жасау алаңын құрады.
            </p>
            <p>
              Қор коммерциялық емес қызмет қағидаттары негізінде жұмыс істейді,
              қоғамға нақты пайда әкелетін және корпоративтік сектордың
              әлеуметтік жауапкершілігін нығайтатын ұзақ мерзімді әлеуметтік
              бағдарламалар мен бастамаларды дамытуға назар аударады.
            </p>
            <p>
              Қордың мақсаты — білім беру, мәдени және әлеуметтік жобаларды
              қолдау арқылы қоғамның тұрақты дамуына ықпал ету, маңызды
              әлеуметтік нәтижелерге жету үшін әртүрлі қатысушылардың
              ресурстарын, сараптамасын және тәжірибесін біріктіру.
            </p>
          </>
        ) : (
          <>
            <p>
              Благотворительный фонд «Болашак» — корпоративный фонд Ассоциации
              «Болашак», который занимается поддержкой социальных инициатив и
              проектов, направленных на развитие образования, здравоохранения и
              социальной сферы в Казахстане. Фонд обеспечивает организационную,
              информационную и аналитическую поддержку проектов, создавая
              платформу для взаимодействия компаний, государственных структур и
              общественных организаций.
            </p>
            <p>
              Фонд действует на принципах некоммерческой деятельности,
              концентрируясь на развитии долгосрочных социальных программ и
              инициатив, которые приносят реальную пользу обществу и укрепляют
              социальную ответственность корпоративного сектора.
            </p>
            <p>
              Цель фонда — способствовать устойчивому развитию общества через
              поддержку образовательных, культурных и социальных проектов,
              объединяя ресурсы, экспертизу и опыт различных участников для
              достижения значимых социальных результатов.
            </p>
          </>
        )}
      </div>

      {/* Список клиник */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-[#003DA5]">
          {isKk ? "Клиникалар тізімі" : "Список клиник"}
        </h2>
        <ExpandableSection
          title={isKk ? "Клиникаларды көру" : "Показать клиники"}
        >
          <ul className="space-y-2">
            {clinics.map((clinic, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5]/10 text-xs font-bold text-[#003DA5]">
                  {i + 1}
                </span>
                {clinic}
              </li>
            ))}
          </ul>
        </ExpandableSection>
      </div>

      {/* Новости */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-[#003DA5]">
          {isKk ? "Жаңалықтар" : "Новости"}
        </h2>
        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {latestNews.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={isKk ? article.titleKk : article.titleRu}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#003DA5]/80 to-[#0066CC]/80">
                      <Newspaper className="h-8 w-8 text-white/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-gray-800 transition-colors group-hover:text-[#003DA5]">
                    {isKk ? article.titleKk : article.titleRu}
                  </h3>
                  {(isKk ? article.excerptKk : article.excerptRu) && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                      {isKk ? article.excerptKk : article.excerptRu}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <Newspaper className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">
              {isKk ? "Жаңалықтар жоқ" : "Новостей пока нет"}
            </p>
          </div>
        )}

        {latestNews.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/news">
                {isKk ? "Барлық жаңалықтар" : "Все новости"}
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="https://www.instagram.com/bolashakcharity"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#003DA5] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002D7A]"
        >
          Instagram — @bolashakcharity
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
